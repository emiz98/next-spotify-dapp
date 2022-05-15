import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { username } from '../utils/utils'
import { IoIosSearch } from 'react-icons/io'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

const Header = ({ account, login }) => {
  const router = useRouter()

  return (
    <motion.div className="flex select-none items-center justify-between p-6">
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.3,
          },
        }}
        className="flex items-center gap-x-3"
      >
        <h3
          onClick={() => router.push('/')}
          className={`cursor-pointer text-xl text-gray-400 hover:text-white ${
            router.pathname == '/' && 'font-bold !text-white'
          } md:text-2xl`}
        >
          Home
        </h3>
        <h3
          onClick={() => router.push('account')}
          className={`mt-1 cursor-pointer text-xl text-gray-400 ${
            router.pathname == '/account' && 'font-bold !text-white'
          } transition ease-in-out hover:text-white md:text-2xl`}
        >
          My Account
        </h3>
      </motion.div>
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 0.4,
          },
        }}
        exit={{
          x: 20,
          opacity: 0,
        }}
        className="flex items-center space-x-5"
      >
        <div className="hidden w-64 items-center space-x-3 rounded-full border-2 border-white py-2 px-3 text-white md:flex">
          <IoIosSearch className="text-2xl" />
          <input
            className="w-full bg-transparent outline-none"
            type="text"
            placeholder="Search music, album, artist"
          />
        </div>
        {account ? (
          <div
            onClick={() => router.push('account')}
            className="flex cursor-pointer items-center rounded-full border-2 border-spotify
        p-1 font-medium transition ease-in-out hover:bg-spotify"
          >
            <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
            <span className="hidden px-3 py-1 text-sm text-spotify hover:text-black sm:inline sm:px-4">
              {username(account)}
            </span>
          </div>
        ) : (
          <div
            onClick={() => login()}
            className="flex cursor-pointer items-center rounded-full border-2 border-spotify
          px-2 py-2 font-medium transition ease-in-out hover:bg-spotify"
          >
            <span className="px-3 py-1 text-sm text-white hover:text-black md:px-4">
              Connect
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Header
