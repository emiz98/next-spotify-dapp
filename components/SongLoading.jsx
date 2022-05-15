import { motion } from 'framer-motion'
import { SiEthereum } from 'react-icons/si'

const SongLoading = ({ framerIndex, onSale, sold }) => {
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          delay: framerIndex * 0.1,
          duration: 0.3,
        },
      }}
      className="w-full animate-pulse md:min-w-fit"
    >
      <div
        className={`relative flex h-52 overflow-hidden rounded-t-lg bg-gray-800 bg-center ${
          !onSale && 'rounded-b-lg'
        }
    border-2 border-gray-600 bg-cover`}
      >
        {sold && (
          <img
            className="absolute top-0 right-0 z-20 h-20 opacity-40 grayscale"
            src="prod/sold.png"
            alt="sold"
          />
        )}
        <div className="absolute top-0 z-20 flex w-full items-start justify-between p-2">
          <img
            className="h-5 animate-pulse object-contain grayscale"
            src="spotify.png"
            alt="spotify_logo"
          />
        </div>

        <div className="absolute bottom-2 z-20 flex w-full items-center justify-between p-2">
          <div className="w-2/3 space-y-2">
            <div className="h-5 w-2/3 animate-pulse rounded-md bg-gray-600" />
            <div className="h-5 w-full animate-pulse rounded-md bg-gray-600" />
          </div>
        </div>

        <div
          className="absolute bottom-0 z-10 h-2/3 w-full  bg-gradient-to-t from-black 
    to-transparent transition-all ease-in-out"
        />
      </div>
      {onSale && (
        <div className="flex items-center justify-between rounded-b-lg border-x-2 border-b-2 border-gray-600 bg-black p-2">
          <div className="flex items-center gap-x-1 text-sm">
            <SiEthereum className="opacity-30" />
            <span className="h-5 w-10 animate-pulse rounded-md bg-gray-700" />
          </div>
          <button className="animate-pulse rounded-md border-2 border-gray-600 px-5 py-1 font-medium text-gray-600">
            Buy Now
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default SongLoading
