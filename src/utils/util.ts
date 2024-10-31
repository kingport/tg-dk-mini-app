import copy from 'copy-to-clipboard';
import html2canvas from 'html2canvas';
import moment from 'moment';
import { createStandaloneToast, useColorMode } from '@chakra-ui/react';
import i18next from '@/i18n';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';

import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import axios from 'axios';
// import { sha256 } from 'js-sha256';

// import fs from 'fs';

// export function getOrCreateKeypair(dir: string, keyName: string): Keypair {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//   const authorityKey = dir + '/' + keyName + '.json';
//   if (fs.existsSync(authorityKey)) {
//     const data: {
//       secretKey: string;
//       publicKey: string;
//     } = JSON.parse(fs.readFileSync(authorityKey, 'utf-8'));
//     return Keypair.fromSecretKey(bs58.decode(data.secretKey));
//   } else {
//     const keypair = Keypair.generate();
//     keypair.secretKey;
//     fs.writeFileSync(
//       authorityKey,
//       JSON.stringify({
//         secretKey: bs58.encode(keypair.secretKey),
//         publicKey: keypair.publicKey.toBase58(),
//       }),
//     );
//     return keypair;
//   }
// }

const { toast } = createStandaloneToast();
// const { colorMode } = useColorMode();

/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export const localGet = (key: string) => {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window.localStorage.getItem(key) as string);
  } catch (error) {
    return value;
  }
};

/**
 * @description 存储localStorage
 * @param {String} key Storage名称
 * @param {Any} value Storage值
 * @return void
 */
export const localSet = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

/**
 * @description 清除localStorage
 * @param {String} key Storage名称
 * @return void
 */
export const localRemove = (key: string) => {
  window.localStorage.removeItem(key);
};

/**
 * @description 清除所有localStorage
 * @return void
 */
export const localClear = () => {
  const lang = localStorage.getItem('lang') || 'en_US';
  clearAllCookies();
  window.localStorage.clear();
  localStorage.setItem('lang', lang);
};

/**
 * @description 复制内容到剪切板
 * @return void
 */
export const h5Copy = (content: string) => {
  copy(content);
  toast({
    status: 'success',
    containerStyle: { mb: '120px' },
    description: i18next.t('Copied'),
  });
};

/**
 * @description: 保存图片
 * @param {string} ref
 * @return {*}
 */
export function saveImage(canvasRef: any, callback?: any) {
  html2canvas(canvasRef.current, {
    scale: 2,
    backgroundColor: 'rgba(255,255,255,1)',
    useCORS: true,
  })
    .then(function (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      downloadImage(dataURL, 'invite.png');
      toast.closeAll();
      if (typeof callback === 'function') callback();
    })
    .catch(() => {
      if (typeof callback === 'function') callback();
    });
}

/**
 * @description: 图片下载
 * @param {string} url
 * @param {string} name
 * @return {*}
 */
export function downloadImage(url: string, name = 'download') {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name || 'download.png');
  link.click();
}

/**
 * @description: 截取小数点后几位
 * @param {string | number} num
 * @param {number} fixed
 *
 * @return {string}
 */
export function toFixed(num: string | number = '', fixed: number | string = 4): string {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
  const str = num.toString().match(re);
  if (!str) {
    return '';
  }
  return str[0];
}

/**
 * @description: 格式化数值
 * @param {string|number} num
 *
 * @return {string}
 */
export function numberFormat(num: string | number = 0, digits = 6) {
  const _num = parseFloat(toFixed(num, digits));
  // return _num.toLocaleString('en-US', {
  //   maximumFractionDigits: digits,
  // });
  if (num === null || num === undefined) {
    return '0';
  }
  const source = String(_num).split('.'); //按小数点分成2部分
  source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), '$1,'); //只将整数部分进行都好分割
  return source.join('.');
}

/**
 * 下载文件
 * @param content - 文件流
 * @param [filename] - 文件名称
 */
