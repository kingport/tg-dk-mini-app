import { Connection, PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

const connection = new Connection('https://solana-mainnet.core.chainstack.com/ce3153e89870fc8def7cf536c4333b6b'); // 连接到主网

async function getBalance(publicKey: PublicKey): Promise<number> {
  const balance = await connection.getBalance(publicKey); // 获取余额
  return balance / 1e9; // 将余额转换为 SOL（1 SOL = 10^9 lamports）
}

export function useBalance(publicKey: PublicKey | null): number | null {
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        // 如果publicKey 不是new PublicKey 类型 则 new PublicKey(publicKey)
        if (!(publicKey instanceof PublicKey)) {
          publicKey = new PublicKey(publicKey);
        }
        const balance = await getBalance(publicKey);
        setBalance(balance);
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
  }, [publicKey]);

  return balance;
}
