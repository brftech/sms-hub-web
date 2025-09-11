import { useEffect } from 'react';
import { useHub } from '@sms-hub/ui';
import { HUB_CONFIGS } from '@sms-hub/types';

const hubIcons: Record<string, string> = {
  gnymble: '/favicon-gnymble.svg',
  percytech: '/percytech-icon-logo.svg',
  percymd: '/percymd-icon-logo.svg',
  percytext: '/percytext-icon-logo.svg',
};

export function DynamicFavicon() {
  const { currentHub } = useHub();

  useEffect(() => {
    // Update favicon
    const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (favicon && hubIcons[currentHub]) {
      favicon.href = hubIcons[currentHub];
    }

    // Update the title to include hub name
    const hubName = HUB_CONFIGS[currentHub]?.name || currentHub;
    document.title = `${hubName} - SMS Hub Platform`;
  }, [currentHub]);

  return null;
}