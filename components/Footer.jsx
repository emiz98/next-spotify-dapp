import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { TiArrowLoop } from 'react-icons/ti'
import { FaRegHeart } from 'react-icons/fa'
import { MdDevices, MdQueueMusic } from 'react-icons/md'
import {
  IoIosSkipBackward,
  IoIosSkipForward,
  IoIosShuffle,
  IoMdVolumeHigh,
  IoMdVolumeMute,
  IoMdVolumeLow,
} from 'react-icons/io'
import { useState } from 'react'
import ReactPlayer from 'react-player'
import { useSelector } from 'react-redux'
import { select_currentSong } from '../redux/slices/currentSong'
import { formatTime } from '../utils/utils'
import { motion } from 'framer-motion'

const Footer = () => {
  const song = useSelector(select_currentSong)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.2)
  const [seek, setSeek] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [reactPlayer, setReactPlayer] = useState(null)

  const handleOnProgress = (state) => {
    setStartTime(parseInt(state.playedSeconds))
    setSeek((startTime * 100) / endTime / 100)
  }
  const handleDuration = (e) => {
    setEndTime(e)
  }

  const ref = (e) => {
    setReactPlayer(e)
  }

  const seekFunc = (newValue) => {
    reactPlayer.seekTo(newValue)
    setSeek(newValue)
  }

  const handleVolumeOnScroll = (event, newValue) => {
    if (event.nativeEvent.wheelDelta > 0) {
      let tempVol = volume + 0.05
      tempVol < 1 && tempVol > 0 && setVolume(tempVol)
    } else {
      let tempVol = volume - 0.05
      tempVol < 1 && tempVol > 0 && setVolume(tempVol)
    }
  }

  return (
    <div>
      {song ? (
        <motion.div
          initial={{ y: +100 }}
          animate={{
            y: 0,
            transition: {
              duration: 0.3,
            },
          }}
          className="fixed bottom-0 z-50 flex w-full select-none items-center justify-between 
    bg-black bg-opacity-90 px-5 py-3 text-white"
        >
          <ReactPlayer
            ref={ref}
            url={'http://ipfs.infura.io/ipfs/' + song?.song_hash}
            style={{ display: 'none' }}
            playing={isPlaying}
            // muted={mute}
            volume={volume}
            onProgress={(e) => handleOnProgress(e)}
            onDuration={(e) => handleDuration(e)}
          />
          <div className="ml-2 flex flex-[0.3] items-center gap-x-5">
            <img
              className="hidden h-14 w-14 rounded-md border-2 border-spotify object-cover object-cover sm:inline"
              src={'http://ipfs.infura.io/ipfs/' + song?.image_hash}
              alt="album_image"
            />
            <div>
              <h3 className="font-bold line-clamp-1">{song?.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-1">
                {song?.subtitle}
              </p>
            </div>
            <FaRegHeart className="icon hidden text-xl md:inline" />
          </div>

          <div className="flex flex-1 flex-col items-center space-y-2 sm:flex-[0.4]">
            <div className="flex items-center gap-x-4">
              <IoIosShuffle className="icon footerIcon" />
              <IoIosSkipBackward className="icon footerIcon" />
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="playIcon"
              >
                {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
              </div>
              <IoIosSkipForward className="icon footerIcon" />
              <TiArrowLoop className="icon footerIcon" />
            </div>
            <div className="flex items-center gap-x-2">
              <span className="text-xs font-light">
                {formatTime(startTime)}
              </span>
              <input
                className="seek_slider sm:w-[14rem] md:w-[25rem]"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={seek}
                onChange={(event) => {
                  seekFunc(event.target.valueAsNumber)
                }}
              />
              <span className="text-xs font-light">{formatTime(endTime)}</span>
            </div>
          </div>

          <div className="hidden flex-[0.3] items-center justify-end gap-x-3 sm:flex">
            <MdQueueMusic className="icon footerIcon hidden md:inline" />
            <MdDevices className="icon footerIcon hidden md:inline" />
            <div
              className="ml-5 flex items-center gap-x-3"
              // onWheel={() => setVolume(volume + 0.1)}
              onWheel={(event) => handleVolumeOnScroll(event)}
            >
              {volume > 0.5 ? (
                <IoMdVolumeHigh
                  className="icon text-3xl"
                  onClick={() => setVolume(0)}
                />
              ) : volume == 0 ? (
                <IoMdVolumeMute
                  className="icon text-3xl"
                  onClick={() => setVolume(0)}
                />
              ) : (
                <IoMdVolumeLow
                  className="icon text-3xl"
                  onClick={() => setVolume(0)}
                />
              )}
              <input
                className="volume_slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => {
                  setVolume(event.target.valueAsNumber)
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Footer
