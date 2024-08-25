// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// openzeppelin에서 제공하는 ERC20 형태를 상속받음
// 또한 Ownable 기능 또한 상속받아서 사용함
contract YEOMIN42TOKEN is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("YEOMIN42TOKEN", "YM42TKN")
        Ownable(initialOwner) payable
    {
        // 토큰을 발행하는 함수
        // 최초 소유자의 이름으로 1ETH 만큼 발행
        _mint(initialOwner, 10 ** (18 + decimals()));
    }

    // 소유권을 다른 새로운 유저에게 넘기는 기능을 하는 함수
    // 소유권자만 이 함수를 호출할 수 있음
    function transferOwnership(address newOwner) public virtual override onlyOwner {
       super.transferOwnership(newOwner);
    }
}
