// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TEST42TOKEN {
    uint256 public i;

    constructor() payable {}

    // 임시 메소드
    function callMe(uint256 j) public {
        i += j;
    }

    // 외부에서 함수를 호출하기 위한 function signature 값을 얻을 수 있음
    function getData(uint _num) public pure returns (bytes memory) {
        return abi.encodeWithSignature("callMe(uint256)", _num);
    }
}