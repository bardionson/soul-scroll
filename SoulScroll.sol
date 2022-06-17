// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils//Base64.sol";

// @author: Bård Ionson
// @website: bardIonson.com

contract Prayer is ERC721, ERC721URIStorage, ERC721Burnable, ERC721Royalty, Ownable {
    using Counters for Counters.Counter;
    uint256 public mintPrice;
    uint256 public initPrice;
    uint8 public prayersUsed;
    uint8 public prayersLoaded;
    mapping(address => bool) allowedAddresses;
    mapping(address => bool) initiatedAddresses;
    address[] public initAddressList;
    bool public paused;

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
    constructor() ERC721("Soul Scroll 6", "SOUL6") {
        _setDefaultRoyalty(msg.sender ,1000);
        mintPrice = 1000000000000000; //0.001 eth $2 - opti
        initPrice = 10000000000000000; //0.1 eth $20 - opti
        //init eth: 1000000000000000000 1 eth $2000 
        //mint eth: 10000000000000000 .01 eth $20
        addSonOfJacob(msg.sender);
        initiatedAddresses[msg.sender] = true;
        createPrayer("Health", "Lord master, I ask that you fulfil your promise to me by", "restoring me to health and healing my wounds.", "amen");
        createPrayer("Birth", "Give us a quiverfull of children and subdue the earth with","your power o great warrior Father","amen");
    }

    modifier isAllowedToPray(address _address) {
        require(allowedAddresses[_address], "You need to be listed for the Initiation");
        _;
    }

    function setPaused(bool _paused) public onlyOwner {
        paused = _paused;
    }

    function sizeInitList() public view returns (uint) {
        return initAddressList.length;
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
        initAddressList.push(_addressToAllowlist);
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
  
    function sonCreatePrayer(string memory prayerType, string memory prayer, string memory prayer2, string memory prayer3)
        public isInitiated(msg.sender) {
            // limit to 58 char
            require(sLen(prayerType) <= 14, "Type 14 char limit");
            require(sLen(prayer) <= 58 && sLen(prayer2) <= 58  && sLen(prayer3) <= 58 , "Line 58 char limit.");
            createPrayer(prayerType, prayer, prayer2, prayer3);
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
    }

    function createPrayer(string memory prayerType, string memory prayer, string memory prayer2, string memory prayer3) internal {
        prayers[prayersLoaded].prayerType = prayerType;
        prayers[prayersLoaded].text = prayer;
        prayers[prayersLoaded].text2 = prayer2;
        prayers[prayersLoaded].text3 = prayer3;
        prayers[prayersLoaded].sonOfJacob = payable(msg.sender);
        prayersLoaded++;
    }

        /* Converts an SVG to Base64 string */
    function svgToImageURI(string memory svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(svg));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    /* Generates a tokenURI using Base64 string as the image */
    function formatTokenURI(string memory imageURI, string memory pType, string memory prayer, string memory _numReadings)
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
                                '{"name": "Soul Scroll 5", "description": "', 
                                prayer ,'", "image":"',
                                imageURI,
                                '","attributes": [{"trait_type": "Number Of Prayers", "value":', _numReadings,'},{"trait_type": "PrayerType","value":"',pType,'"}]}'
                            )
                        )
                    )
                )
            );
    }
    
    function appendString(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e, string memory _f, string memory _g, string memory _h, string memory _j) internal pure returns (string memory)  {
        return string(abi.encodePacked(_a, _b, _c, _d, _e, _f, _g, _h, _j));
    }

    function orderPrayer(address _to, uint8 _numReadings) public payable 
        returns (string memory) 
    {
        uint m;
        if (_numReadings==0) {m = 1;} else {m=_numReadings;}
        require(paused == false, "Soul Scroll is Paused, please ask your handmaid to pray");
        require(msg.value >= mintPrice*m, "Not enough ETH sent; check price!");
        require(prayersUsed < prayersLoaded, "Prayers are empty, please wait for the Sons of Gilead to write more.");
        require(_numReadings < 78, "Only 77 max prayers per order");
        ThePrayer memory oneP = prayers[prayersUsed];
        prayersUsed++;
        string memory t = oneP.prayerType;
        string memory p1= oneP.text;
        string memory p2= oneP.text2;
        string memory p3= oneP.text3;
        string memory numReadings = Strings.toString(_numReadings);
        string memory theFirstObj = appendString("<svg viewBox='0 0 150 100' xmlns='http://www.w3.org/2000/svg'><style> .small { font: italic 5px sans-serif; } .med { font: italic 4px sans-serif; } .red { font: italic 20px serif; fill: red; } </style> <rect height='240' width='140' y='0' x='0' fill='lightblue'> </rect><text x='5' y='18' class='red'>", t, "</text> <text x='5' y='40' class='small'>",p1,"</text><text x='5' y='48' class='small'>",p2,"</text><text x='5' y='56' class='small'>",p3,"</text>");
        string memory theObj = string(abi.encodePacked(theFirstObj,"<text x='20' y='64' class='med'>",numReadings,"x</text></svg>"));
        string memory imageURI = svgToImageURI(theObj);
        string memory uri = formatTokenURI(imageURI, t, string(abi.encodePacked(p1, " ", p2, " ", p3)), numReadings);

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, uri);
        
        uint256 commanderFee = msg.value/4;
        uint256 prayerPayment = msg.value - commanderFee;

        payable(owner()).transfer(commanderFee);
        oneP.sonOfJacob.transfer(prayerPayment);

        return theObj;
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
