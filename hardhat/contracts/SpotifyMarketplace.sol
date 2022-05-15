// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract SpotifyMarketplace is ERC721('SpotifyDAPP', 'DAPP'), Ownable {
    string public contractName = 'SpotifyMarketplace';

    uint256 public songCount = 0;
    mapping(uint256 => Song) public songs;

    struct Song {
        uint256 id;
        string title;
        string subtitle;
        string musicHash;
        string imageHash;
        address artist;
        address seller;
        uint256 price;
        uint256 royaltyFee;
    }

    event SongCreated(
        uint256 id,
        string title,
        string subtitle,
        string musicHash,
        string imageHash,
        address artist,
        address seller,
        uint256 royaltyFee
    );

    event SongReListed(
        uint256 indexed songId,
        address indexed seller,
        uint256 price
    );

    event BuySong(
        uint256 indexed songId,
        address indexed seller,
        address buyer,
        uint256 price
    );

    function uploadSong(
        string memory _title,
        string memory _subtitle,
        string memory _musicHash,
        string memory _imageHash,
        uint256 _royaltyFee
    ) public {
        // Make sure the image hashes exists
        require(bytes(_musicHash).length > 0);
        require(bytes(_imageHash).length > 0);

        // Make sure details exists
        require(bytes(_title).length > 0);
        require(bytes(_subtitle).length > 0);

        // Make sure royalty fee exists
        require(_royaltyFee > 0);

        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Mint the song
        _mint(msg.sender, songCount);

        // Add song to the contract
        songs[songCount] = Song(
            songCount,
            _title,
            _subtitle,
            _musicHash,
            _imageHash,
            msg.sender,
            payable(address(0)),
            0,
            _royaltyFee
        );

        // Trigger an event
        emit SongCreated(
            songCount,
            _title,
            _subtitle,
            _musicHash,
            _imageHash,
            msg.sender,
            payable(address(0)),
            _royaltyFee
        );

        // Increment song id
        songCount++;
    }

    function listSong(uint256 _tokenId, uint256 _price) external payable {
        require(_price > 0, 'Price must be greater than zero');
        songs[_tokenId].price = _price;
        songs[_tokenId].seller = payable(msg.sender);

        _transfer(msg.sender, address(this), _tokenId);
        emit SongReListed(
            _tokenId,
            songs[_tokenId].seller,
            songs[_tokenId].price
        );
    }

    function buySong(uint256 _tokenId) external payable {
        uint256 price = songs[_tokenId].price;
        uint256 royaltyFee = songs[_tokenId].royaltyFee;
        address seller = songs[_tokenId].seller;

        require(
            msg.value == price + royaltyFee,
            'Please send the asking price in order to complete the purchase'
        );

        payable(songs[_tokenId].artist).transfer(royaltyFee);
        payable(seller).transfer(price);
        _transfer(address(this), msg.sender, _tokenId);
        songs[_tokenId].seller = payable(address(0));

        emit BuySong(_tokenId, songs[_tokenId].seller, msg.sender, price);
    }

    function getAllListedSongs() external view returns (Song[] memory) {
        uint256 listedCount = balanceOf(address(this));
        Song[] memory tokens = new Song[](listedCount);
        uint256 currentIndex;
        for (uint256 i = 0; i < songCount; i++) {
            if (songs[i].seller != address(0)) {
                tokens[currentIndex] = songs[i];
                currentIndex++;
            }
        }

        return tokens;
    }

    function getOwnedSongs() external view returns (Song[] memory) {
        uint256 ownedCount = balanceOf(msg.sender);
        Song[] memory tokens = new Song[](ownedCount);
        uint256 currentIndex;
        for (uint256 i = 0; i < songCount; i++) {
            if (ownerOf(i) == msg.sender) {
                tokens[currentIndex] = songs[i];
                currentIndex++;
            }
        }

        return tokens;
    }
}
