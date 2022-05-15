const { expect } = require('chai')

const toWei = (num) => ethers.utils.parseEther(num.toString())
const toEth = (num) => ethers.utils.formatEther(num)

describe('SpotifyMarketplace', () => {
  let spotifyMarketplace
  let deployer, artist, user1, user2, users
  before(async function () {
    // Get the ContractFactory and Signers here.
    const SpotifyMarketplaceFactory = await ethers.getContractFactory(
      'SpotifyMarketplace'
    )
    ;[deployer, artist, user1, user2, ...users] = await ethers.getSigners()

    // Deploy music nft marketplace contract
    spotifyMarketplace = await SpotifyMarketplaceFactory.deploy()
  })

  describe('Deployment', function () {
    it('Name and symbol verification', async function () {
      const name = 'SpotifyDAPP'
      const symbol = 'DAPP'
      expect(await spotifyMarketplace.name()).to.equal(name)
      expect(await spotifyMarketplace.symbol()).to.equal(symbol)
    })
  })

  describe('Song', () => {
    const song_hash = 'spotify_song_hash'
    const image_hash = 'spotify_image_hash'

    it('Uploading a song', async () => {
      //Success Scenarios
      await expect(
        spotifyMarketplace
          .connect(artist)
          .uploadSong(
            'testTitle',
            'testSubtitle',
            song_hash,
            image_hash,
            toWei(0.01)
          )
      )
        .to.emit(spotifyMarketplace, 'SongCreated')
        .withArgs(
          0,
          'testTitle',
          'testSubtitle',
          song_hash,
          image_hash,
          await artist.getAddress(),
          '0x0000000000000000000000000000000000000000',
          toWei(0.01)
        )
    })
    it('Verify Minted music', async function () {
      expect(await spotifyMarketplace.balanceOf(artist.address)).to.equal(1)
      // Get song from the songs array then check fields to ensure they are correct
      const song = await spotifyMarketplace.songs(0)
      expect(song.id).to.equal(0)
      expect(song.artist).to.equal(artist.address)
      expect(song.seller).to.equal('0x0000000000000000000000000000000000000000')
      expect(song.price).to.equal(0)
      expect(song.royaltyFee).to.equal(toWei(0.01))
    })
    it('(Getter) get owned songs', async function () {
      const ownedSongs = await spotifyMarketplace
        .connect(artist)
        .getOwnedSongs()
      expect(ownedSongs.length).to.equal(1)
      expect(ownedSongs[0].id).to.equal(0)
      expect(ownedSongs[0].title).to.equal('testTitle')
    })
  })

  describe('List the song', () => {
    it('Listing', async () => {
      await expect(spotifyMarketplace.connect(artist).listSong(0, toWei(2)))
        .to.emit(spotifyMarketplace, 'SongReListed')
        .withArgs(0, await artist.getAddress(), toWei(2))
    })
    it('Verify Listing', async () => {
      expect(await spotifyMarketplace.balanceOf(artist.address)).to.equal(0)
      expect(
        await spotifyMarketplace.balanceOf(spotifyMarketplace.address)
      ).to.equal(1)
      const listedSong = await spotifyMarketplace.songs(0)
      expect(listedSong.seller).to.equal(artist.address)
      expect(listedSong.price).to.equal(toWei(2))
    })
    it('(Getter) listed successful', async function () {
      const listedSongs = await spotifyMarketplace.getAllListedSongs()
      if (listedSongs) {
        expect(listedSongs[0].id).to.equal(0)
        expect(listedSongs[0].title).to.equal('testTitle')
      }
    })
  })

  describe('Buy song', function () {
    let sellerInitialEthBal, buyerInitialEthBal

    it('Transferring', async function () {
      sellerInitialEthBal = await artist.getBalance()
      buyerInitialEthBal = await user1.getBalance()
      await expect(
        spotifyMarketplace.connect(user1).buySong(0, { value: toWei(2.01) })
      )
        .to.emit(spotifyMarketplace, 'BuySong')
        .withArgs(
          0,
          '0x0000000000000000000000000000000000000000',
          user1.address,
          toWei(2)
        )
    })

    it('Pay seller fee & Pay royalty fee', async function () {
      // Item seller should be zero addr
      expect((await spotifyMarketplace.songs(0)).seller).to.equal(
        '0x0000000000000000000000000000000000000000'
      )

      const sellerFinalEthBal = await artist.getBalance()
      const buyerFinalEthBal = await user1.getBalance()

      // Seller should receive payment (seller == artist)
      expect(+toEth(sellerFinalEthBal)).to.greaterThan(
        +toEth(sellerInitialEthBal) + +toEth(2)
      )

      // buyer should pay the payment
      expect(+toEth(buyerInitialEthBal)).to.greaterThan(
        +toEth(buyerFinalEthBal) + +toEth(2)
      )
    })

    it('Verify purchase', async function () {
      // The buyer should now own the nft
      expect(await spotifyMarketplace.ownerOf(0)).to.equal(user1.address)
    })

    it('Requirement Check', async function () {
      // Fails when ether sent does not equal asking price
      await expect(
        spotifyMarketplace.connect(user1).buySong(0, { value: toWei(2) })
      ).to.be.revertedWith(
        'Please send the asking price in order to complete the purchase'
      )
    })

    it('(Getter) No songs listed', async function () {
      const listedSongs = await spotifyMarketplace.getAllListedSongs()
      expect(listedSongs.length).to.equal(0)
    })

    it('(Getter) get owned songs', async function () {
      const artistOwnedSongs = await spotifyMarketplace
        .connect(artist)
        .getOwnedSongs()
      const buyerOwnedSongs = await spotifyMarketplace
        .connect(user1)
        .getOwnedSongs()
      expect(artistOwnedSongs.length).to.equal(0)
      expect(buyerOwnedSongs.length).to.equal(1)
    })
  })
})
