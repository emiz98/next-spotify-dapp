import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { BsInfoCircle } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { FaEthereum } from 'react-icons/fa'
import { setRelistSong } from '../redux/slices/RelistSlice'
import { listSong } from '../utils/utils'
import { select_relistSong } from '../redux/slices/RelistSlice'
import { useState } from 'react'

const RelistModal = ({ contract, ownedSongsFunc, listedSongsFunc }) => {
  const dispatch = useDispatch()
  const song = useSelector(select_relistSong)
  const [minting, setMinting] = useState(false)
  const [input, setInput] = useState('')

  const relistSong = async () => {
    if (!input) return
    setMinting(true)
    await listSong(contract, song.id, input)
    setMinting(false)
    dispatch(setRelistSong({ song: {}, state: false }))
    ownedSongsFunc()
    listedSongsFunc()
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
      }}
      className="absolute z-50 flex h-screen w-screen items-center backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: {
            duration: 0.3,
          },
        }}
        exit={{
          scale: 0,
        }}
        className="relative mx-auto max-w-lg rounded-lg bg-gradient-to-r from-gray-800 to-black p-10"
      >
        <IoMdClose
          onClick={() => dispatch(setRelistSong({ song: {}, state: false }))}
          className="absolute top-3 right-5 cursor-pointer rounded-full border-2 border-gray-300 p-1
    text-3xl text-gray-300 transition ease-out hover:bg-spotify hover:text-black"
        />
        <div className="mt-5 flex items-start justify-between gap-x-5">
          {/* Album Image */}
          <div
            style={{
              backgroundImage: `url(https://ipfs.infura.io/ipfs/${song?.image_hash})`,
            }}
            className="flex h-40 w-40 space-y-2 overflow-hidden
        rounded-lg border-2 border-gray-600 bg-gray-900 bg-cover bg-center p-10"
          />
          {/* Song Info */}
          <div className="flex flex-1 flex-col">
            <h2 className="text-2xl font-bold">{song?.title}</h2>
            <h2 className="text-gray-400">{song?.subtitle}</h2>
            <div className="mt-5 space-y-2">
              <h2>Royalty Fee</h2>
              <div className="-ml-[2px] flex items-center gap-x-2 text-gray-400">
                <FaEthereum className="text-xl" />
                <span>{song?.royaltyFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Listing */}
        <div className="space-y-2 py-8">
          <h2 className="">Listing Fee</h2>
          <div className="flex items-center gap-x-1 text-gray-400">
            <BsInfoCircle className="text-sm" />
            <p className="text-xs">
              Please set a one time selling price for this song!
            </p>
          </div>
          <div className="flex items-center gap-x-2 pt-2">
            <FaEthereum className="text-xl" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-lg bg-gray-800 px-4 py-2 outline-none"
              type="number"
              placeholder="Enter amount (eth)"
            />
          </div>
        </div>
        <div
          onClick={() => relistSong()}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-spotify
          p-2 font-bold text-black transition ease-out hover:bg-green-400"
        >
          {minting ? (
            <>
              <svg
                role="status"
                className="mr-2 inline h-5 w-5 animate-spin fill-green-100 text-green-700 dark:text-green-700"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span>Minting</span>
            </>
          ) : (
            <span>Mint Now</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RelistModal
