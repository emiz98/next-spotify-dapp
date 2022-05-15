import Head from 'next/head'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Trending from '../components/Trending'
import Song from '../components/Song'
import UploadModel from '../components/UploadModel'
import Alert from '../components/Alert'
import SongLoading from '../components/SongLoading'
import mockAPI from '../utils/musicMockApi'
import { useDispatch, useSelector } from 'react-redux'
import { select_hoverSong } from '../redux/slices/hoverSong'
import { select_uploadSong } from '../redux/slices/ModelSlices'
import { AnimatePresence, motion } from 'framer-motion'
import { getAllSongs, getContract, getSaleSongs } from '../utils/utils'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import { VscGraphLine } from 'react-icons/vsc'
import { select_currentSong, setQueue } from '../redux/slices/currentSong'

const Home = () => {
  const dispatch = useDispatch()
  const [account, setAccount] = useState(null)
  const [networkApproved, setNetworkApproved] = useState(false)
  const [contract, setContract] = useState(null)
  const song = useSelector(select_currentSong)
  const [loading, setLoading] = useState(true)
  const [allSongs, setAllSongs] = useState(null)
  const [saleSongs, setSaleSongs] = useState(null)
  const highlightColor = useSelector(select_hoverSong)
  const uploadModal = useSelector(select_uploadSong)

  useEffect(() => {
    web3Handler()
  }, [])

  useEffect(async () => {
    contract && setAllSongs(await getAllSongs(contract))
    contract && setSaleSongs(await getSaleSongs(contract))
  }, [contract])

  useEffect(() => {
    if (allSongs && saleSongs) {
      setLoading(false)
      dispatch(setQueue(allSongs))
    }
  }, [allSongs, saleSongs])

  const web3Handler = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    })
    setAccount(accounts[0])
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const { chainId } = await provider.getNetwork()
    if (chainId == 3) {
      const signer = provider.getSigner()
      setContract(await getContract(signer))
    } else {
      setNetworkApproved(true)
    }
  }

  return (
    <div className="relative h-screen overflow-hidden text-white transition-all ease-in-out">
      <Head>
        <title>Spotify 3.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatePresence>
        {highlightColor != '#065120' ? (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.3,
              },
            }}
            exit={{ opacity: 0.9 }}
            className="absolute -z-10 h-screen w-screen bg-black"
            style={{
              backgroundImage: `linear-gradient(to right, ${highlightColor}, black 60%)`,
            }}
          />
        ) : (
          <div className="absolute -z-10 h-screen w-screen bg-gradient-to-r from-[#033b17] via-black to-black"></div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploadModal && account && (
          <UploadModel contract={contract} setAllSongs={setAllSongs} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {networkApproved && <Alert setNetworkApproved={setNetworkApproved} />}
      </AnimatePresence>

      <main className="flex">
        <Sidebar account={account} />
        <div className="flex-1">
          <Header account={account} login={web3Handler} />
          <div
            className={`h-screen overflow-y-scroll px-6 ${
              song ? 'pb-56' : 'pb-32'
            } pt-2`}
          >
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              className="mb-6 hidden text-3xl font-bold md:flex"
            >
              Trending
            </motion.h2>
            <div className="hidden gap-x-5 overflow-x-scroll scrollbar-hide md:flex">
              {mockAPI.trending.map(({ id, title, subtitle, image_hash }) => (
                <Trending
                  key={id}
                  id={id}
                  title={title}
                  subtitle={subtitle}
                  image_hash={image_hash}
                />
              ))}
            </div>

            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              className="mb-6 text-3xl font-bold md:mt-14"
            >
              Listen Now
            </motion.h2>
            {loading ? (
              <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {Array.from(Array(5)).map((_, i) => (
                  <SongLoading key={i} framerIndex={i} />
                ))}
              </div>
            ) : allSongs.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {allSongs?.map(
                  (
                    { id, title, subtitle, imageHash, musicHash },
                    framerIndex
                  ) => (
                    <Song
                      framerIndex={framerIndex}
                      key={id}
                      id={id}
                      title={title}
                      subtitle={subtitle}
                      image_hash={imageHash}
                      song_hash={musicHash}
                    />
                  )
                )}
              </div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className="flex w-fit items-center gap-x-2 rounded-lg border-2 border-white px-4 py-2"
              >
                <HiOutlineEmojiSad className="text-2xl" />
                <h4>Looks like spotify has no music at the moment</h4>
              </motion.div>
            )}

            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              className="mt-14 mb-6 text-3xl font-bold"
            >
              Now On Sale
            </motion.h2>

            {loading ? (
              <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {Array.from(Array(5)).map((_, i) => (
                  <SongLoading key={i} framerIndex={i} onSale />
                ))}
              </div>
            ) : saleSongs.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {saleSongs.map(
                  (
                    {
                      id,
                      title,
                      subtitle,
                      imageHash,
                      musicHash,
                      royaltyFee,
                      price,
                    },
                    framerIndex
                  ) => (
                    <Song
                      framerIndex={framerIndex}
                      key={id}
                      id={id}
                      title={title}
                      subtitle={subtitle}
                      image_hash={imageHash}
                      song_hash={musicHash}
                      price={price}
                      onSale
                      royaltyFee={royaltyFee}
                      contract={contract}
                    />
                  )
                )}
              </div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                className="flex w-fit items-center gap-x-2 rounded-lg border-2 border-white px-4 py-2"
              >
                <VscGraphLine className="text-2xl" />
                <h4>Looks like spotify has no sales at the moment</h4>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
