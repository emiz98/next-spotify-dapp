import { ethers } from 'ethers'
import SpotifyMarketplace from '../contractsData/SpotifyMarketplace-address.json'
import SpotifyMarketplaceAbi from '../contractsData/SpotifyMarketplace.json'

export const getContract = async (signer) => {
  const contract = new ethers.Contract(
    SpotifyMarketplace.address,
    SpotifyMarketplaceAbi.abi,
    signer
  )
  return contract
}

export const getAllSongs = async (contract) => {
  const countBN = await contract.songCount()
  const count = ethers.BigNumber.from(countBN).toNumber()

  let temp = []
  for (let i = 0; i < count; i++) {
    let song = await contract.songs(i)
    let obj = {
      id: ethers.BigNumber.from(song.id).toNumber(),
      title: song.title,
      subtitle: song.subtitle,
      artist: song.artist,
      imageHash: song.imageHash,
      musicHash: song.musicHash,
      royaltyFee: toEth(ethers.BigNumber.from(song.royaltyFee)),
    }
    temp.push(obj)
  }
  return temp
}

export const getOwnedSongs = async (contract) => {
  const results = await contract.getOwnedSongs()
  let temp = []
  for (let i = 0; i < results.length; i++) {
    let obj = {
      id: ethers.BigNumber.from(results[i].id).toNumber(),
      title: results[i].title,
      subtitle: results[i].subtitle,
      artist: results[i].artist,
      imageHash: results[i].imageHash,
      musicHash: results[i].musicHash,
      royaltyFee: toEth(ethers.BigNumber.from(results[i].royaltyFee)),
      price: toEth(ethers.BigNumber.from(results[i].price)),
    }
    temp.push(obj)
  }
  return temp
}

export const getSaleSongs = async (contract) => {
  const results = await contract.getAllListedSongs()
  let temp = []
  for (let i = 0; i < results.length; i++) {
    let obj = {
      id: ethers.BigNumber.from(results[i].id).toNumber(),
      title: results[i].title,
      subtitle: results[i].subtitle,
      artist: results[i].artist,
      seller: results[i].seller,
      imageHash: results[i].imageHash,
      musicHash: results[i].musicHash,
      royaltyFee: toEth(ethers.BigNumber.from(results[i].royaltyFee)),
      price: toEth(ethers.BigNumber.from(results[i].price)),
    }
    temp.push(obj)
  }
  return temp
}

export const listSong = async (contract, tokenId, price) => {
  await (await contract.listSong(tokenId, toWei(price))).wait()
}

export const getAllSoldSongsFilterByOwner = async (contract, account) => {
  const filter = contract.filters.SongReListed(null, account, null)
  const results = await contract.queryFilter(filter)
  const saleSongs = await getSaleSongs(contract)

  const temp = []
  for (let i = 0; i < results.length; i++) {
    let song = await contract.songs(
      ethers.BigNumber.from(results[i].args.songId).toNumber()
    )
    let obj = {
      id: ethers.BigNumber.from(song.id).toNumber(),
      title: song.title,
      subtitle: song.subtitle,
      artist: song.artist,
      seller: song.seller,
      imageHash: song.imageHash,
      musicHash: song.musicHash,
      royaltyFee: toEth(ethers.BigNumber.from(song.royaltyFee)),
      price: toEth(ethers.BigNumber.from(results[i].args.price)),
    }
    temp.push(obj)
  }
  const filteredList = await getSoldFiltered(temp, saleSongs)
  return filteredList
}

export const getListedSongsFilterByOwner = async (contract, account) => {
  const filter = contract.filters.SongReListed(null, account, null)
  const results = await contract.queryFilter(filter)
  const saleSongs = await getSaleSongs(contract)
  const temp = []
  for (let i = 0; i < results.length; i++) {
    let song = await contract.songs(
      ethers.BigNumber.from(results[i].args.songId).toNumber()
    )
    let obj = {
      id: ethers.BigNumber.from(song.id).toNumber(),
      title: song.title,
      subtitle: song.subtitle,
      artist: song.artist,
      seller: song.seller,
      imageHash: song.imageHash,
      musicHash: song.musicHash,
      royaltyFee: toEth(ethers.BigNumber.from(song.royaltyFee)),
      price: toEth(ethers.BigNumber.from(results[i].args.price)),
    }
    temp.push(obj)
  }
  const filteredList = await getListedFiltered(temp, saleSongs)
  return filteredList
}

const getListedFiltered = async (listed, sales) => {
  return listed.filter((list) =>
    sales.some((sale) => list.seller === sale.seller)
  )
}

const getSoldFiltered = async (listed, sales) => {
  const isSameSong = (a, b) => a.id === b.id && a.seller === b.seller
  const onlyInLeft = (left, right, compareFunction) =>
    left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue))
    )
  const soldSongs = onlyInLeft(listed, sales, isSameSong)
  return soldSongs
}

export const buySong = async (contract, tokenId, totalFee) => {
  await contract.buySong(tokenId, { value: toWei(totalFee) })
}

export const username = (address) => {
  let temp1 = address.substring(0, 5)
  let temp2 = address.substring(address.length - 3)
  return temp1 + '...' + temp2
}

export const formatTime = (seconds) => {
  let time = 0
  seconds < 60 ? (time = '00:' + seconds) : (time = (seconds / 60).toFixed(2))
  return time
}

export const toWei = (num) => ethers.utils.parseEther(num.toString())
export const toEth = (num) => ethers.utils.formatEther(num)
