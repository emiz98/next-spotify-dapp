import { BsPlayFill, BsPauseFill, BsFilterRight } from 'react-icons/bs'
import { SiEthereum } from 'react-icons/si'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { setCurrentSong } from '../redux/slices/currentSong'
import { setHoverSong } from '../redux/slices/hoverSong'
import { useDispatch } from 'react-redux'
import { usePalette } from 'react-palette'
import { setRelistSong } from '../redux/slices/RelistSlice'
import { buySong } from '../utils/utils'

const Song = ({
  framerIndex,
  id,
  title,
  subtitle,
  image_hash,
  song_hash,
  royaltyFee,
  onSale,
  sold,
  price,
  listFunc,
  contract,
}) => {
  const dispatch = useDispatch()
  const { data } = usePalette('https://ipfs.infura.io/ipfs/' + image_hash)
  const [isPlaying, setIsPlaying] = useState(false)
  const song = {
    id,
    title,
    subtitle,
    image_hash,
    song_hash,
    royaltyFee,
  }

  const setNowPlaying = () => {
    dispatch(setCurrentSong(song))
  }

  const setHighlight = (color) => {
    dispatch(setHoverSong(color))
  }

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
      className="group w-full md:w-52"
      onMouseEnter={() => setHighlight(data.muted)}
      onMouseLeave={() => setHighlight('#065120')}
    >
      <div
        style={{
          backgroundImage: `url(http://ipfs.infura.io/ipfs/${image_hash})`,
        }}
        className={`relative flex h-52 cursor-pointer overflow-hidden rounded-t-lg bg-center ${
          !onSale && 'rounded-b-lg'
        }
      border-2 border-spotify bg-cover`}
      >
        {sold && (
          <img
            className="absolute top-0 right-0 z-20 h-16"
            src="prod/sold.png"
            alt="sold"
          />
        )}
        <div className="absolute top-0 z-20 flex w-full items-start justify-between p-2">
          <img
            className="h-5 object-contain"
            src="spotify.png"
            alt="spotify_logo"
          />
          {listFunc && (
            <BsFilterRight
              onClick={() =>
                dispatch(setRelistSong({ song: song, state: true }))
              }
              className="translate-x-5 text-2xl text-gray-300 opacity-0 transition ease-in-out
               hover:text-white group-hover:translate-x-0 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="absolute bottom-2 z-20 flex w-full items-center justify-between p-2">
          <div className="w-2/3">
            <h6 className="font-medium line-clamp-1">{title}</h6>
            <h2 className="text-sm font-light text-gray-400 line-clamp-1">
              {subtitle}
            </h2>
          </div>
          <div
            className="translate-y-3 rounded-full bg-spotify p-1 text-3xl
            text-black opacity-0 transition-all duration-300 ease-out hover:scale-110 
          active:scale-95 group-hover:translate-y-0 group-hover:opacity-100"
            onClick={() => setNowPlaying()}
          >
            {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
          </div>
        </div>

        <div
          className="absolute bottom-0 z-10 h-2/3 w-full  bg-gradient-to-t from-black 
      to-transparent transition-all ease-in-out group-hover:h-full"
        />
      </div>
      {onSale && (
        <div className="flex items-center justify-between rounded-b-lg border-x-2 border-b-2 border-spotify bg-black p-2">
          <div className="flex items-center gap-x-1 text-sm">
            <SiEthereum />
            <span>{parseFloat(price) + parseFloat(royaltyFee)}</span>
          </div>
          <button
            onClick={() =>
              buySong(contract, id, parseFloat(price) + parseFloat(royaltyFee))
            }
            className="rounded-md border-2 border-spotify px-5 py-1 font-medium 
          text-white hover:bg-spotify hover:text-black"
          >
            Buy Now
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default Song
