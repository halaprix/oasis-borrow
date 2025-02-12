import { TxStatusCardProgressProps } from 'components/vault/TxStatusCard'
import { useTranslation } from 'next-i18next'

import { SidebarTxData } from '../../helpers/extractSidebarHelpers'

export function getSidebarProgress({
  stage,
  proxyTxHash,
  allowanceTxHash,
  openTxHash,
  manageTxHash,
  etherscan,
  proxyConfirmations,
  safeConfirmations,
  token,
}: SidebarTxData): TxStatusCardProgressProps | undefined {
  const { t } = useTranslation()

  switch (stage) {
    case 'proxyInProgress':
      return {
        text: t('proxy-deployment-confirming', {
          proxyConfirmations: proxyConfirmations || 0,
          safeConfirmations,
        }),
        txHash: proxyTxHash!,
        etherscan: etherscan!,
      }
    case 'collateralAllowanceInProgress':
    case 'daiAllowanceInProgress':
    case 'allowanceInProgress':
      return {
        text: t('setting-allowance-for', { token }),
        txHash: allowanceTxHash!,
        etherscan: etherscan!,
      }
    case 'txInProgress':
      return {
        text: t('creating-your-vault'),
        txHash: openTxHash!,
        etherscan: etherscan!,
      }
    case 'manageInProgress':
      return {
        text: t('changing-vault'),
        txHash: manageTxHash!,
        etherscan: etherscan!,
      }
    default:
      return undefined
  }
}
