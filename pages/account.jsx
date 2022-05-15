import Head from 'next/head'
import { ethers } from 'ethers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import UploadModel from '../components/UploadModel'
import Song from '../components/Song'
import Alert from '../components/Alert'
import { useSelector } from 'react-redux'
import { select_hoverSong } from '../redux/slices/hoverSong'
import { select_uploadSong } from '../redux/slices/ModelSlices'
import { select_relistState } from '../redux/slices/RelistSlice'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BsQuestionSquareFill } from 'react-icons/bs'
import { MdLibraryMusic } from 'react-icons/md'
import { HiCurrencyDollar } from 'react-icons/hi'
import {
  getAllSoldSongsFilterByOwner,
  getContract,
  getListedSongsFilterByOwner,
  getOwnedSongs,
} from '../utils/utils'
import RelistModal from '../components/RelistModal'

const account = () => {
  const highlightColor = useSelector(select_hoverSong)
  const uploadModal = useSelector(select_uploadSong)
  const relistModal = useSelector(select_relistState)
  const [networkApproved, setNetworkApproved] = useState(false)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [ownedSongs, setOwnedSongs] = useState([])
  const [listedSongs, setListedSongs] = useState([])
  const [soldSongs, setSoldSongs] = useState([])

  useEffect(() => {
    web3Handler()
  }, [])

  useEffect(async () => {
    contract && ownedSongsFunc()
    contract && listedSongsFunc()
    contract && soldSongsFunc()
  }, [contract])

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

  const ownedSongsFunc = async () => {
    setOwnedSongs(await getOwnedSongs(contract))
  }
  const listedSongsFunc = async () => {
    setListedSongs(await getListedSongsFilterByOwner(contract, account))
  }
  const soldSongsFunc = async () => {
    setSoldSongs(await getAllSoldSongsFilterByOwner(contract, account))
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
          <UploadModel contract={contract} ownedSongsFunc={ownedSongsFunc} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {networkApproved && <Alert setNetworkApproved={setNetworkApproved} />}
      </AnimatePresence>

      <AnimatePresence>
        {relistModal && account && (
          <RelistModal
            contract={contract}
            ownedSongsFunc={ownedSongsFunc}
            listedSongsFunc={listedSongsFunc}
          />
        )}
      </AnimatePresence>

      <main className="flex">
        <Sidebar account={account} />
        <div className="flex-1">
          <Header account={account} />
          <div className="h-screen overflow-y-scroll px-6 pb-56 pt-2">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              className="mb-6 text-3xl font-bold "
            >
              My Songs
            </motion.h2>
            {ownedSongs.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {ownedSongs.map(
                  (
                    { id, title, subtitle, imageHash, musicHash, royaltyFee },
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
                      royaltyFee={royaltyFee}
                      listFunc
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
                <BsQuestionSquareFill className="text-2xl" />
                <h4>Looks like you dont own any music</h4>
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
              className="mb-6 text-3xl font-bold md:mt-14"
            >
              Listed Songs
            </motion.h2>
            {listedSongs.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {listedSongs?.map(
                  (
                    {
                      id,
                      title,
                      subtitle,
                      imageHash,
                      musicHash,
                      price,
                      royaltyFee,
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
                      royaltyFee={royaltyFee}
                      onSale
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
                <MdLibraryMusic className="text-2xl" />
                <h4>Looks like you dont have any music listed</h4>
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
              className="mb-6 text-3xl font-bold md:mt-14"
            >
              Sold Songs
            </motion.h2>
            {soldSongs.length > 0 ? (
              <div className="grid w-full grid-cols-1 gap-y-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {soldSongs?.map(
                  (
                    {
                      id,
                      title,
                      subtitle,
                      imageHash,
                      musicHash,
                      price,
                      royaltyFee,
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
                      royaltyFee={royaltyFee}
                      sold
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
                <HiCurrencyDollar className="text-2xl" />
                <h4>Looks like you dont have any music sold</h4>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default account
