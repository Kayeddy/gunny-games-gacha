import { FaPlay as PlayIcon } from 'react-icons/fa'
import { MdOutlineRestartAlt as RestartIcon } from 'react-icons/md'

export default function PlayUnityRenderButton({
  restartRenderCallback,
  playRenderCallback,
  isTransactionLoading,
  isRenderAlreadyPlayed,
}: {
  playRenderCallback: () => void
  restartRenderCallback: () => void
  isTransactionLoading: boolean
  isRenderAlreadyPlayed: boolean
}) {
  const handleClick = () => {
    if (!isTransactionLoading) {
      if (isRenderAlreadyPlayed) {
        restartRenderCallback()
      } else {
        playRenderCallback()
      }
    }
  }

  return (
    <button
      className={`playButtonContainer z-10 absolute left-1/2 top-[25vh] -translate-x-12 transform lg:top-[290px] lg:-translate-x-7 ${(isTransactionLoading || isRenderAlreadyPlayed) && '-translate-y-[10vh] transition-all ease-in-out duration-300'}`}
      onClick={handleClick}
    >
      {!isTransactionLoading && (
        <div className="wrapper">
          <div>
            {isRenderAlreadyPlayed ? (
              <span className="flex flex-row items-center justify-center gap-2">
                <span>Restart</span>
                <RestartIcon className="text-3xl" />
              </span>
            ) : (
              <span className="flex flex-col items-center justify-center gap-2 px-2">
                <PlayIcon className="mx-auto text-3xl" />
                <span className="mt-2 lg:text-xl">(X HERO tokens)</span>
              </span>
            )}
          </div>
          <div className="circle circle-12"></div>
          <div className="circle circle-11"></div>
          <div className="circle circle-10"></div>
          <div className="circle circle-9"></div>
          <div className="circle circle-8"></div>
          <div className="circle circle-7"></div>
          <div className="circle circle-6"></div>
          <div className="circle circle-5"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-1"></div>
        </div>
      )}

      {isTransactionLoading && (
        <div className="flex w-32 items-center justify-center p-1">
          {' '}
          <span className="loading loading-spinner" />
        </div>
      )}
    </button>
  )
}
