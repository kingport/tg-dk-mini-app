// src/components/rtl-provider.js

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtl from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';

// NB: A unique `key` is important for it to work!
const options = {
  rtl: { key: 'css-ar', stylisPlugins: [rtl] },
  ltr: { key: 'css-en' },
};

export function RtlProvider({ children }) {
  const { i18n } = useTranslation();
  const dir = i18n.language == 'ar_AR' ? 'rtl' : 'ltr';
  const cache = createCache(options[dir]);
  return <CacheProvider value={cache} children={children} />;
}
