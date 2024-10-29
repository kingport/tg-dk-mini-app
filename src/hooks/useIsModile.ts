import { localGet } from '@/utils/util';
import { useState } from 'react';

export default function useIsMobile() {
  // 是否存在token

  const [isMobile] = useState<boolean>(/Mobile|webOS|iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  return { isMobile };
}
