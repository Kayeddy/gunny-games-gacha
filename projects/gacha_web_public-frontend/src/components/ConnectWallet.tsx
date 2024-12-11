import { Provider, useWallet } from '@txnlab/use-wallet'
import Account from './Account'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAddress } = useWallet()

  const isKmd = (provider: Provider) => provider.metadata.name.toLowerCase() === 'kmd'

  const disconnectWallet = () => {
    if (providers) {
      const activeProvider = providers.find((p) => p.isActive)
      if (activeProvider) {
        activeProvider.disconnect()
      } else {
        // Required for logout/cleanup of inactive providers
        // For instance, when you login to localnet wallet and switch network
        // to testnet/mainnet or vice verse.
        localStorage.removeItem('txnlab-use-wallet')
        window.location.reload()
      }
    }
  }

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open text-white' : ''}`}>
      <form
        method="dialog"
        className="modal-box bg-black/50 backdrop-blur-xl"
        style={{ border: openModal ? '3px ridge #149cea' : undefined }}
      >
        <h3 className="text-2xl font-bold text-white">Connection details</h3>

        <div className="grid pt-5 m-2">
          {activeAddress && (
            <>
              <Account />
              <div className="divider" />
            </>
          )}

          <div className="flex flex-col w-full gap-4">
            {!activeAddress &&
              providers?.map((provider) => (
                <button
                  data-test-id={`${provider.metadata.id}-connect`}
                  className="group h-fit w-full group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800  border text-left p-3 text-gray-50 text-base font-bold rounded-lg  overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg"
                  key={`provider-${provider.metadata.id}`}
                  onClick={() => {
                    return provider.connect()
                  }}
                >
                  {!isKmd(provider) && (
                    <img
                      alt={`wallet_icon_${provider.metadata.id}`}
                      src={provider.metadata.icon}
                      style={{ objectFit: 'contain', width: '30px', height: 'auto' }}
                    />
                  )}
                  <span>{isKmd(provider) ? 'LocalNet Wallet' : provider.metadata.name}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="modal-action">
          <div className="h-[50px]">
            <button
              data-test-id="close-wallet-modal"
              onClick={() => {
                closeModal()
              }}
              className={`relative px-4 py-2 overflow-hidden font-medium duration-300 border border-b-4 rounded-md outline-none hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 group
                ${
                  activeAddress
                    ? 'text-green-400 bg-green-900 border-green-400 hover:border-green-400'
                    : 'text-red-400 bg-red-900 border-red-400 hover:border-red-400'
                }
              `}
            >
              <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              Close
            </button>
          </div>
          {activeAddress && (
            <div className="h-[50px]">
              <button
                data-test-id="logout"
                onClick={disconnectWallet}
                className={`relative px-4 py-2 overflow-hidden font-medium text-red-400 duration-300 bg-red-900 border border-b-4 border-red-400 rounded-md outline-none hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 group`}
              >
                <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                Logout
              </button>
            </div>
          )}
        </div>
      </form>
    </dialog>
  )
}
export default ConnectWallet
