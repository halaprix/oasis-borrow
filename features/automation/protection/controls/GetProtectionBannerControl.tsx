import { getNetworkName } from '@oasisdex/web3-context'
import { BigNumber } from 'bignumber.js'
import { isSupportedAutomationIlk } from 'blockchain/tokensMetadata'
import { SetupBanner, setupBannerGradientPresets } from 'components/vault/SetupBanner'
import { useFeatureToggle } from 'helpers/useFeatureToggle'
import { useTranslation } from 'next-i18next'
import React, { useCallback } from 'react'

import { useAppContext } from '../../../../components/AppContextProvider'
import { VaultViewMode } from '../../../../components/VaultTabSwitch'
import { useObservable } from '../../../../helpers/observableHook'
import { useSessionStorage } from '../../../../helpers/useSessionStorage'
import { extractStopLossData } from '../common/StopLossTriggerDataExtractor'
import { TAB_CHANGE_SUBJECT } from '../common/UITypes/TabChange'
import { GetProtectionBannerLayout } from './GetProtectionBannerLayout'

interface GetProtectionBannerProps {
  vaultId: BigNumber
  ilk: string
  debt: BigNumber
  token?: string
}

export function GetProtectionBannerControl({
  vaultId,
  token,
  ilk,
  debt,
}: GetProtectionBannerProps) {
  const { t } = useTranslation()
  const { uiChanges, automationTriggersData$ } = useAppContext()
  const [isBannerClosed, setIsBannerClosed] = useSessionStorage('overviewProtectionBanner', false)
  const autoTriggersData$ = automationTriggersData$(vaultId)
  const [automationTriggersData] = useObservable(autoTriggersData$)

  const newComponentsEnabled = useFeatureToggle('NewComponents')
  const isAllowedForAutomation = isSupportedAutomationIlk(getNetworkName(), ilk)

  const slData = automationTriggersData ? extractStopLossData(automationTriggersData) : null

  const handleClose = useCallback(() => setIsBannerClosed(true), [])

  return !slData?.isStopLossEnabled &&
    !isBannerClosed &&
    isAllowedForAutomation &&
    !debt.isZero() ? (
    <>
      {!newComponentsEnabled ? (
        <GetProtectionBannerLayout
          handleClick={() => {
            uiChanges.publish(TAB_CHANGE_SUBJECT, {
              type: 'change-tab',
              currentMode: VaultViewMode.Protection,
            })
          }}
          handleClose={handleClose}
        />
      ) : (
        <SetupBanner
          header={t('vault-banners.setup-stop-loss.header')}
          content={t('vault-banners.setup-stop-loss.content', { token })}
          button={t('vault-banners.setup-stop-loss.button')}
          backgroundImage="/static/img/setup-banner/stop-loss.svg"
          backgroundColor={setupBannerGradientPresets.stopLoss[0]}
          backgroundColorEnd={setupBannerGradientPresets.stopLoss[1]}
          handleClick={() => {
            uiChanges.publish(TAB_CHANGE_SUBJECT, {
              type: 'change-tab',
              currentMode: VaultViewMode.Protection,
            })
          }}
        />
      )}
    </>
  ) : null
}
