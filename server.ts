import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase config
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8'));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin
  const adminApp = admin.initializeApp({
    projectId: firebaseConfig.projectId
  });

  // Use the specific database ID from the config
  const db = getFirestore(firebaseConfig.firestoreDatabaseId);
  const messaging = getMessaging(adminApp);

  console.log('Starting notification listener...');
  
  // Listen for new notifications
  db.collection('notifications').onSnapshot(snapshot => {
    console.log(`Notification snapshot received. Count: ${snapshot.size}`);
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        const { targetUserKey, title, body } = data;
        
        console.log(`Processing notification for ${targetUserKey}: "${title}"`);
        
        try {
          // Get user's token
          const userDoc = await db.collection('users').doc(targetUserKey).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            const fcmToken = userData?.fcmToken;
            
            if (fcmToken) {
              console.log(`Found token for ${targetUserKey}: ${fcmToken.substring(0, 10)}...`);
              const appUrl = process.env.APP_URL || 'https://ais-dev-ox6ym4bkpli4s27pyhkqej-186553228772.asia-southeast1.run.app';
              
              const message = {
                token: fcmToken,
                notification: { title, body },
                webpush: {
                  notification: {
                    title,
                    body,
                    icon: `${appUrl}/icons/icon-192.png`,
                    badge: `${appUrl}/icons/icon-192.png`,
                    click_action: appUrl,
                  },
                  fcmOptions: {
                    link: appUrl
                  }
                }
              };

              const response = await messaging.send(message);
              console.log(`Successfully sent message to ${targetUserKey}. Response:`, response);
            } else {
              console.warn(`No FCM token found in document for user ${targetUserKey}`);
            }
          } else {
            console.warn(`User document not found for ${targetUserKey} in 'users' collection`);
          }
        } catch (err) {
          console.error(`Error sending notification to ${targetUserKey}:`, err);
        } finally {
          // Always delete the notification document after processing to keep the collection clean
          try {
            await change.doc.ref.delete();
            console.log(`Deleted notification document ${change.doc.id}`);
          } catch (deleteErr) {
            console.error('Error deleting processed notification:', deleteErr);
          }
        }
      }
    });
  }, err => {
    console.error('Notification listener error:', err);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
