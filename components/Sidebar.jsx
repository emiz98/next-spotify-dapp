import { HiHome } from 'react-icons/hi'
import { FaRegHeart } from 'react-icons/fa'
import { MdPlaylistPlay, MdPodcasts } from 'react-icons/md'
import { BsPlusCircle } from 'react-icons/bs'
import { setUploadSong } from '../redux/slices/ModelSlices'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const Sidebar = ({ account }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      }}
      className="hidden min-w-fit select-none flex-col items-center space-y-8 p-5 md:flex"
    >
      <img
        onClick={() => router.push('/')}
        className="mb-1 h-12 cursor-pointer object-contain transition ease-out hover:scale-110 active:scale-95"
        src="spotify.png"
        alt="logo"
      />
      <HiHome
        onClick={() => router.push('/')}
        className="icon sidebarIcon text-spotify"
      />
      <MdPodcasts className="icon sidebarIcon" />
      <FaRegHeart className="icon sidebarIcon" />
      <MdPlaylistPlay className="icon sidebarIcon" />
      <div className="h-[1px] w-full bg-gray-500" />

      {account && (
        <div onClick={() => router.push('account')} className="cursor-pointer">
          <Jazzicon diameter={35} seed={jsNumberForAddress(account)} />
        </div>
      )}

      <BsPlusCircle
        className="icon sidebarIcon"
        onClick={() => dispatch(setUploadSong(true))}
      />
    </motion.div>
  )
}

export default Sidebar
