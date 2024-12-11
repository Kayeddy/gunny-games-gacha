import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gunnyLogo from '../assets/Gunny_Logo.png'

interface ModalProps {
  isOpen: boolean
  handleClose: () => void
  content: React.ReactNode
}

const PrizeModal: React.FC<ModalProps> = ({ isOpen, handleClose, content }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const openModal = () => setIsVisible(true)
  const closeModal = () => {
    setIsVisible(false)
    handleClose()
  }

  useEffect(() => {
    if (isOpen) {
      openModal()
    } else {
      closeModal()
    }
  }, [isOpen])

  return (
    <>
      {/* AnimatePresence to handle mounting/unmounting of modal with transitions */}
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Background backdrop */}
            <motion.div
              className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-50 bg-opacity-75 backdrop-blur-xl"
              aria-hidden="true"
              onClick={closeModal} // Close the modal when clicking outside
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 z-50 flex h-full w-full items-center justify-center"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10 m-auto flex flex-col items-center justify-start gap-4 overflow-y-auto rounded-lg bg-transparent p-4 shadow-xl">
                <img src={gunnyLogo} alt="gunny_logo_modal_header" className="w-2xl h-32 object-cover" />
                <div>{content}</div>

                <div>
                  <button
                    data-test-id="logout"
                    onClick={closeModal}
                    className="group relative overflow-hidden rounded-md border border-b-4 border-red-400 bg-red-900 px-4 py-2 font-medium text-red-400 outline-none duration-300 hover:border-b hover:border-t-4 hover:brightness-150 active:opacity-75"
                  >
                    <span className="absolute -top-[150%] left-0 inline-flex h-[5px] w-80 rounded-md bg-red-400 opacity-50 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)] shadow-red-400 duration-500 group-hover:top-[150%]"></span>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PrizeModal
