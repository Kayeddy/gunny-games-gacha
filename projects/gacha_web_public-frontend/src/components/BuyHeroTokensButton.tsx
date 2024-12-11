import { MdGeneratingTokens as TokenIcon } from 'react-icons/md'
import HeroTokenIcon from '../assets/Hero_token_icon.png'
export default function BuyHeroTokenButton() {
  return (
    <button type="button" className="connectWalletButton flex items-center justify-center bg-opacity-50 px-4 backdrop-blur-lg">
      <a href="https://www.google.com/" target="_blank" rel="noreferrer" className="flex w-fit flex-row items-center justify-center gap-2">
        Buy HERO
        <img src={HeroTokenIcon} alt="Hero_token_icon" className="my-auto h-10 w-10 object-cover" />
      </a>
    </button>
  )
}
