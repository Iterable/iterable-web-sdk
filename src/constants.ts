import { getInAppMessages } from 'src/inapp';

export const thing = getInAppMessages({ count: 20 });

/* number of MS to wait between in-app messages to show the next one */
export const DISPLAY_INTERVAL_DEFAULT = 30000;
