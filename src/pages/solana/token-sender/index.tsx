import { observer } from 'mobx-react';
import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, SystemProgram, SendTransactionError, LAMPORTS_PER_SOL, sendAndConfirmTransaction, ParsedAccountData } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import * as bs from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Select,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  Center,
  useToast,
  Input,
} from '@chakra-ui/react';
import { getSolanaTokenSymbol } from '@/utils/util';

const solanaTokenSender = () => {
  const connection = new Connection('https://solana-mainnet.core.chainstack.com/ce3153e89870fc8def7cf536c4333b6b'); // 连接到主网
  const { wallets, select, signMessage, publicKey, signAllTransactions, signTransaction, sendTransaction } = useWallet();

  const toast = useToast();

  // token 列表
  const [tokenList, setTokenList] = useState<any[]>([]);
  // 要发送的 token
  const [token, setToken] = useState<string>('SOL');
  // 收款地址 多个地址用逗号隔开
  const [address, setAddress] = useState('');
  // 精度
  const [decimals, setDecimals] = useState(9);

  // sol 余额
  const [balance, setBalance] = useState('0');

  // 定义每个接收者将接收的 lamports 数量 1 SOL等于1,000,000,000 lamports 10的9次方 精度为9
  const [lamportss, setLamportss] = useState(0);

  // 定义每个接收者将接收的 lamports 数量 1 SOL等于1,000,000,000 lamports 10的9次方 精度为9
  // const lamportss = [5, 5, 5, 5];

  // 转账sol 1对多
  const batchTransferSol = async (recivers: PublicKey[]) => {
    if (!publicKey || !signTransaction) return;
    if (recivers.length > 15) return toast({ status: 'error', description: '超出账户数量最大15个' });
    // 创建一个新的交易对象
    const transaction = new Transaction();

    // 遍历接收者数组，构建转账交易
    for (let i = 0; i < recivers.length; i++) {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recivers[i],
          lamports: lamportss * 10 ** 9 >= 890880 ? lamportss * 10 ** 9 : 890880,
        }),
      );
    }

    const JITO_MEV_ADDRESS = [
      new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
      new PublicKey('HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe'),
      new PublicKey('Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY'),
      new PublicKey('ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49'),
      new PublicKey('DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh'),
      new PublicKey('ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt'),
      new PublicKey('DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL'),
      new PublicKey('3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT'),
    ];
    const fee_Lamportst = 1000000;
    const randomIndex = Math.floor(Math.random() * JITO_MEV_ADDRESS.length); // 随机选中一个索引
    const selectedAddress = JITO_MEV_ADDRESS[randomIndex];
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: selectedAddress,
        lamports: fee_Lamportst,
      }),
    );

    // 获取最新的区块哈希 必须要有才能发起
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // 交易支付人
    transaction.feePayer = new PublicKey(publicKey);

    // 签名交易
    const signedTransaction = await signTransaction(transaction);

    // 发送并确认交易
    await sendTransaction(signedTransaction, connection)
      .then((tx) => {
        console.log(`txHash::  ${tx}`);
      })
      .catch((e) => {
        // console.log(`${bs.default.encode(transaction.serialize())}`);
        console.error(`${JSON.stringify(e)}`);
      });
  };

  // 转账sol-token 1对多
  const batchTransferSolToken = async (recivers: PublicKey[]) => {
    if (!publicKey || !signTransaction) return;
    if (recivers.length > 15) return toast({ status: 'error', description: '超出账户数量最大15个' });
    // tokenmint HZ32SiTtw3kYyaHTtTfpHVF8EyXFcy7MBQXeFpnNvQ9c （FROG）

    const mint = new PublicKey(tokenList.find((item) => item.symbol === token)?.address);

    const tokenAccount = await connection.getParsedAccountInfo(mint);
    const tokenProgramId = tokenAccount.value?.owner as PublicKey;
    const tokenData = JSON.parse(JSON.stringify((tokenAccount.value?.data as ParsedAccountData).parsed.info));
    const sendTokenAta = spl.getAssociatedTokenAddressSync(mint, publicKey, false, tokenProgramId);
    const transaction = new Transaction();

    for (let i = 0; i < recivers.length; i++) {
      const tokenAta = spl.getAssociatedTokenAddressSync(mint, recivers[i], false, tokenProgramId);
      await spl
        .getAccount(connection, tokenAta)
        .then()
        .catch((e) => {
          transaction.add(spl.createAssociatedTokenAccountInstruction(publicKey, tokenAta, recivers[i], mint, tokenProgramId, spl.ASSOCIATED_TOKEN_PROGRAM_ID));
        });

      transaction.add(spl.createTransferCheckedInstruction(sendTokenAta, mint, tokenAta, publicKey, lamportss * 10 ** tokenData.decimals, tokenData.decimals));
    }

    // JITO 机器人手续费
    // const JITO_MEV_ADDRESS = [
    //   new PublicKey('96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5'),
    //   new PublicKey('HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe'),
    //   new PublicKey('Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY'),
    //   new PublicKey('ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49'),
    //   new PublicKey('DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh'),
    //   new PublicKey('ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt'),
    //   new PublicKey('DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL'),
    //   new PublicKey('3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT'),
    // ];
    // const fee_Lamportst = 1000000;
    // const randomIndex = Math.floor(Math.random() * JITO_MEV_ADDRESS.length); // 随机选中一个索引
    // const selectedAddress = JITO_MEV_ADDRESS[randomIndex];
    // transaction.add(
    //   SystemProgram.transfer({
    //     fromPubkey: publicKey,
    //     toPubkey: selectedAddress,
    //     lamports: fee_Lamportst,
    //   }),
    // );

    // 获取最新的区块哈希 必须要有才能发起
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;

    // 交易支付人
    transaction.feePayer = new PublicKey(publicKey);

    // 签名交易
    const signedTransaction = await signTransaction(transaction);
    await sendTransaction(signedTransaction, connection)
      .then((tx) => {
        console.log(`txHash::  ${tx}`);
      })
      .catch((e) => {
        console.error(`${JSON.stringify(e)}`);
      });
  };

  // const getBalance = async () => {
  //   if (!publicKey) return 0;
  //   const sol_balance = await connection.getBalance(publicKey);
  //   setBalance(sol_balance);
  // };

  async function getAllTokenAccounts() {
    try {
      if (!publicKey) return;
      // 获取钱包地址下所有代币账户
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program ID
      });

      // 输出代币信息
      await tokenAccounts.value.forEach(async (tokenAccountInfo) => {
        const tokenAccount = tokenAccountInfo.account.data.parsed.info;
        if (tokenAccount.tokenAmount.uiAmount > 0) {
          const metadata = await getSolanaTokenSymbol(new PublicKey(tokenAccount.mint));
          console.log('Token metadata: ', metadata);
          console.log('Token tokenAccount: ', tokenAccount);

          const list = [
            ...tokenList,
            {
              symbol: metadata.symbol,
              address: tokenAccount.mint,
              balance: tokenAccount.tokenAmount.uiAmount,
              decimals: tokenAccount.tokenAmount.decimals,
            },
          ];

          const uniqueArray = [...new Set(list.map((item) => item.address))].map((address) => list.find((item) => item.address === address));

          setTokenList([...uniqueArray]);
        }
      });
    } catch (error) {
      console.error('Error fetching token accounts:', error);
    }
  }

  const balanceAmount = async () => {
    if (!publicKey) return 0;
    if (token === 'SOL') {
      const sol_balance = await connection.getBalance(publicKey);
      const formattedBalance = (sol_balance / Math.pow(10, decimals)).toFixed(9); // 格式化余额

      setDecimals(9);
      setBalance(formattedBalance);
    } else {
      const tokenInfo = tokenList.find((item) => item.symbol === token);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenInfo.address),
      });
      if (tokenAccounts.value.length > 0) {
        const tokenAccount = tokenAccounts.value[0].account.data.parsed.info;

        setBalance(tokenAccount?.tokenAmount?.uiAmount);
        setDecimals(tokenInfo?.decimals);
      }
    }
  };

  useEffect(() => {
    balanceAmount();
  }, [token, publicKey, tokenList.length]);

  useEffect(() => {
    if (publicKey) {
      getAllTokenAccounts();
    }
  }, [publicKey]);

  const oneToMoreTransfer = () => {
    // 定义接收者的公钥数组
    const recivers: PublicKey[] = [];

    address.split(',').forEach((mint) => {
      recivers.push(new PublicKey(mint.trim()));
    });

    if (token === 'SOL') {
      batchTransferSol(recivers);
    } else {
      batchTransferSolToken(recivers);
    }
  };

  return (
    // <Flex gap="3">
    //   <Button onClick={batchTransferSol}>SOL转帐</Button>
    //   <Button onClick={batchTransferSolToken}>SOL-token转帐</Button>
    // </Flex>
    <Box>
      <Heading as="h1" mt="5" fontSize="2xl" textAlign="center">
        Solana 批量发送
      </Heading>

      <Card maxW="6xl" colorScheme="blackAlpha" mx="auto" mt="5">
        <CardBody fontSize={'sm'}>
          <Flex gap="5">
            <FormControl w="200px">
              <FormLabel fontSize={'sm'}>切换主链</FormLabel>
              {/* <Select fontSize={'sm'} defaultValue={56}>
                <option value={1}>Ethereum</option>
                <option value={56}>BNB Chain</option>
              </Select> */}
              <Text border="1px solid rgba(255,255,255,0.2)" fontSize="sm" lineHeight="10" rounded="md" px="3">
                Solana
              </Text>
            </FormControl>
            <FormControl fontSize={'sm'}>
              <Flex fontSize={'sm'} alignItems={'center'} justifyContent={'space-between'}>
                <FormLabel>代币合约地址</FormLabel>
                <Text>
                  {balance} {token.toUpperCase()}
                </Text>
              </Flex>
              <Select fontSize={'sm'} value={token} onChange={(e) => setToken(e.target.value)}>
                <option value={'SOL'}>Sol - So1111111111111111111111111111111111111111</option>
                {tokenList?.map((item: any) => (
                  <option key={item?.symbol} value={item?.symbol}>
                    {item?.symbol} - {item?.address}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl width="80px" fontSize={'sm'}>
              <Flex fontSize={'sm'} alignItems={'center'} justifyContent={'space-between'}>
                <FormLabel>Decimals</FormLabel>
              </Flex>
              <Center h="10" border="1px solid rgba(255,255,255,0.2)" borderRadius="md" color="white">
                {decimals}
              </Center>
            </FormControl>
          </Flex>
          <FormControl mt="4">
            <FormLabel fontSize={'sm'}>收款地址列表（英文逗号隔开）</FormLabel>
            <Textarea placeholder="" value={address} onChange={(e) => setAddress(e.target.value)} />
          </FormControl>
          <FormControl mt="4" fontWeight={600}>
            <Flex gap="1" alignItems={'center'}>
              <Text>每个地址发送：</Text>
              <Input
                w="200px"
                type="number"
                size={'sm'}
                value={lamportss}
                onChange={(e) => {
                  if (parseFloat(e.target.value)) {
                    setLamportss(parseFloat(e.target.value));
                  } else {
                    setLamportss(0);
                  }
                }}
              ></Input>
              <Text>{token.toUpperCase()}</Text>
            </Flex>
          </FormControl>
          <Button w="full" mt="5" onClick={oneToMoreTransfer}>
            开始批量转账
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default observer(solanaTokenSender);
