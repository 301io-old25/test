'use client';
import { get } from 'lodash';
import path from 'path';

let serverConfig: any;

if (typeof window === 'undefined') {
  try {
    // Absolute path to public folder
    const fs = require('fs');
    const configPath = path.join(process.cwd(), 'public/runtime-config.js');
    const content = fs.readFileSync(configPath, 'utf-8');

    // runtime-config.js format: window.__CONFIG__ = {...};
    // extract JSON object
    const jsonString = content
      .replace(/^window\.__CONFIG__\s*=\s*/, '')
      .replace(/;\s*$/, '')
      .trim();

    serverConfig = jsonString ? JSON.parse(jsonString) : {};
  } catch (err) {
    console.warn('Failed to read runtime-config.js', err);
    serverConfig = {};
  }
}

declare global {
  interface Window {
    __CONFIG__?: Record<string, any>;
  }
}

export const getEnvVar = (key: string) => {
  if (typeof window !== 'undefined') {
    return get(window.__CONFIG__, key, null);
  }

  return get(serverConfig, key, null);
};

export const CONFIG = {
  APP_NAME: 'Reckitt',
  AUTH_USER: 'AUTH_USER',
  AUTH_USER_TOKEN: 'AUTH_USER_TOKEN',
  AUTH_USER_REFRESH_TOKEN: 'AUTH_USER_REFRESH_TOKEN',
  get NEXT_PUBLIC_OKTA_CLIENT_ID() {
    return (
      getEnvVar('NEXT_PUBLIC_OKTA_CLIENT_ID') ||
      getEnvVar('NEXT_PUBLIC_OKTA_CLIENT_ID')
    );
  },
  get NEXT_PUBLIC_OKTA_LOGIN_URL() {
    return (
      getEnvVar('NEXT_PUBLIC_OKTA_LOGIN_URL') ||
      getEnvVar('NEXT_PUBLIC_OKTA_LOGIN_URL')
    );
  },
  get NEXT_PUBLIC_BASE_URL() {
    return (
      getEnvVar('NEXT_PUBLIC_BASE_URL') || getEnvVar('NEXT_PUBLIC_BASE_URL')
    );
  },
  get NEXT_PUBLIC_OKTA_REDIRECT_URL() {
    return (
      getEnvVar('NEXT_PUBLIC_OKTA_REDIRECT_URL') ||
      getEnvVar('NEXT_PUBLIC_OKTA_REDIRECT_URL')
    );
  },
  get REDIRECT_URL() {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return (
      getEnvVar('NEXT_PUBLIC_OKTA_REDIRECT_URL') ||
      getEnvVar('NEXT_PUBLIC_OKTA_REDIRECT_URL')
    );
  }
};
