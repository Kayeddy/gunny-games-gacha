// src/components/Home.tsx
import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account'
import { AppDetails } from '@algorandfoundation/algokit-utils/types/app-client'
import { ClientManager } from '@algorandfoundation/algokit-utils/types/client-manager'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { Buffer } from 'buffer'
import { useSnackbar } from 'notistack'
import React, { Fragment, useEffect, useState } from 'react'
import { Unity, useUnityContext } from 'react-unity-webgl'
import ConnectWallet from './components/ConnectWallet'
import data from './contracts/GachaContract.arc32.json'

import './styles/connectWalletButtonStyles.css'
import './styles/playUnityRenderButtonStyles.css'

import gunnyLogo from './assets/Gunny_Logo.png'
import algorandLogo from './assets/algorand-logo-teal.svg'
import loaderVideo from './assets/intro.mp4'

import ConnectWalletButton from './components/ConnectWalletButton'
import PlayUnityRenderButton from './components/PlayUnityRenderButton'
import PrizeModal from './components/PrizeModal'
import PrizesTable from './components/PrizesTable'

import { GiLaurelsTrophy as TrophyIcon } from 'react-icons/gi'
import BuyHeroTokenButton from './components/BuyHeroTokensButton'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const { signer, activeAddress } = useWallet()
  const [alreadyPlayed, setAlreadyPlayed] = useState<boolean>(false)
  const [isLoadingVideoPlaying, setIsLoadingVideoPlaying] = useState(true)
  const [showPrizes, setShowPrizes] = useState(false)

  const ASSETS = [720855015, 720855056, 720855066, 720855106, 720855169]
  const APP_ID = 722987552 //To-Do: Add to .env
  const PAY_ADDR = '6MIRQGNHP3BLQI767P54SLIYK45AXWIRUQWK3GBVCZ7FPOBHABU672MCTA' //TO-DO: how to get the addr with just the app id
  const PRICE = 1e6 //TO-DO: read from global vars from the SC if not posible simulate a get info from a function without txn

  const { unityProvider, sendMessage, loadingProgression } = useUnityContext({
    loaderUrl: 'webGL_compilation/compilation/Compilation.loader.js',
    dataUrl: 'webGL_compilation/compilation/Compilation.data',
    frameworkUrl: 'webGL_compilation/compilation/Compilation.framework.js',
    codeUrl: 'webGL_compilation/compilation/Compilation.wasm',
  })

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const sendInugiMessageToUnity = (num: string) => {
    sendMessage('LootBoxManager', 'LootMessageStr', num)
  }

  const sendRestartMessageToUnity = () => {
    sendMessage('LootBoxManager', 'Restart')
    setAlreadyPlayed(false)
  }

  // ----------
  const [loading, setLoading] = useState<boolean>(false)

  const algodC = algokit.AlgorandClient.testNet() //To-Do: set to mainnet
  const algodClient = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))

  const { enqueueSnackbar } = useSnackbar()

  const sendAppCall = async () => {
    if (!signer || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    setLoading(true)

    try {
      const appDetails = {
        resolveBy: 'id',
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
        id: APP_ID, // To-Do put this into .env
      } as AppDetails

      const atc = new algosdk.AtomicTransactionComposer()
      const sp = await algodC.getSuggestedParams()

      for (let i = 0; i < ASSETS.length; i++) {
        await algodC.account.getAssetInformation(activeAddress, ASSETS[i]).catch((response) => {
          if (response.status === 404) {
            atc.addTransaction({
              txn: algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                from: activeAddress,
                assetIndex: ASSETS[i],
                to: activeAddress,
                amount: 0,
                suggestedParams: sp,
              }),
              signer: signer,
            })
          }
        })
      }

      const contract = new algosdk.ABIContract(data.contract)

      atc.addMethodCall({
        appID: APP_ID,
        method: contract.getMethodByName('raffle_helper'),
        sender: activeAddress,
        signer: signer,
        appForeignAssets: ASSETS,
        suggestedParams: sp,
      })

      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: PAY_ADDR,
        amount: PRICE,
        suggestedParams: sp,
      })

      sp.flatFee = true
      sp.fee = algosdk.ALGORAND_MIN_TX_FEE * 2

      const name = new Uint8Array(Buffer.from('assets_list'))
      const boxes_keys = ASSETS.map((_, i) => {
        const number = intToByteArray(i)
        const final_name = new Uint8Array(name.length + number.length)
        final_name.set(name, 0)
        final_name.set(number, name.length)
        return {
          appIndex: APP_ID,
          name: final_name,
        }
      })

      atc.addMethodCall({
        appID: APP_ID,
        method: contract.getMethodByName('raffle2'),
        methodArgs: [{ txn: paymentTxn, signer: signer }, new TextEncoder().encode('0123')],
        sender: activeAddress,
        boxes: boxes_keys,
        signer: signer,
        suggestedParams: sp,
      })

      const response = await atc.execute(algodClient, 2)

      if (response == undefined) {
        enqueueSnackbar(`Error calling the contract`, { variant: 'error' })
        return
      }
      // [720855015, 720855056, 720855066, 720855106, 720855169]
      const asset_id = Number(response.methodResults[response.methodResults.length - 1].returnValue)
      let asset_id_str = ''
      switch (asset_id) {
        case 720855015:
          asset_id_str = '1166485390'
          break
        case 720855056:
          asset_id_str = '1166502923'
          break
        case 720855066:
          asset_id_str = '1166590241'
          break
        case 720855106:
          asset_id_str = '1166579975'
          break
        case 720855169:
          asset_id_str = '1166518213'
          break
        default:
          asset_id_str = asset_id.toString()
      }

      enqueueSnackbar('Your transaction is being processed', { variant: 'success' })
      // console.log(response?.methodResults)
      // response.methodResults.forEach((mr) => {
      //   console.log(`${mr.returnValue}`)
      // })

      sendInugiMessageToUnity(asset_id_str)
      setAlreadyPlayed(true)
    } catch (error) {
      enqueueSnackbar('Error during transaction', { variant: 'error' })
      console.error(error)
    } finally {
      // Always stop the loading state, regardless of success or failure
      setLoading(false)
    }
  }

  // Handle video finishing after some time (equal to Unity intro duration)
  useEffect(() => {
    const videoDuration = 5000 // 5 seconds (adjust to match Unity intro duration)
    const timer = setTimeout(() => {
      setIsLoadingVideoPlaying(false) // Stop the video after this duration
    }, videoDuration)

    return () => clearTimeout(timer) // Cleanup timer if component unmounts
  }, [])
  return (
    <>
      {isLoadingVideoPlaying && (
        <div className="fixed z-[999] flex h-screen w-screen items-center justify-center bg-black">
          <video className="h-full w-full object-contain" autoPlay muted playsInline>
            <source src={loaderVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      <div className="relative h-screen w-screen overflow-x-hidden">
        {/* Navbar */}
        <nav className="absolute top-0 h-fit w-screen bg-[#374459] bg-opacity-50 backdrop-blur-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-4">
              <img src={gunnyLogo} alt="Logo" className="mr-2 h-20 w-40" />
              <div className="relative z-10 mx-4">
                <div className="absolute inset-0 z-10 my-auto h-[10px] w-[10px] rotate-45 transform bg-white"></div>
              </div>
              <img src={algorandLogo} alt="Logo" className="h-20 w-40" />
            </div>
            {/* Desktop connect Button */}
            <div className="hidden flex-row items-center justify-center lg:flex">
              <ConnectWalletButton toggleWalletModalCallback={toggleWalletModal} />
              <button
                onClick={() => setShowPrizes(true)}
                className="connectWalletButton m-2 flex w-fit flex-row items-center justify-center gap-2 bg-opacity-50 px-4 backdrop-blur-lg"
              >
                Prizes
                <TrophyIcon className="text-lg" />
              </button>
              <BuyHeroTokenButton />
            </div>
          </div>
        </nav>

        {activeAddress && loadingProgression === 1 && (
          <PlayUnityRenderButton
            playRenderCallback={sendAppCall}
            isTransactionLoading={loading}
            isRenderAlreadyPlayed={alreadyPlayed}
            restartRenderCallback={sendRestartMessageToUnity}
          />
        )}

        <Fragment>
          <Unity unityProvider={unityProvider} className="h-screen w-screen" />
        </Fragment>
        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        <div className="absolute bottom-4 left-0 right-0 mx-auto flex w-fit flex-row flex-wrap items-center justify-center lg:hidden">
          <ConnectWalletButton toggleWalletModalCallback={toggleWalletModal} />
          <button
            onClick={() => setShowPrizes(true)}
            className="connectWalletButton flex w-fit flex-row items-center justify-center gap-2 bg-opacity-50 px-4 backdrop-blur-lg"
          >
            Prizes
            <TrophyIcon className="text-lg" />
          </button>

          <BuyHeroTokenButton />
        </div>
        <PrizeModal isOpen={showPrizes} handleClose={() => setShowPrizes(false)} content=<PrizesTable /> />
      </div>
    </>
  )
}

export default Home

function intToByteArray(int: number | bigint) {
  // Create an ArrayBuffer with a length of 8 bytes
  const buffer = new ArrayBuffer(8)
  // Create a DataView to manipulate the buffer
  const view = new DataView(buffer)
  // Set the integer value at the beginning of the buffer
  view.setBigInt64(0, BigInt(int), false) // false for big-endian, true for little-endian
  return new Uint8Array(buffer)
}
