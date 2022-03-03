// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (finance/VestingWallet.sol)
pragma solidity ^0.8.0;

import "./SBTERC223Recipient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IVSBTERC223 {
    function balanceOf(address _account) external view returns (uint256);

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns (bool);
}

contract SBTERC223Vesting is Context, Ownable, SBTERC223Recipient {
    using SafeMath for uint256;

    event ERC223Released(address indexed token, uint256 amount);

    IVSBTERC223 private immutable _token;

    uint256 private immutable _duration;
    uint256 public immutable _vesting_start_time;

    address private immutable _team_address;
    address private immutable _founder_wallet;
    address private immutable _advisor_address;
    address private immutable _token_contract_address;

    struct VestingSchedule {
        uint256 vestingTime;
        uint256 amountTotal;
        uint256 amountReleased;
        address beneficiary;
    }

    mapping(address => uint256) private _erc223Released;
    mapping(address => uint256) private _erc223Withdrawn;
    mapping(bytes32 => VestingSchedule) private vestingSchedules;

    constructor(
        uint256 vesting_start_time,
        address founder_wallet,
        address advisor_address,
        address team_address,
        address token_contract_address
    ) {
        require(vesting_start_time > 0, "Invalid start time");
        require(
            founder_wallet != address(0),
            "Provided Founder wallet is zero address"
        );
        require(
            advisor_address != address(0),
            "Provider Advisor wallet is zero address"
        );
        require(
            team_address != address(0),
            "Provided Team wallet is zero address"
        );
        require(
            token_contract_address != address(0),
            "Provided Token contract address is zero address"
        );
        require(
            Address.isContract(token_contract_address),
            "Provided Token contract address is not a smart contract address"
        );
        _vesting_start_time = vesting_start_time;
        _duration = 2 minutes;
        _founder_wallet = founder_wallet;
        _advisor_address = advisor_address;
        _team_address = team_address;
        _token_contract_address = token_contract_address;
        _token = IVSBTERC223(token_contract_address);
    }

    receive() external payable {}

    function start() public view returns (uint256) {
        return _vesting_start_time;
    }

    function duration() public view returns (uint256) {
        return _duration;
    }

    function released(address beneficiary) public view returns (uint256) {
        return _erc223Released[beneficiary];
    }

    function createVestingSchedule(address beneficiary, uint256 tokens)
        public
        onlyOwner
        returns (bool)
    {
        require(
            beneficiary != address(0),
            "Provided beneficiary wallet is zero address"
        );
        require(
            beneficiary == _founder_wallet ||
                beneficiary == _advisor_address ||
                beneficiary == _team_address,
            "Provided beneficiary wallet is unregistered address"
        );
        bytes32 vestingScheduleId = keccak256(abi.encodePacked(beneficiary));
        VestingSchedule memory vestingSchedule = vestingSchedules[
            vestingScheduleId
        ];
        vestingSchedule.beneficiary = beneficiary;
        vestingSchedule.amountTotal = tokens;
        vestingSchedule.amountReleased = 0;
        vestingSchedule.vestingTime = block.timestamp;
        vestingSchedules[vestingScheduleId] = vestingSchedule;
        _token.transferFrom(owner(), address(this), tokens);
        return true;
    }

    function release(address beneficiary) public onlyOwner returns (bool) {
        bytes32 vestingScheduleId = keccak256(abi.encodePacked(beneficiary));
        VestingSchedule memory schedule = vestingSchedules[vestingScheduleId];
        uint256 releasable = _vestingSchedule(
            schedule.vestingTime,
            schedule.amountTotal
        ) - schedule.amountReleased;
        if (releasable > 0) {
            _token.transferFrom(address(this), beneficiary, releasable);
            schedule.amountReleased += releasable;
            vestingSchedules[vestingScheduleId] = schedule;
            _erc223Released[beneficiary] += releasable;
            emit ERC223Released(_token_contract_address, releasable);
            return true;
        }
        return false;
    }

    function _vestingSchedule(uint256 vestingTime, uint256 amountTotal)
        internal
        view
        returns (uint256)
    {
        uint256 timestamp = block.timestamp;
        uint256 releasableTime = vestingTime + _duration;
        uint256 timeElapsed = timestamp - vestingTime;
        if (timestamp < vestingTime) {
            return 0;
        } else if (timestamp > releasableTime) {
            return amountTotal;
        } else {
            return (amountTotal * timeElapsed) / _duration;
        }
    }

    function withdraw(address beneficiary, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        uint256 releasable = released(beneficiary) -
            _erc223Withdrawn[beneficiary];
        require(releasable >= amount, "Not enough withdrawable funds");
        _token.transferFrom(beneficiary, owner(), amount);
        _erc223Withdrawn[beneficiary] += amount;
        return true;
    }
}