export const download = (content: any, fileName: string = `${moment().locale('zh-cn').format('YYYYMMDDHHmmss')}.xlsx`) => {
  const blob = new Blob([content], {
    type: 'application/octet-stream',
  });
  const a = document.createElement('a');
  const url = window.URL.createObjectURL(blob);
  const filename = fileName;
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 *
 * @param duration 时间转换
 * @returns 大于一天：xx days ago,大于一小时: xx hours ago, 大于一分钟: xx minutes ago
 * @example 1 day ago
 */
export function simpleDuration(duration: string) {
  const date = duration.replace(/-/g, '/');
  const time = new Date(date).getTime();
  const nowTime = new Date().getTime();
  const s = nowTime - time;
  let str = '';

  const day = 24 * 60 * 60 * 1000,
    hour = 60 * 60 * 1000,
    minute = 60 * 1000,
    second = 1000;
  if (s > day) {
    str = Math.floor(s / day) + ' days ago';
  } else if (s > hour) {
    str = Math.floor(s / hour) + ' hours ago';
  } else if (s > minute) {
    str = Math.floor(s / minute) + ' mins ago';
  } else {
    str = Math.floor(s / second) + ' seconds ago';
  }
  return str;
}

/**
 * @description 根据日期分组
 * @param data 需要分组的数组
 * @param dateFormat 日期格式
 * @param continueGroupBy 时间倒序
 */
export const groupByListByDate = (data: any[], dateFormat: string) => {
  var filterList: any = [];
  data.forEach((el, index) => {
    for (var i = 0; i < filterList.length; i++) {
      if (filterList[i].last_update_time === el.last_update_time) {
        filterList[i].listInfo.push(el);
        return;
      }
    }
    filterList.push({
      date: moment(el.last_update_time).format(dateFormat),
      list: [el],
    });
  });
  return filterList;
  // return _(data)
  //   .groupBy((item) => moment(item.time).format(dateFormat))
  //   .map((item, date) => {
  //     let list = item;
  //     if (continueGroupBy) {
  //       list = groupByListByDate(item, "MM.DD");
  //     }
  //     return {
  //       date,
  //       list,
  //     };
  //   })
  //   .reverse()
  //   .value();
};

/**
 * @description 格式化邮箱
 *  显示电子邮件地址前三个字符，然后省略中间部分用***代替，最后显示'@'后面的部分
 * @param email {string} 邮箱
 * @return {string} 格式化后的邮箱
 */
export function omitEmailMiddle(email: string) {
  // 使用正则表达式匹配@后面的内容，并用***替代中间部分
  if (!email) return '';
  const modifiedEmail = email.replace(/^(.{3})(.*)(@.*)$/, (match, firstThreeChars, middleChars, domain) => {
    // 将中间部分替换为最多三个*
    const asterisks = '*'.repeat(Math.min(3, middleChars.length));
    return `${firstThreeChars}${asterisks}${domain}`;
  });

  return modifiedEmail;
}

/**
 * @description 格式化音频时长显示
 * @param seconds
 * @returns {string}
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

// 清除浏览器cookie
export function clearAllCookies() {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  }
}

/**
 * 检查当前浏览器是否为移动设备上的浏览器
 *
 * 此函数主要用于区分普通的移动浏览器和一些常见的钱包WebView环境
 * 在Web3领域，开发者可能需要根据不同环境调整应用的行为
 *
 * @returns {boolean} 如果是移动浏览器且不是钱包WebView，则返回true，否则返回false
 */
export function isMobileBrowser() {
  const ua = navigator.userAgent || navigator.vendor || (window as any)?.opera;

  // 检查是否是移动设备
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase());

  // 检查是否是常见的钱包WebView
  const isWalletWebView = /metamask|tokenpocket|trust|trustwallet|mathwallet|coinbase|bitpie|huobiwallet|alphawallet|imtoken|okapp|brave/i.test(ua.toLowerCase()) || window?.ethereum?.isTrustWallet;

  // 返回是否是手机浏览器且不是钱包WebView
  return isMobile && !isWalletWebView;
}

