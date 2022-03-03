// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./IERC223Recipient.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IRSBTERC223 {
    function transfer(
        address _to,
        uint256 _amount,
        bytes calldata _data
    ) external returns (bool);
}

contract SBTERC223Recipient is IERC223Recipient, Ownable {
    mapping(address => mapping(address => ERC223TransferInfo))
        public _transferHistory;
    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public _balancesSender;

    function tokenBalance(address _contractAddress)
        public
        view
        returns (uint256)
    {
        return _balances[_contractAddress];
    }

    function tokenBalanceSender(address _contractAddress, address _sender)
        public
        view
        returns (uint256)
    {
        return _balancesSender[_contractAddress][_sender];
    }

    function transferHistory(address _contractAddress, address _sender)
        public
        view
        returns (ERC223TransferInfo memory)
    {
        return _transferHistory[_contractAddress][_sender];
    }

    function tokenReceived(
        address _from,
        uint256 _value,
        bytes memory _data
    ) external override {
        require(
            Address.isContract(msg.sender),
            "Not an ERC223 Contract Address"
        );
        ERC223TransferInfo memory tkn = _transferHistory[msg.sender][_from];
        tkn.data = _data;
        tkn.sender = _from;
        tkn.value += _value;
        tkn.token_contract = msg.sender;
        _transferHistory[msg.sender][_from] = tkn;
        _balances[msg.sender] += _value;
        _balancesSender[msg.sender][_from] += _value;
    }

    function transfer(
        address _contractAddress,
        address _sender,
        uint256 amount,
        bytes calldata data
    ) public onlyOwner returns (bool) {
        require(
            _contractAddress != address(0),
            "ERC223Recipient: transfer from the zero address"
        );
        require(
            Address.isContract(_contractAddress),
            "Not an ERC223 Contract Address"
        );
        require(
            _sender != address(0),
            "ERC223Recipient: transfer to the zero address"
        );
        require(amount > 0, "ERC223Recipient: transfer amount is less or zero");
        uint256 initBalance = _balances[_contractAddress];
        uint256 initBalanceSender = _balancesSender[_contractAddress][_sender];
        require(
            initBalance >= amount && initBalanceSender >= amount,
            "ERC223Recipient: transfer amount exceeds balance"
        );
        unchecked {
            _balances[_contractAddress] -= amount;
            _balancesSender[_contractAddress][_sender] -= amount;
            ERC223TransferInfo memory tkn = _transferHistory[_contractAddress][
                _sender
            ];
            tkn.value -= amount;
            _transferHistory[_contractAddress][_sender] = tkn;
        }
        IRSBTERC223(_contractAddress).transfer(_sender, amount, data);
        return true;
    }
}
