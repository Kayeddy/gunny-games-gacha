import { useWallet } from '@txnlab/use-wallet'
import { ellipseAddress } from '../utils/ellipseAddress'
import { RiLogoutCircleLine } from 'react-icons/ri'
import { BiWallet } from 'react-icons/bi'
import { useState } from 'react'

export default function ConnectWalletButton({ toggleWalletModalCallback }: { toggleWalletModalCallback: () => void }) {
  const [showMobileTooltip, setShowMobileTooltip] = useState(false)
  const { activeAddress, providers } = useWallet()

  const disconnectWallet = () => {
    if (providers) {
      const activeProvider = providers.find((p) => p.isActive)
      if (activeProvider) {
        activeProvider.disconnect()
      } else {
        localStorage.removeItem('txnlab-use-wallet')
        window.location.reload()
      }
    }
  }

  return (
    <div className="relative tooltip-container">
      {/* Connect Button */}
      <button
        data-test-id="connect-wallet"
        className="flex flex-row items-center justify-center gap-2 px-4 m-2 bg-opacity-50 w-fit connectWalletButton backdrop-blur-lg"
        onClick={!activeAddress ? toggleWalletModalCallback : () => setShowMobileTooltip((prev) => !prev)}
      >
        {activeAddress ? 'Connected' : 'Connect wallet'}
        <BiWallet className="text-lg" />
      </button>

      {/** Interactive Desktop tooltip */}
      {activeAddress && (
        <div className="flex-col items-center justify-center hidden w-56 gap-4 bg-black bg-opacity-50 lg:flex tooltip-content backdrop-blur-xl">
          {activeAddress && (
            <span className="flex flex-col items-center justify-center gap-2 text-white">
              <p className="text-lg font-bold"> Wallet connected: </p>
              <p className="text-sm">{ellipseAddress(activeAddress)}</p>
            </span>
          )}
          {activeAddress && (
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-2 p-2 mx-auto text-lg text-red-400 transition-all duration-300 ease-in-out bg-transparent bg-opacity-50 rounded-md backdrop-blur-lg group"
              onClick={disconnectWallet}
            >
              <p className="text-sm group-hover:animate-pulse">Disconnect</p>
              <RiLogoutCircleLine className="group-hover:animate-pulse" />
            </button>
          )}
        </div>
      )}

      {/** Interactive Mobile tooltip */}
      {activeAddress && showMobileTooltip && (
        <div className="flex flex-col items-center justify-center w-56 gap-4 bg-black bg-opacity-50 lg:hidden tooltip-content backdrop-blur-xl">
          {activeAddress && (
            <span className="flex flex-col items-center justify-center gap-2 text-white">
              <p className="text-lg font-bold"> Wallet connected: </p>
              <p className="text-sm">{ellipseAddress(activeAddress)}</p>
            </span>
          )}
          {activeAddress && (
            <button
              type="button"
              className="flex flex-row items-center justify-center gap-2 p-2 mx-auto text-lg text-red-400 transition-all duration-300 ease-in-out bg-transparent bg-opacity-50 rounded-md backdrop-blur-lg group"
              onClick={disconnectWallet}
            >
              <p className="text-sm group-hover:animate-pulse">Disconnect</p>
              <RiLogoutCircleLine className="group-hover:animate-pulse" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
