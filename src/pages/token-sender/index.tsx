import {
  Box,
  Button,
  Card,
  CardBody,
  Text,
  Flex,
  Heading,
  useSteps,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepSeparator,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Input,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react';
import { Select } from 'antd';

import Web3 from 'web3';
import batchTransferABI from './abi/batchTransfer.json';

import BN, { isBN } from 'bn.js';
import { erc20Abi } from 'viem';
import { getChainTokenList } from '@/utils/util';
import ChainLinks from '../more-to-one/components/ChainLinks';
import { useAccount, useBalance, useToken } from 'wagmi';
import { config } from '@/config/config';
import { useRequest } from 'ahooks';
import { getChains, getTokenInfo } from '@/http/api/api';

const MoreToOne = () => {
  const account = useAccount();
  const balance = useBalance({
    address: account?.address,
  });

  
  const [web3, setWeb3] = useState<Web3 | null>(null);

  const [tokenList, setTokenList] = useState<any>([]);
  const [addressList, setAddressList] = useState('');
  const [amount, setAmount] = useState('0');
  const [sendContractAddress, setSendContractAddress] = useState('0x0000000000000000000000000000000000000000');
  const [node, setNode] = useState<string>('');
  const [chains, setChains] = useState<any>();
  

  // 原生代币余额
  // const [balanceInEther, setBalanceInEther] = useState('0');

  // 查询钱包原生代币余额
  // const getBalance = async (address) => {
  //   if (!web3) return;
  //   const result = await web3.eth.getBalance(address);
  //   // 转换为以太坊的标准单位
  //   setBalanceInEther(web3.utils.fromWei(result, 'ether'));
  // };

  // const getChainTokens = async (chainId = 56) => {
  //   const { data }: any = await getChainTokenList(account?.address, chainId);
  //   setTokenList(data);
  // };

  // const result = useToken({
  //   address: sendTokenAddress,
  //   config
  // })

  // console.log(result, 'result=========>>>');

  // 链接RPC 节点
  const { run } = useRequest(() => getChains({ chainId: String((account?.chain?.id)) }), {    
    manual: true,
    onSuccess(res) {
      if (res) {
        setNode(res[0]?.rpc[0]);
      }
    },
    refreshDeps: [account?.chain?.id],
  });

  // 根据合约地址获取token信息 EVM
  const {run: searchTokenInfo} = useRequest((contract_address) => getTokenInfo({
    chainId: String(account?.chain?.id),
    networkId: String(account?.chain?.id),
    contractAddress: contract_address,
    owner: account?.address,
  }), {
    manual: true,
    onSuccess(res, params:any) {
      if (res) {
        setTokenList((tokenList) => [
                {
                  label: res.symbol + '-' + res.balance_of + '-' + params?.[0],
                  value: params?.[0],
                  token_address:  params?.[0],
                  symbol: res.symbol,
                  balance_of: res.balance_of,
                },
                ...tokenList,
              ]);
      }
    },
    refreshDeps: [sendContractAddress],
  });


  // 链接RPC节点
  useEffect(() => {
    if (node) {
      setWeb3(new Web3(node));
    }
  }, [node]);

  useEffect(() => {
    if(account?.chain?.id) {
      run();
      setSendContractAddress('0x0000000000000000000000000000000000000000');
      setTokenList([
        {
          balance_of: balance?.data?.formatted,
          label: account?.chain?.nativeCurrency?.name + '-' + account?.chain?.nativeCurrency?.symbol,
          value: '0x0000000000000000000000000000000000000000',
          token_address: '0x0000000000000000000000000000000000000000',
          symbol: account?.chain?.nativeCurrency?.symbol
        },
      ]);
    }
  }, [account?.chain?.id]);


  // 输入token地址搜索
  const handleSearch = async (val) => {
    if (!web3) return;
    if (!val) return;
    searchTokenInfo(val)
    //  searchTokenInfo(val);
    // setSendTokenAddress(val);
    // const contract = new web3.eth.Contract(erc20Abi, val);
    // const symbol = await contract.methods.symbol().call();
    // const decimals: any = await contract.methods.decimals().call();
    // // 获取token余额 name
    // contract.methods
    //   .balanceOf(account?.address)
    //   .call()
    //   .then((res: any) => {
    //     console.log(decimals, 'decimals');
    //     console.log(res, 'res');
    //     console.log('Token balance:');
    //     console.log('Token symbol:', parseFloat(res) / Math.pow(10, parseInt(decimals)));

    //     let balance = parseFloat(res) / Math.pow(10, parseInt(decimals));
    //     // push 进去 tokenlist
    //     setTokenList((tokenList) => [
    //       {
    //         label: symbol + '-' + balance + '-' + val,
    //         value: symbol,
    //         token_address: val,
    //       },
    //       ...tokenList,
    //     ]);
    //   });
  };

  // 批量转账 如果是Token
  const bulkTransfer = async () => {
    if (!web3 || !account?.chain?.id || !amount ) return;
    if([56, 137, 534352].indexOf(Number(account?.chain?.id)) === -1) return alert('暂不支持该链批量转账');

    // 发出地址
    const formAddress = account?.address;
    // 接收地址 2个以上
    const toAddress = addressList.split(',');

    if(toAddress.length < 2) return alert('请至少输入两个接收地址');

    // 每个地址对应金额 0.01u
    const amounts = [web3.utils.toWei(amount, 'ether'), web3.utils.toWei(amount, 'ether')]; // 以 Wei 为单位的转账金额

    // 转账什么出去 0x55d398326f99059fF775485246999027B3197955(USDT) 如果是传原生代币 例如BNB 则传 0x0000000000000000000000000000000000000000
    const sendToken = sendContractAddress; // BNB 传0x0000000000000000000000000000000000000000

    const contractAddress = {
      56: '0xcd9F5FA0FF8093f74a54D94c76db15B2B36C2e19', // 合约地址 bsc
      534352: '0x2a74a820ddc8341abce2dc52709c5c3c63b1f7a4', // 合约地址 scroll
      137: '0x4939E4381970a169860eb3f961123c2cE3E816Ec', // 合约地址 polygon
    }
    
    // 获取转账需要的总额
    const totalAmount = amounts.reduce((a, b) => new BN(a).add(new BN(b)), new BN('0'));

    // 转账金额是否足够
    if(new BN(tokenList[0]?.balance_of).lt(totalAmount)) return alert('余额不足');


    const contract = new web3.eth.Contract(batchTransferABI, contractAddress[account?.chain?.id]);
    try {
      // 先检查代币授权
      const tokenContract = new web3.eth.Contract(erc20Abi, sendToken);
      console.log('Token contract:', tokenContract);
      const allowance = await tokenContract.methods.allowance(formAddress, sendToken).call();

      //  授权了 但是额度不够
      if (allowance) {
        console.log('AllowancetoNumber:', new BN(allowance).toNumber());
        if (new BN(allowance).lt(totalAmount)) {
          const approveGas = await tokenContract.methods.approve(contractAddress[account?.chain?.id], web3.utils.toWei('1000', 'ether')).estimateGas({ from: formAddress });
          await tokenContract.methods.approve(contractAddress[account?.chain?.id], web3.utils.toWei('1000', 'ether')).send({ from: formAddress, gas: `${approveGas}` });
          console.log('Token approved for transfer');
        }
      } else {
        // 没有授权 直接调用授权 这里是测试 授权了1000U的额度 根据实际情况调整        
        const approveGas = await tokenContract.methods.approve(contractAddress[account?.chain?.id], web3.utils.toWei('1000', 'ether')).estimateGas({ from: formAddress });
        await tokenContract.methods.approve(contractAddress[account?.chain?.id], web3.utils.toWei('1000', 'ether')).send({ from: formAddress, gas: `${approveGas}` });
        console.log('Token approved for transfer');
      }

      const gas = await contract.methods.batchTransfer(sendToken, toAddress, amounts).estimateGas({ from: formAddress });

      const result = await contract.methods.batchTransfer(sendToken, toAddress, amounts).send({ from: formAddress, gas: `${gas}` });
      console.log('Transaction successful:', result);
    } catch (error) {
      alert(JSON.stringify(error));
      console.error('Transaction failed:', error);
    }
  };


  return (
    <Box>
      <Heading as="h1" mt="5" fontSize="2xl" textAlign="center">
        批量转账
      </Heading>
      <Card bg="none" maxW="5xl" colorScheme="blackAlpha" mx="auto" mt="5"></Card>
      <Card maxW="6xl" colorScheme="blackAlpha" mx="auto" mt="5">
        <CardBody fontSize={'sm'}>
          <Flex gap="5">
            <FormControl w="200px">
              <FormLabel fontSize={'sm'}>切换主链</FormLabel>
              <ChainLinks chains={chains} setChains={setChains} />
            </FormControl>
            <FormControl fontSize={'sm'}>
              <Flex fontSize={'sm'} alignItems={'center'} justifyContent={'space-between'} pb="1">
                <FormLabel>代币合约地址</FormLabel>
                <Text>
                  {balance?.data?.formatted} {balance?.data?.symbol}
                </Text>
              </Flex>
              <Select
                size="large"
                style={{ width: '100%' }}
                showSearch
                value={sendContractAddress}
                placeholder={'如需发送代币，请在输入框中输入代币地址'}
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearch}
                onChange={(val) => {
                  setSendContractAddress(val);
                }}
                onSelect={(val) => {
                  setSendContractAddress(val);
                  // 在 tokenlist 中找出这个 然后置顶
                  const token = tokenList.find((item) => item.token_address === val);
                  setTokenList((tokenList) => [token, ...tokenList]);
                }}
                notFoundContent={null}
                options={tokenList || []}
              />            
            </FormControl>
          </Flex>
          <FormControl mt="4">
            <FormLabel fontSize={'sm'}>收款地址列表（英文逗号隔开）</FormLabel>
            <Textarea onChange={(e) => setAddressList(e.target.value)} value={addressList} placeholder="" />
          </FormControl>
          <FormControl mt="4" fontWeight={600}>
            <Flex gap="1" alignItems={'center'}>
              <Text>每个地址发送：</Text>
              <NumberInput size={'sm'} min={0}>
                <NumberInputField value={amount} onChange={(e) => setAmount(e.target.value)} />
              </NumberInput>
              <Text>{tokenList?.[0]?.symbol}</Text>
            </Flex>
          </FormControl>
          <Button isDisabled={Number(amount) <= 0} w="full" mt="5" onClick={bulkTransfer}>
            开始批量转账
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default MoreToOne;