export const getSPLBalance = async (connection: Connection, mintAddress: PublicKey, pubKey: PublicKey, allowOffCurve: boolean = false) => {
  try {
    let ata = getAssociatedTokenAddressSync(mintAddress, pubKey, allowOffCurve);
    const balance = await connection.getTokenAccountBalance(ata, 'processed');
    return balance.value.uiAmount;
  } catch (e) {}
  return null;
};

export const printSPLBalance = async (connection: Connection, mintAddress: PublicKey, user: PublicKey, info: string = '') => {
  const balance = await getSPLBalance(connection, mintAddress, user);
  if (balance === null) {
    console.log(`${info ? info + ' ' : ''}${user.toBase58()}:`, 'No Account Found');
  } else {
    console.log(`${info ? info + ' ' : ''}${user.toBase58()}:`, balance);
  }
};

export const formatPublicKey = (key: string | undefined) => {
  if (!key) return '';
  return `${key.slice(0, 5)}...${key.slice(-3)}`;
};

export const swapTokens = async (sdk, connection, CROESUDMint, pumpRecipientPublicKey, publicKey, buyAmountSol, signTransaction, sendTransaction, slippage = 3.5) => {
  // 获取链接钱包中的CROESU余额
  let currentSPLBalance = await getSPLBalance(connection, CROESUDMint, publicKey);
  console.log('currentSPLBalance', currentSPLBalance);

  try {
    // 获取当前兑换率
    const bondingCurveAccount = await sdk.getBondingCurveAccount(CROESUDMint);
    if (!bondingCurveAccount) {
      console.error('Bonding curve account not found');
      return;
    }

    // 计算兑换的代币数量
    const buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);

    // 确保 buyAmount 是 BigInt 类型
    const buyAmountBigInt = BigInt(buyAmount.toString());
    const slippageFactor = BigInt(118); // 18%滑点，使用整数表示 1.18
    const adjustedBuyAmount = (buyAmountBigInt * slippageFactor) / BigInt(100);
    // const slippageFactor = 1 + slippage; // 18%滑点
    // const adjustedBuyAmount = buyAmount * slippageFactor;

    console.log(`0.01 SOL can buy ${buyAmount.toString()} tokens`);

    const buyInstructions = await sdk.getBuyInstructions(
      publicKey,
      CROESUDMint,
      pumpRecipientPublicKey, // feeRecipient
      adjustedBuyAmount,
      adjustedBuyAmount, // Assuming no slippage for simplicity
    );
    const transaction = new Transaction().add(buyInstructions);
    transaction.feePayer = publicKey;

    // 获取最新的区块哈希 必须要有才能发起
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // 签名指令
    const signedTransaction = await signTransaction(transaction);
    // 发送交易
    const txId = await sendTransaction(signedTransaction, connection);
    console.log('Transaction sent with ID:', txId);
  } catch (error) {
    console.error('Error buying token:', error);
  }
};

export const getChainTokenList = async (address, chainId = 56) => {
  // chainId转16进制
  const chainId0x = `0x${chainId.toString(16)}`;
  const result = await axios.get(`https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chainId0x}`, {
    headers: {
      'x-api-key':
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImIzYWI5MzkyLTk2MTEtNDA5Yi1iNGIzLWJiMGFmYmE1N2JkNyIsIm9yZ0lkIjoiMTgzODcxIiwidXNlcklkIjoiMTgzNTQzIiwidHlwZUlkIjoiNTJiZjBmNGUtMjZjZS00NjczLWExOTYtMjA3MTM1ZDJkNmRlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODMxOTEyOTEsImV4cCI6NDgzODk1MTI5MX0.bLJgIvYDNUFESzPMwR3YDj1EVTnAC55-WkLjmnfrtN4',
    },
  });
  console.log(result);
  return result;
};

export async function getSolanaTokenSymbol(mint: PublicKey) {
  const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=3b22b07c-ac61-474e-9737-511021e59f8e`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: mint },
    }),
  });
  const data = await response.json();

  return data.result.content.metadata;
}
