// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Vesting.sol";

/**
 * @title VestingManager
 * @dev This contract handles the creation of Vestings and keep tracks of Vesting Ids.
 *  https://goerli.etherscan.io/address/0xB2797B2EeA8c19B301A90Ee0C4D6bCEe41941837#code
 /
contract VestingManager{
    
    address private immutable owner;
    address [] private _vestingIds;
    mapping(address => address[]) private _userVestingIds;
    
    constructor(){
        owner = msg.sender;
    }

    /**
     * @dev function to start Vesting.
     */
    function vest(address[] memory beneficiaryAddresses) public returns(address){
        
        Vesting _vesting = new Vesting(beneficiaryAddresses); //conditions already placed in Vesting, no need to check here.
        _vestingIds.push(address(_vesting));

        //add vesting ids to user, to track later
        for(uint i = 0; i < beneficiaryAddresses.length;i++){
            _userVestingIds[beneficiaryAddresses[i]].push(address(_vesting));
        }
        return address(_vesting);
    }

    /**
     * @dev Getter for vesting IDs.
     */
    function vestingIds() public view returns(address [] memory){
        return _vestingIds;
    }

    /**
     * @dev Getter for specific user's vesting IDs.
     */
    function userVestingIds(address user) public view returns(address [] memory){
        return _userVestingIds[user];
    }
}