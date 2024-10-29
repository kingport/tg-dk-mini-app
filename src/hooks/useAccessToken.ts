import { localGet } from '@/utils/util';
import { useState } from 'react';

export default function useAccessToken() {
  // 是否存在token

  const [existToken, setExistToken] = useState<boolean>(localGet('access_token') ? true : false);

  return { existToken };
}
