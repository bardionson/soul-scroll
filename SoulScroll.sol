// SPDX-License-Identifier: MIT
// solhint-disable-next-line
pragma solidity ^0.8.17;


import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/utils/Counters.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/utils/Base64.sol";


// @author: Bård Ionson
// @website: bardIonson.com

contract Prayer is ERC721, ERC721URIStorage, ERC721Burnable, ERC721Royalty, Ownable {
    using Counters for Counters.Counter;
    uint256 public mintPrice;
    uint256 public initPrice;
    uint8 public prayersUsed;
    uint8 public prayersLoaded;
    uint8 public maxOrder;
    mapping(address => bool) public allowedAddresses;
    mapping(address => bool) public initiatedAddresses;

    //PrayerType {Health, Wealth, Birth, Death, Sin, Ofred}

    struct ThePrayer {
        string prayerType;
        string text;
        string text2;
        string text3;
        address payable sonOfJacob;
    }
    mapping(uint256 => ThePrayer) public prayers;

    Counters.Counter private _tokenIdCounter;
    constructor() ERC721("Soul Scroll 3", "SOUL3")  {
        _setDefaultRoyalty(msg.sender ,1000);
        mintPrice = 1000000000000000; //0.001 eth $2 - opti
        initPrice = 10000000000000000; //0.01 eth $20 - opti
        //final mint price 10000000000000000 - 0.01 
        // final init price 100000000000000000. 0.1
        //init eth: 1000000000000000000 1 eth $2000 
        //mint eth: 10000000000000000 .01 eth $20
        maxOrder = 10;
        addSonOfJacob(msg.sender);
        initiatedAddresses[msg.sender] = true;
        createPrayer("Health", "Lord master, I ask that you fulfil your promise to me by", "restoring me to health and healing my wounds.", "Bard", msg.sender);
        createPrayer("Birth", "Give us a quiverfull of children and subdue the earth with","your power o great warrior Father", "Bard", msg.sender);
        createPrayer("Wealth", "God make Gilead Great Again and Again","to subdue the earth", "Bard", msg.sender);
    }

    modifier isAllowedToPray(address _address) {
        require(allowedAddresses[_address], "You need to be listed for the Initiation");
        _;
    }


    function addSonOfJacob(address _addressToAllowlist) public onlyOwner {
        allowedAddresses[_addressToAllowlist] = true;
    }

    function verifySonOfJacob(address _allowedAddress) public view returns(bool) {
        bool sonCanPray = allowedAddresses[_allowedAddress];
        return sonCanPray;
    }

    modifier isInitiated(address _address) {
        require(initiatedAddresses[_address], "You need pay the initiation dues");
        _;
    }

    function excommunicate(address _addressToRemove) public onlyOwner {
        initiatedAddresses[_addressToRemove] = false;
        allowedAddresses[_addressToRemove] = false;
    }

    function payInitiation(address _addressToAllowlist) public payable isAllowedToPray(msg.sender) {
        require(msg.value >= initPrice, "Not enough ETH sent; check price!");
        initiatedAddresses[_addressToAllowlist] = true;
        payable(owner()).transfer(msg.value);
    }

    function verifyIntitiation(address _allowedAddress) public view returns(bool) {
        bool sonCanPray = initiatedAddresses[_allowedAddress];
        return sonCanPray;
    }

    function setMintPrice(uint256 _newPrice) public onlyOwner {
        mintPrice = _newPrice;
    }

    function setInitPrice(uint256 _newPrice) public onlyOwner {
        initPrice = _newPrice;
    }

    function setMaxOrder(uint8 _newMaxOrder) public onlyOwner {
        maxOrder = _newMaxOrder;
    }
  
    function sonCreatePrayer(string memory _prayerType, string memory _prayer, string memory _prayer2, string memory _prayer3, address _author)
        public isInitiated(msg.sender) {
            if (_author == address(0))
                _author = msg.sender;
            // limit to 58 char
            require(sLen(_prayerType) <= 14, "Type 14 character limit");
            require(sLen(_prayer) <= 58 && sLen(_prayer2) <= 58  && sLen(_prayer3) <= 58 , "Line 58 character limit.");
            createPrayer(_prayerType, _prayer, _prayer2, _prayer3, _author);
    }

    function sLen(string memory s) internal pure returns (uint length) {
        uint i=0;
        bytes memory stringRep = bytes(s);

        while (i<stringRep.length)
            {
                if (stringRep[i]>>7==0)
                    i+=1;
                else if (stringRep[i]>>5==bytes1(uint8(0x6)))
                    i+=2;
                else if (stringRep[i]>>4==bytes1(uint8(0xE)))
                    i+=3;
                else if (stringRep[i]>>3==bytes1(uint8(0x1E)))
                    i+=4;
                else
                    //For safety
                    i+=1;

                length++;
            }
        return length;
    }

    function createPrayer(string memory _prayerType, string memory _prayer1, string memory _prayer2, string memory _prayer3, address _author) internal {
        prayers[prayersLoaded].prayerType = _prayerType;
        prayers[prayersLoaded].text = _prayer1;
        prayers[prayersLoaded].text2 = _prayer2;
        prayers[prayersLoaded].text3 = _prayer3;
        prayers[prayersLoaded].sonOfJacob = payable(_author);
        prayersLoaded++;
    }

        /* Converts an SVG to Base64 string */
    function svgToImageURI(string memory svg)
        internal
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    /* Generates a tokenURI using Base64 string as the image */
    function formatTokenURI(string memory imageURI, string memory pType, string memory author, string memory prayer, string memory _numReadings)
        public
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "Soul Scroll", "description": "', 
                                prayer ,'", "image":"',
                                imageURI,
                                '","attributes": [{"trait_type": "Number Of Prayers", "value":', _numReadings,'},{"trait_type": "PrayerType","value":"',pType,'"},{"trait_type": "Author","value":"',author,'"}]}'
                            )
                        )
                    )
                )
            );
    }
    
    function appendString(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e, string memory _f, string memory _g, string memory _h, string memory _j) internal pure returns (string memory)  {
        return string(abi.encodePacked(_a, _b, _c, _d, _e, _f, _g, _h, _j));
    }

       // Fallback function is called when msg.data is not empty
    receive() external payable {
        require(msg.value >= mintPrice, "Not enough ETH sent; check price!");
        uint8 readings = uint8(msg.value / mintPrice);
        orderPrayer(msg.sender, readings);
    }

    fallback() external payable {
        require(msg.value >= mintPrice, "Not enough ETH sent; check price!");
        orderPrayer(msg.sender, 1);
    }

    function orderPrayer(address _to, uint8 _numReadings) public payable {
        uint m;
        // for gas savings set deault readings to 5 
        if (_numReadings < 5) {m = 5;} else {m=_numReadings;}
        require(msg.value >= mintPrice*m, "Not enough ETH sent; check price!");
        require(prayersUsed < prayersLoaded, "Prayers are empty, please wait for the Sons of Gilead to write more.");
        require(_numReadings <= maxOrder, "Order too large.");
        ThePrayer memory onePrayer = prayers[prayersUsed];
        prayersUsed++;
        string memory t = onePrayer.prayerType;
        string memory p1= onePrayer.text;
        string memory p2= onePrayer.text2;
        string memory p3= onePrayer.text3;
        string memory numReadings = Strings.toString(_numReadings);
        string memory theFirstObj = appendString("<svg viewBox='0 0 150 100' xmlns='http://www.w3.org/2000/svg'><style> .small { font: italic 5px sans-serif; } .med { font: italic 4px sans-serif; } .red { font: italic 20px serif; fill: red; } </style> <rect height='100' width='150' y='0' x='0' fill='lightblue'> </rect><text x='5' y='18' class='red'>", t, "</text> <text x='5' y='40' class='small'>",p1,"</text><text x='5' y='48' class='small'>",p2,"</text><text x='5' y='56' class='small'>",p3,"</text>");
        string memory theObj = string(abi.encodePacked(theFirstObj,"<text x='20' y='64' class='med'>",numReadings,"x</text></svg>"));
        string memory imageURI = svgToImageURI(theObj);
        string memory uri = formatTokenURI(imageURI, t, p3, string(abi.encodePacked(p1, " ", p2, " ", p3)), numReadings);

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // if the prayer author is the same as the contract owner do not split payment
        if (onePrayer.sonOfJacob != owner()) {
            uint256 commanderFee = msg.value/4;
            uint256 prayerPayment = msg.value - commanderFee;

            payable(owner()).transfer(commanderFee);
            onePrayer.sonOfJacob.transfer(prayerPayment);
        } else {
            payable(owner()).transfer(msg.value);
        }
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage, ERC721Royalty) {
        super._burn(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721Royalty) 
        returns(bool) 
        {
            return super.supportsInterface(interfaceId);
        }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function transferOwership(address _theAddress) public onlyOwner {
       super.transferOwnership(_theAddress);
    }
}

