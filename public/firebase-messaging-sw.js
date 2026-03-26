importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  projectId: "gen-lang-client-0168931971",
  appId: "1:1087797188686:web:77678503ad437404ee0b1f",
  apiKey: "AIzaSyBjey52uT2zlr2GlWLNchEQtuHYWTQJWBw",
  authDomain: "gen-lang-client-0168931971.firebaseapp.com",
  messagingSenderId: "1087797188686"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
