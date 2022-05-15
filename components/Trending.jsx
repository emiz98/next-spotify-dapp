import { BsPlayFill, BsPauseFill } from 'react-icons/bs'
import { motion } from 'framer-motion'

const Trending = ({ id, title, subtitle, image_hash }) => {
  return (
    <motion.div
      initial={{ x: 30, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          delay: id * 0.2,
          duration: 0.3,
        },
      }}
      className="flex-none "
    >
      <div className="relative flex max-w-lg items-center justify-center rounded-lg border-2 border-spotify bg-black pt-5">
        <div className="m-5 space-y-8">
          <div>
            <h6 className="font-bold">{subtitle}</h6>
            <h2 className="text-5xl font-bold line-clamp-2">{title}</h2>
          </div>
          <div
            className="flex w-fit cursor-pointer items-center gap-x-2 rounded-full border-2 border-spotify px-4 py-1
          font-medium transition ease-out hover:bg-spotify hover:text-black"
          >
            <BsPlayFill className="text-2xl" />
            <span>Play Now</span>
          </div>
        </div>
        <img
          className="absolute top-2 right-2"
          src="/prod/trending_tag.png"
          alt="tag"
        />
        <img
          className="h-60 object-contain"
          src={image_hash}
          alt="trending_image"
        />
      </div>
    </motion.div>
  )
}

export default Trending
