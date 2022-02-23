// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.4.1 (finance/VestingWallet.sol)
pragma solidity ^0.8.0;

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

    function transfer(address _to, uint256 _amount) external returns (bool);
}

contract SBTERC223Vesting is Context, Ownable {
    using SafeMath for uint256;

    event ERC223Released(address indexed token, uint256 amount);

    uint256 private _totalReleased;

    mapping(address => mapping(address => uint256)) private _erc223Released;

    struct VestingSchedule {
        address beneficiary;
        uint256 amountTotal;
        uint256 amountReleased;
    }

    IVSBTERC223 private immutable _token;

    uint256 private immutable _duration;
    uint256 public immutable _vesting_start_time;

    address private immutable _team_address;
    address private immutable _founder_wallet;
    address private immutable _advisor_address;
    address private immutable _token_contract_address;

    mapping(bytes32 => VestingSchedule) private vestingSchedules;

    constructor(
        uint256 vesting_start_time,
        address founder_wallet,
        address advisor_address,
        address team_address,
        address token_contract_address
    ) {
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
        _duration = 600;
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

    function released() public view returns (uint256) {
        return _totalReleased;
    }

    function released(address beneficiary) public view returns (uint256) {
        return _erc223Released[_token_contract_address][beneficiary];
    }

    function release(address beneficiary) public onlyOwner {
        uint256 releasable = vestedAmount(
            beneficiary,
            uint64(block.timestamp)
        ) - released(beneficiary);
        _erc223Released[_token_contract_address][beneficiary] += releasable;
        _totalReleased += releasable;
        emit ERC223Released(_token_contract_address, releasable);
        _token.transfer(beneficiary, releasable);
    }

    function createVestingSchedule(address beneficiary, uint256 tokens)
        public
        onlyOwner
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
        vestingSchedules[vestingScheduleId] = vestingSchedule;
    }

    function vestedAmount(address beneficiary, uint64 timestamp)
        internal
        view
        returns (uint256)
    {
        return
            _vestingSchedule(
                _token.balanceOf(address(this)) + released(beneficiary),
                timestamp
            );
    }

    function _vestingSchedule(uint256 totalAllocation, uint64 timestamp)
        internal
        view
        returns (uint256)
    {
        if (timestamp < start()) {
            return 0;
        } else if (timestamp > start() + duration()) {
            return totalAllocation;
        } else {
            return (totalAllocation * (timestamp - start())) / duration();
        }
    }

    function withdraw(address beneficiary, uint256 amount) public onlyOwner {
        uint256 releasable = vestedAmount(
            beneficiary,
            uint64(block.timestamp)
        ) - released(beneficiary);
        require(releasable >= amount, "Not enough withdrawable funds");
        _token.transferFrom(beneficiary, owner(), amount);
    }
}
