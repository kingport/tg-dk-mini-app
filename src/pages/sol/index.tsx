import { Swap } from '@/components/Swap';
import { Alert, Button, Center, Flex, Input, InputGroup, InputLeftAddon, InputRightAddon, useToast } from '@chakra-ui/react';
import { getSPLBalance, printSPLBalance } from '@/utils/util';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { AnchorProvider } from '@coral-xyz/anchor';
import { PumpFunSDK } from 'pumpdotfun-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBalance } from '@/hooks/useBalance';
import { observer } from 'mobx-react';

const SolTokenDetail = (props) => {
  const { mintToken } = useParams();
  const { walletInfo } = userWalletStores().userwalletStore;
  // const { userwalletStore } = userWalletStores();
  const { userwalletStore } = userWalletStores();

  // 默认购买 2 ¥
  const [buyAmount, setBuyAmount] = useState(0.01);
  // 您的 SOL 钱包地址为
  const [solAccount, setSolAccount] = useState<any>(null);
  const toast = useToast();
  const { wallets, select, connect, publicKey, connected, disconnect } = useWallet();
  const [tradeLoading, setTradeLoading] = useState(false);
  const [mintTokenBalance, setMintTokenBalance] = useState<number | null>(0);

  const balance = useBalance(walletInfo[walletInfo?.walletType]?.publicKey);

  console.log(JSON.stringify(walletInfo), '=====> 钱包信息全局/token详情');

  const getProvider = () => {
    // if (!process.env.HELIUS_RPC_URL) {
    //   throw new Error('Please set HELIUS_RPC_URL in .env file');
    // }

    const connection = new Connection('https://solana-mainnet.core.chainstack.com/ce3153e89870fc8def7cf536c4333b6b'); // 连接到主网
    const wallet = new NodeWallet(new Keypair());
    return new AnchorProvider(connection, wallet, { commitment: 'finalized' });
  };

  // 私钥钱包购买
  const nowBuy = async () => {
    if (!mintToken) return;
    // 当前 sol 价格
    const solPrice = 150;
    // 换算成 sol 的数量
    // 换算成 sol 的数量，并四舍五入到最近的 lamport
    // const solAmountLamports = Math.round((buyAmount / solPrice) * LAMPORTS_PER_SOL);
    const solAmountLamports = buyAmount * LAMPORTS_PER_SOL;

    console.log('balance', balance);
    // 判断余额是否足够
    if (balance && balance < Number(buyAmount)) {
      console.log('余额不足');
      toast({
        title: `余额不足`,
        status: 'error',
        isClosable: true,
        duration: 500,
      });
      return;
    }

    try {
      setTradeLoading(true);
      const provider = getProvider();
      const sdk = new PumpFunSDK(provider);
      const buyMintToken = new PublicKey(mintToken);

      // 滑点
      const SLIPPAGE_BASIS_POINTS = BigInt(100);
      // 优先费
      const priorityFees = {
        unitLimit: 250000,
        unitPrice: 250000,
      };
      // 密钥
      const buyAccount = Keypair.fromSecretKey(bs58.decode(walletInfo[walletInfo?.walletType]?.secretKey));
      const buyResults = await sdk.buy(buyAccount, buyMintToken, BigInt(solAmountLamports), SLIPPAGE_BASIS_POINTS, priorityFees);

      if (buyResults.success) {
        setTradeLoading(false);
        console.log(buyResults, 'buyResults');
        toast({
          title: `购买成功`,
          status: 'success',
          isClosable: true,
          duration: 2000,
        });
        // 获取购买后的token数量
        getTokenMintBalance(mintToken);
      } else {
        setTradeLoading(false);

        console.log('Buy failed');
      }
    } catch (error) {
      console.log('error', error);
      setTradeLoading(false);
      toast({
        title: `购买失败`,
        status: 'error',
        isClosable: true,
        duration: 500,
      });
    }
  };

  // 插件钱包购买 （不知道私钥的）
  const nowBuyByPlugin = async () => {
    //
  };

  const getTokenMintBalance = async (mintToken) => {
    const balance = await getSPLBalance(
      new Connection('https://solana-mainnet.core.chainstack.com/ce3153e89870fc8def7cf536c4333b6b'),
      new PublicKey(mintToken),
      new PublicKey(walletInfo[walletInfo?.walletType]?.publicKey),
    );
    setMintTokenBalance(balance || 0);
  };

  useEffect(() => {
    if (mintToken && walletInfo[walletInfo?.walletType]?.publicKey) {
      getTokenMintBalance(mintToken);
    }
  }, [mintToken]);

  useEffect(() => {
    if (connected && publicKey) {
      userwalletStore.changeUserWalletStore({
        ...walletInfo,
        walletType: 'pluginWallet',
        pluginWallet: {
          // 公钥
          publicKey: publicKey.toBase58(),
        },
      });
    }
  }, [connected]);

  return (
    <Flex gap="4" flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
      <h1>
        {mintToken} 余额：{mintTokenBalance}
      </h1>
      <h1>当前选中钱包 ({walletInfo?.walletType}) 本地钱包直接交易 插件钱包签名交易</h1>
      {mintToken && (connected || walletInfo[walletInfo?.walletType]?.publicKey) && <Swap mintToken={mintToken} publicKey={walletInfo[walletInfo?.walletType]?.publicKey} />}
      {/* <Center>
        <InputGroup w="full">
          <InputLeftAddon>设置</InputLeftAddon>
          <Input maxW="100px" placeholder="设置买入数量，快速买入" defaultValue={buyAmount} onChange={(val) => setBuyAmount(Number(val?.target?.value))} />
          <InputRightAddon>SOL</InputRightAddon>
        </InputGroup>
      </Center>
      <Button isLoading={tradeLoading} loadingText={'交易中'} onClick={nowBuy}>
        购买{buyAmount} SOL
      </Button> */}
    </Flex>
  );
};

export default observer(SolTokenDetail);
