import level0 from '@assets/v0.png';
import level1 from '@assets/v1.png';
import level2 from '@assets/v2.png';
import level3 from '@assets/v3.png';
import level4 from '@assets/v4.png';
import level5 from '@assets/v5.png';
import level6 from '@assets/v6.png';
import level7 from '@assets/v7.png';
import level8 from '@assets/v8.png';
import level9 from '@assets/v9.png';

// 钱包 Dapp 浏览器 userAgent

export const DAPP_USER_AGENT = ['TokenPocket', 'MetaMask', 'Trust', 'MathWallet', 'imToken', 'Token'];

interface TOKEN_CONTRACT_ADDRESSES_TYPE {
  [key: string]: `0x${string}`;
}

export const TOKEN_CONTRACT_ADDRESSES: TOKEN_CONTRACT_ADDRESSES_TYPE = {
  USDT: '0x55d398326f99059fF775485246999027B3197955',
  BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
};

export const LEVEL_ICON = [level0, level1, level2, level3, level4, level5, level6, level7, level8, level9];
