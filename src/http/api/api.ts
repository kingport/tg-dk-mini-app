import { request } from '@/http/axios';
// import { getCanvasData } from './api-params-moudle'

/** 这里枚举定义所有接口 */
enum APIS {
  GET_CHAINS = '/chains',
  POST_GAS_INFO = '/chains/gas/info',
  POST_TRANSFER = '/transfer/transferIn',
}

interface ChainsParams {
  chainId: string;
  networkId?: string;
}

interface TransferParams {
  pri: string;
  coin: string;
  chainId: string;
  nodePointUrl: string;
  isToken: boolean;
  toAddr: string;
  token?: string;
  amount: string;
  gasPrice: string;
  gasLimit: string;
  isStringModel?: boolean;
  inputData?: string;
  recentBlockHash?: string;
}

export const getChains = (params: ChainsParams) => request.get<any>(APIS.GET_CHAINS, params);

export const postGasInfo = (params: { chain_id: string }) => request.post<any>(APIS.POST_GAS_INFO, params);

export const transfer = (params: TransferParams) => request.post<any>(APIS.POST_TRANSFER, params);

export const getTokenInfo = (params: { chainId: string; networkId: string; contractAddress: string,owner?:string }) => request.get<any>('/tokens/info', params);
