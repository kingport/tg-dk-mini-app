/**文档说明
 * @Description: 接口传入参数类型声明文档
 * @author liuJie
 * @Email 1547698569@qq.com
 * @date 2022/1/13 11:35
 */

export interface getLoginParams {
  email: string;
  login_password: string;
}

export interface getUserAddressParams {
  currency?: string;
  currencyNetWork?: string;
}

export interface getStakingUpgradeInfoParams {
  orderType: number;
  stakingId: number;
}

export interface withdrawApplyParams {
  amount: string;
  code: string;
  currency: string;
  currency_network: string;
  google_code?: string;
  memo?: string;
  pay_password: string;
  to_address: string;
}

export interface getWithdrawRecordsParams {
  current: number;
  size: number;
  beginTime?: string;
  currency?: string;
  endTime?: string;
  orderId?: string;
}

export interface putOrderParams {
  amount: number;
  pay_password: string;
  pay_type: number;
  sf_amount: number;
  staking_id: number;
}

export interface accountBillsParams {
  current?: number;
  size: number;
  amountDirection?: string;
  beginTime?: string;
  businessId?: string;
  currency?: string;
  endTime?: string;
  id?: string;
  nftName?: string;
}

export interface accountInfoParams {
  current: number;
  size: number;
  currency?: string;
}

export interface getTicketsParams {
  current: number;
  size?: number;
  status?: string;
}

export interface batchClaimTicketsParams {
  claim_qty: number;
  id: number;
  pay_password: number;
  status?: number;
}

export interface depositRecordsParams {
  current: number;
  size: number;
  currency?: string;
  orderId?: string;
  beginTime?: string;
  endTime?: string;
}

export interface orderInfoParams {
  orderId: string;
  subId: string;
}
export interface currencyInfoParams {
  current: number;
  size: number;
  currency?: string;
  currencyNetWork?: string;
}
export interface userRelationToBindParams {
  invitation_code?: string;
}

export interface findUserStatisticsListParams {
  current: number;
  size?: number;
}
export interface getSubAccountParams {
  current?: number;
  size?: number;
}
