// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IERC223.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ISBTERC223Recipient {
    function tokenReceived(
        address _from,
        uint256 _value,
        bytes memory data
    ) external;
}

contract SBTERC223 is IERC223, Context, Ownable {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balances;

    // constructor(
    //     uint256 totalSupply_,
    //     string memory name_,
    //     string memory symbol_,
    //     uint8 decimals_
    // ) {
    //     _name = name_;
    //     _symbol = symbol_;
    //     _decimals = decimals_;
    //     mint(msg.sender, totalSupply_);
    // }

    constructor() {
        _name = "SBTERC223";
        _symbol = "SBT";
        _decimals = 18;
        mint(owner(), 400000000);
    }

    function standard() public pure override returns (string memory) {
        return "erc223";
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view override returns (uint256) {
        return _balances[_owner];
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        bytes memory _empty = hex"00000000";
        address from = _msgSender();
        return transferFrom(from, to, amount, _empty);
    }

    function transfer(
        address to,
        uint256 amount,
        bytes memory _data
    ) public override returns (bool) {
        address from = _msgSender();
        return transferFrom(from, to, amount, _data);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        bytes memory _empty = hex"00000000";
        return transferFrom(from, to, amount, _empty);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount,
        bytes memory _data
    ) public returns (bool) {
        require(from != address(0), "ERC223: transfer from the zero address");
        require(to != address(0), "ERC223: transfer to the zero address");
        require(amount > 0, "ERC223: transfer amount is less or zero");
        uint256 fromBalance = _balances[from];
        require(
            fromBalance >= amount,
            "ERC223: transfer amount exceeds balance"
        );
        unchecked {
            _balances[from] = fromBalance - amount;
        }
        _balances[to] += amount;
        if (Address.isContract(to)) {
            ISBTERC223Recipient(to).tokenReceived(from, amount, _data);
        }
        emit Transfer(from, to, amount);
        bytes memory _empty = hex"00000000";
        if (_data.length != _empty.length) {
            emit TransferData(_data);
        }
        return true;
    }

    function mint(address account, uint256 amount)
        public
        onlyOwner
        returns (bool)
    {
        require(account != address(0), "ERC223: minting to the zero address");
        require(amount > 0, "ERC223: minting amount is less or zero");
        _totalSupply += amount;
        _balances[account] += amount;
        return true;
    }
}
