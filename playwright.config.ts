import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    headless: true,
    channel: process.env.NODE_ENV === 'production' ? 'chrome' : undefined,
  },
};

export default config;
