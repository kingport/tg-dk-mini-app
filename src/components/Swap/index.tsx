import { useBalance } from '@/hooks/useBalance';
import { formatPublicKey, getSPLBalance, numberFormat, swapTokens } from '@/utils/util';
import { Box, Button, Flex, HStack, Image, Input, Text, useNumberInput, useRadio, useRadioGroup, useToast } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import SvgIcon from '../SvgIcon';
import { ComputeBudgetProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { AnchorProvider } from '@coral-xyz/anchor';
import { PumpFunSDK } from 'pumpdotfun-sdk';
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes';

const BUYORSELLOPTIONS = {
  buy: [0.01, 0.02, 0.5, 1],
  sell: [25, 50, 75, 100],
};
export function Swap(props) {
  const { mintToken = '1izED8Yw_7UpZEH9wuSrAPK3dP7CCe2tUe5SD3LuVZtQbYNEP7heB', publicKey } = props;
  const { walletInfo } = userWalletStores().userwalletStore;
  const toast = useToast();

  const { sendTransaction, signTransaction } = useWallet();

  const connection = new Connection('https://solana-mainnet.core.chainstack.com/ce3153e89870fc8def7cf536c4333b6b'); // 连接到主网

  // pump的固定收费地址
  // const pumpRecipientPublicKey = new PublicKey('CebN5WGQ4jvEPvsVU4EoHEpgzq1VV7AbicfhtW4xC9iM');

  console.log(mintToken, 'mintToken');

  const getProvider = () => {
    const wallet = new NodeWallet(new Keypair());
    return new AnchorProvider(connection, wallet, { commitment: 'finalized' });
  };

  // sol 余额
  const balance = useBalance(publicKey);
  console.log(balance, 'balance===>余额');

  // 代币余额
  const currentMint = new PublicKey(mintToken || '1izED8Yw_7UpZEH9wuSrAPK3dP7CCe2tUe5SD3LuVZtQbYNEP7heB');

  // 获取链接钱包中的这个Token余额
  const currentSPLBalance = async (publicKey) => {
    const result = await getSPLBalance(connection, currentMint, publicKey);
    setTokenBalance(result);
  };

  // 是否正在交易
  const [tradeLoading, setTradeLoading] = useState(false);
  // 当前是否是买入or卖出
  const [optionType, setOptionType] = useState('buy');
  // 买入sol数量
  const [buySolAmount, setBuySolAmount] = useState('');
  // 卖出Token数量
  const [sellTokenAmount, setSellTokenAmount] = useState('');
  // 默认滑点
  const [slippage, setSlippage] = useState(5);
  // 默认优先费
  const [priorityFee, setPriorityFee] = useState(0.002);

  // 当前token余额
  const [tokenBalance, setTokenBalance] = useState<number | null>(0);

  const { getInputProps } = useNumberInput({
    step: 0.01,
    min: 0,
    // defaultValue: 1.53,
    // max: 6,
    // precision: 2,
  });
  const input = getInputProps();

  const setupEventListeners = async (sdk) => {
    const createEventId = sdk.addEventListener('createEvent', (event, slot, signature) => {
      console.log('创建事件', event, slot, signature);
    });
    console.log('订阅了带有ID的createEvent', createEventId);

    // const tradeEventId = sdk.addEventListener('tradeEvent', (event, slot, signature) => {
    //   console.log('tradeEvent', event, slot, signature);
    // });
    // console.log('Subscribed to tradeEvent with ID:', tradeEventId);

    const completeEventId = sdk.addEventListener('completeEvent', (event, slot, signature) => {
      console.log('completeEvent', event, slot, signature);
    });
    console.log('Subscribed to completeEvent with ID:', completeEventId);
  };

  /**
   *  私钥钱包买入
   * @param buyAmount 购买多少数量的sol 例如 0.001sol
   */
  const localWalletBuy = async () => {
    // 当前 sol 价格
    const solPrice = 150;
    // 换算成 sol 的数量
    // 换算成 sol 的数量，并四舍五入到最近的 lamport
    // const solAmountLamports = Math.round((buyAmount / solPrice) * LAMPORTS_PER_SOL);
    const solAmountLamports = Number(buySolAmount) * LAMPORTS_PER_SOL;
    // 判断余额是否足够
    if (balance && balance < Number(buySolAmount)) {
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
        currentSPLBalance(new PublicKey(publicKey));
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

  // 使用sol 买入 token
  const pluginWalletBuy = async () => {
    if (!publicKey || !signTransaction) {
      console.error('Wallet not connected');
      return;
    }
    const provider = getProvider();
    const sdk = new PumpFunSDK(provider);
    // 设置监听事件
    await setupEventListeners(sdk);
    // 你要购买的Token 铸币地址 只能是pump 发射的代币 因为接入的是pupm的sdk
    const buyMint = new PublicKey(mintToken);
    // 转换格式
    const buyAmountSol = BigInt(Number(buySolAmount) * LAMPORTS_PER_SOL); // 转换为 lamports

    try {
      // 获取当前兑换率
      const bondingCurveAccount = await sdk.getBondingCurveAccount(buyMint);
      if (!bondingCurveAccount) {
        console.error('Bonding curve account not found');
        return;
      }

      // 计算兑换的代币数量
      const buyAmount = bondingCurveAccount.getBuyPrice(buyAmountSol);
      console.log(`0.01 SOL can buy ${buyAmount.toString()} tokens`);
      // buyer.publicKey, mint, buyAmountSol
      // 10%滑点 = bigint(1000)
      const SLIPPAGE_BASIS_POINTS = BigInt(slippage * 100);
      const slippageBasisPoints = SLIPPAGE_BASIS_POINTS;
      const buyInstructions = await sdk.getBuyInstructionsBySolAmount(new PublicKey(publicKey), buyMint, buyAmountSol, slippageBasisPoints);

      // 创建交易指令
      const transaction = new Transaction();
      // 添加优先费指令 1 lamport = 0.000000001 SOL 0.005sol = 5000000 lamports 0.002sol = 2000000 lamports
      console.log(priorityFee * 100000000, '优先费===》');
      const priorityFees = {
        unitLimit: priorityFee * 1000000000,
        unitPrice: priorityFee * 1000000000,
      };
      if (priorityFees) {
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
          units: priorityFees.unitLimit,
        });
        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: priorityFees.unitPrice,
        });
        transaction.add(modifyComputeUnits);
        transaction.add(addPriorityFee);
      }

      transaction.add(buyInstructions);
      transaction.feePayer = new PublicKey(publicKey);

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

  const buyToken = async () => {
    if (walletInfo?.walletType === 'localWallet') {
      localWalletBuy();
    }
    if (walletInfo?.walletType === 'pluginWallet') {
      pluginWalletBuy();
    }
  };

  // 使用token 卖出 sol
  const sellToken = () => {
    //
  };

  console.log(tokenBalance, 'tokenBalance===>当前token余额');
  useEffect(() => {
    if (publicKey) {
      currentSPLBalance(new PublicKey(publicKey));
    }
  }, [publicKey]);
  console.log(publicKey, 'publicKey=====(999999');

  return (
    <Box bg="#17181B" borderRadius={'12px'} p="3" maxW="300px">
      <Box minH="120px" position="relative">
        <Box h="auto" overflow="hidden">
          <Flex flexDirection={'column'} gap="3" color="#9aa0aa" fontSize={'xs'}>
            <Flex alignItems={'center'} gap="3">
              <Flex borderRadius={'8px'} alignItems={'center'} color="white" flex="1 1 0%" justifyContent={'space-between'} bg="#26282C" px="1" h="9">
                <Flex alignItems={'center'} gap="1" fontSize="xs">
                  <Image src="https://cdn.pixilart.com/images/user/profile/medium/291.png" alt="gmgn" w="6" h="6" borderRadius="50%" />
                  <Text>{formatPublicKey(publicKey)}</Text>
                </Flex>
                <Flex alignItems={'center'} gap="1">
                  <SvgIcon name="sol" style={{ width: '12px', height: '12px' }} />
                  <Text fontSize="xs" fontWeight={500}>
                    {balance && numberFormat(balance, 5)}
                  </Text>
                </Flex>
              </Flex>
              <Flex alignItems={'center'} justifyContent={'center'} borderRadius={'8px'} border="1px solid" borderColor="rgb(38, 40, 44)" w="9" h="9" cursor="pointer">
                <SvgIcon name="add" style={{ width: '20px', height: '20px' }} />
              </Flex>
            </Flex>
            <Flex gap="4">
              <Flex flex="1 1 0%" p="0.5" bg="#111111" borderRadius={'8px'} fontSize={'xs'}>
                <Flex
                  borderRadius={'6px'}
                  bg={optionType === 'buy' ? '#88d693' : '#111111'}
                  color={optionType === 'buy' ? '#111111' : '#5c6068'}
                  w="50%"
                  gap="1"
                  alignItems={'center'}
                  h="8"
                  justify="center"
                  cursor="pointer"
                  onClick={() => setOptionType('buy')}
                >
                  <SvgIcon name="buy" style={{ width: '12px', height: '12px' }} />
                  买入
                </Flex>
                <Flex
                  borderRadius={'6px'}
                  bg={optionType !== 'buy' ? '#f04866' : '#111111'}
                  color={optionType !== 'buy' ? '#111111' : '#5c6068'}
                  w="50%"
                  gap="1"
                  alignItems={'center'}
                  h="8"
                  justifyContent={'center'}
                  cursor="pointer"
                  onClick={() => setOptionType('sell')}
                >
                  <SvgIcon name="sell" style={{ width: '12px', height: '12px' }} />
                  卖出
                </Flex>
              </Flex>
            </Flex>
            <Flex alignItems={'center'} justifyContent={'space-between'} fontSize={'xs'} color="white">
              {optionType === 'buy' ? (
                <>
                  <Text>立即买入</Text>
                  <Text>余额：{balance && numberFormat(balance, 5)} SOL</Text>
                </>
              ) : (
                <>
                  <Text>立即卖出</Text>
                  <Text>余额：{tokenBalance && numberFormat(tokenBalance, 5)}</Text>
                </>
              )}
            </Flex>
            <Flex flexDirection={'column'} borderRadius={'8px'} borderWidth={'1px'} borderStyle="solid" borderColor={'#26282c'} overflow="hidden">
              <Flex h="9" bg="#111111">
                <Flex px="4" whiteSpace="nowrap" alignItems={'center'}>
                  数量
                </Flex>
                <Input
                  {...input}
                  value={optionType === 'buy' ? buySolAmount : sellTokenAmount}
                  onChange={(value) => {
                    if (optionType === 'buy') setBuySolAmount(value.target.value);
                    if (optionType === 'sell') setSellTokenAmount(value.target.value);
                  }}
                  variant="unstyled"
                  textAlign={'right'}
                  border={'none'}
                  h="9"
                  paddingRight={0}
                  fontWeight={500}
                  color="white"
                  fontSize={'xs'}
                />
                <Flex px="4" whiteSpace="nowrap" alignItems={'center'}>
                  {optionType === 'buy' ? 'SOL' : ''}
                </Flex>
              </Flex>
              <Flex alignItems={'center'}>
                <Flex alignItems={'center'} flex="1 1 0%" justifyContent={'right'} borderTopWidth={'0.5px'} borderTopStyle="solid" border-color="#26282c">
                  {BUYORSELLOPTIONS[optionType].map((item) => (
                    <Flex
                      key={item}
                      gap="1"
                      cursor={'pointer'}
                      h="26px"
                      alignItems={'center'}
                      justifyContent={'center'}
                      fontSize={'xs'}
                      fontWeight={500}
                      whiteSpace={'nowrap'}
                      textOverflow={'ellipsis'}
                      borderBottom={0}
                      borderLeft={0}
                      w="full"
                      borderRight={'0.5px solid rgb(38,40,44)'}
                      _hover={{
                        bg: '#222427',
                      }}
                      onClick={() => {
                        if (optionType === 'buy') setBuySolAmount(`${item}`);
                        if (optionType === 'sell' && tokenBalance) setSellTokenAmount(`${(item / 100) * tokenBalance}`);
                      }}
                    >
                      {item}
                      {optionType === 'sell' && '%'}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </Flex>
            <Flex gap="2" alignItems={'center'}>
              {optionType === 'buy' ? (
                <Button isLoading={tradeLoading} onClick={buyToken} isDisabled={!Number(buySolAmount) || Number(buySolAmount) > Number(balance)} flex="1 1 0%" fontSize={'sm'}>
                  {Number(buySolAmount) > Number(balance) ? '余额不足' : buySolAmount && Number(buySolAmount) <= Number(balance) ? `买入 ${buySolAmount} SOL` : '买入'}
                </Button>
              ) : (
                <Button onClick={sellToken} isDisabled={!Number(sellTokenAmount)} flex="1 1 0%" fontSize={'sm'}>
                  卖出
                </Button>
              )}
            </Flex>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Flex>
                滑点：
                <Text cursor="pointer" as="u" color="white">
                  {slippage}%
                </Text>
              </Flex>
              <Flex>
                优先费：
                <Text as="u" cursor="pointer" color="white">
                  {priorityFee}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
