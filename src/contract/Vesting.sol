// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (finance/VestingWallet.sol)
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title XYZToken
 * @dev ERC20 token that will be vested. 100 million tokens are minted to the deployer on deploying.
 */
contract XYZToken is ERC20 {
    constructor() ERC20("XYZToken", "XYZ") {
        _mint(msg.sender,100000000*(10**18)); // 100 million
    }
}
/**
 * @title VestingWallet
 * @dev This contract handles the vesting of Eth and ERC20 tokens for a given beneficiary. Custody of multiple tokens
 * can be given to this contract, which will release the token to the beneficiary following a given vesting schedule.
 * The vesting schedule is customizable through the {vestedAmount} function.
 *
 * Any token transferred to this contract will follow the vesting schedule as if they were locked from the beginning.
 * Consequently, if the vesting has already started, any amount of tokens sent to this contract will (at least partly)
 * be immediately releasable.
 */
contract Vesting is Context {
    using SafeMath for uint256;
    event ERC20Released(address indexed token, uint256 amount);

    XYZToken private immutable _token;
    uint256 private _released;
    uint256 private _totalAllocation;
    uint256 private immutable _start;
    uint256 private immutable _duration;
    mapping(address => uint256) private _erc20Released;
    mapping(address => bool) private _isBeneficiary;
    address private _beneficiary;
    address[] private _beneficiaries;

    /**
     * @dev Set the beneficiary, start timestamp and vesting duration of the vesting wallet.
     */
    constructor(address[] memory beneficiaryAddresses) {
        require(
            beneficiaryAddresses.length != 0,
            "There must be atleast one beneficiary."
        );
        require(
            beneficiaryAddresses.length <= 12,
            "There can be maximum 12 beneficiaries."
        );
        //small finite loop, so its efficient
        for (uint256 i = 0; i < beneficiaryAddresses.length; i++) {
            require(
                beneficiaryAddresses[i] != address(0),
                "Beneficiary address cannot be zero."
            );
            require(
                _isBeneficiary[beneficiaryAddresses[i]] ==false ,
                "Same account cannot be added twice."
            );
            _isBeneficiary[beneficiaryAddresses[i]] = true;
        }
        _token = new XYZToken();
        _totalAllocation = 100000000*(10**18); // 100 million 
        _beneficiaries = beneficiaryAddresses;
        _start = block.timestamp;
        _duration = 12 * 30 * 24 * 60 * 60; // 12 months in seconds

    }
    
    /**
     * @dev Getter for the ERC20 token address.
     */
    function token() public view virtual returns (address) {
        return  address(_token);
    }

   /**
     * @dev Getter for the beneficiary address.
     */
    function isBeneficiary(address _address)
        public
        view
        virtual
        returns (bool)
    {
        return _isBeneficiary[_address];
    } 

   /**
     * @dev Getter for the beneficiaries.
     */
    function beneficiaries()
        public
        view
        virtual
        returns (address [] memory)
    {
        return _beneficiaries;
    } 

   /**
     * @dev Getter for the total number of beneficiaries.
     */
    function beneficiaryCount()
        public
        view
        virtual
        returns (uint)
    {
        return _beneficiaries.length;
    } 

    /**
     * @dev Getter for the start timestamp.
     */
    function start() public view virtual returns (uint256) {
        return _start;
    }

    /**
     * @dev Getter for the vesting duration.
     */
    function duration() public view virtual returns (uint256) {
        return _duration;
    }

    /**
     * @dev Total amount of tokens
     */
    function totalAllocation() public view virtual returns (uint256) {
        return _totalAllocation;
    }
    /**
     * @dev Amount of token already released
     */
    function released() public view virtual returns (uint256) {
        return _erc20Released[token()];
    }

    /**
     * @dev Release the tokens that have already vested.
     *
     * Emits a {ERC20Released} event.
     */
    function release() public virtual {
        uint256 releasable = vestedAmount(block.timestamp) - released().div(_beneficiaries.length);
        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            _erc20Released[token()] += releasable;
            emit ERC20Released(token(), releasable);
            SafeERC20.safeTransfer(IERC20(token()), _beneficiaries[i], releasable);
        }

    }

    /**
     * @dev Calculates the amount of tokens that has already vested. Default implementation is a linear vesting curve.
     */
    function vestedAmount( uint256 timestamp)
        public
        view
        virtual
        returns (uint256)
    {
        return
            _vestingSchedule(
                timestamp
            );
    }

    /**
     * @dev Virtual implementation of the vesting formula. This returns the amount vested, as a function of time, for
     * an asset given its total historical allocation.
     */
    function _vestingSchedule( uint256 timestamp)
        internal
        view
        virtual
        returns (uint256)
    {
        if (timestamp < start()) {
            return 0;
        } else if (timestamp > start() + duration()) {
            return totalAllocation().div(_beneficiaries.length);
        } else {
            return ((totalAllocation().div(duration())).mul(60)*((timestamp - start()).div(60))).div(_beneficiaries.length) ;
        }
    }
}
