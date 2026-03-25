import { Settings } from '../types';
import { DEFAULT_CHANNELS } from '../constants';

const SETTINGS_KEY = 'cf_settings';

export function getInitialSettings(): Settings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  const defaultSettings: Settings = {
    sheetsUrl: '',
    lastSync: 0,
    channels: DEFAULT_CHANNELS,
    notificationsEnabled: true,
  };
  
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...defaultSettings, ...parsed };
    } catch (e) {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export function saveLocalSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
