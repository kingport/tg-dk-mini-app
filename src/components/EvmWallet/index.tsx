import { config } from '@/config/config';
import { formatPublicKey } from '@/utils/util';
import { Button, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react';

import { useAccount, useConnect, useSwitchChain } from 'wagmi';

const EvmWallet = () => {
  const account = useAccount();
  const { connectors, connect } = useConnect()

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search); // 解析查询参数
  // const chainIdFromQuery = queryParams.get('chainId'); // 获取 chainId 参数

  const { globalStore } = globalStores();
  const { switchChain } = useSwitchChain({
    config: config,
  });
  // 获取当前 URL
  // const currentUrl = window.location.href;

  // 使用 URLSearchParams 获取查询参数
  // const params = new URLSearchParams(currentUrl.split('?')[1]);
  // const chainId: any = params.get('chainId');
  // console.log('chainId----->EVM', chainId);
  console.log('chainId----->EVMglobalStore', JSON.stringify(globalStore.currentChain?.chain_id));

  useEffect(() => {
    // @ts-ignore
    switchChain({ chainId: Number(globalStore.currentChain?.chain_id) });
  }, [globalStore.currentChain]);
  return (
    <Flex>
      {/* <Flex>{account?.isConnected ? account?.chain?.name + ' ' + formatPublicKey(account?.address) : <Button onClick={connect}>Evm钱包连接</Button> }</Flex> */}      
      {
        account?.isConnected ? account?.chain?.name + ' ' + formatPublicKey(account?.address) :
        connectors.map((connector) => (
          <Button key={connector.uid} onClick={() => connect({ connector })}>
            {connector.name}
          </Button>
        ))
      }
    </Flex>
  );
};

export default observer(EvmWallet);
