// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract MULTISIG42 {
    // 컨트랙트에 이더가 송금될 때 발생
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    // 새로운 트랜잭션이 제출될 때 발생
    event SubmitTransaction(
        address indexed owner,
        uint256 indexed txIndex,
        address indexed to,
        uint256 value,
        bytes data
    );
    // 트랜잭션에 대해서 confirm할 때 발생
    event ConfirmTransaction(address indexed owner, uint256 indexed txIndex);
    // 트랜잭션에 대한 confirm을 취소할 때 발생
    event RevokeConfirmation(address indexed owner, uint256 indexed txIndex);
    // 트랜잭션이 실행될 때 발생
    event ExecuteTransaction(address indexed owner, uint256 indexed txIndex);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public numConfirmationsRequired;

    struct Transaction {
        // 트랜잭션을 수신할 address
        address to;
        // 전송할 값
        uint256 value;
        // 트랜잭션 데이터 => (호출할 함수 function signature)
        bytes data;
        // 해당 트랜잭션 실행 여부
        bool executed;
        // 트랜잭션을 실행시키기 위해 검증된 address count
        uint256 numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    // 생성자 함수에서 컨트랙트 실행 인자 (_owners)를 통해 isOwner mapping 변수에 저장
    // msg.sender가 Owner인지 확인하는 기능
    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    // txIndex는 transactions 길이보다 작아야 존재한다.
    modifier txExists(uint256 _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    // transaction 객체의 executed (boolean) 값을 통해 실행되지 않았음을 확인
    modifier notExecuted(uint256 _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    // mapping(uint => mapping(address => bool)) isConfirmed 상태 변수는
    // txIndex값에 해당하는 address가 Confirm 여부를 저장한다.
    modifier notConfirmed(uint256 _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    // 생성자는 소유자의 지갑주소 배열인 _owners와 
    // 몇 명의 서명이 필요한지 확인하는 _numConfirmationsRequired를 인자로 가진다.
    constructor(address[] memory _owners, uint256 _numConfirmationsRequired) payable {
        // 소유자 배열 값이 존재하는지 확인하는 부분
        require(_owners.length > 0, "owners required");
        // 인자가 유효한지 확인하는 부분
        require(
            _numConfirmationsRequired > 0
                && _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        // owners 배열에 소유자의 지갑주소를 넣고 소유자 검사를 하기 위한
        // isOwner map에도 대입해준다.
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    // 이더리움을 전송할 때 호출 되는 함수
    // 이를 통해 계약에 이더가 입금되었음을 외부에 알릴 수 있음
    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    // 인자를 통해서 트랜잭션을 생성시키고, transaction 배열에 추가해주는 기능
    // 보내고자하는 지갑 주소와 보낼 양, 그리고 테스트토큰으로부터 얻은 function Signature을 인자로 받음
    function submitTransaction(address _to, uint256 _value, bytes memory _data)
        public
        onlyOwner
    {
        uint256 txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _data);
    }

    // Transaction에 대해서 Confirm해주는 함수
    // Transaction의 txIndex값을 인자로 받아 해당하는 트랜잭션에 대해서
    // numConfrimations 값을 1 증가시키고
    // 트랜잭션을 검증했다는 isConfirmed값을 true로 바꿔주는 기능
    function confirmTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
        notConfirmed(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }


    // numConfirmationsRequired 횟수가 충족된 Transaction을 실행시키는 기능
    // Transaction의 txIndex값을 인자로 받아 해당하는 트랜잭션에 대해서
    // numConfrimations가 numConfirmationsRequired 이상만큼 받았으면
    // call 함수를 통해 트랜잭션을 실행함
    function executeTransaction(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );

        transaction.executed = true;

        (bool success,) =
            transaction.to.call{value: transaction.value}(transaction.data);
        require(success, "tx failed");

        emit ExecuteTransaction(msg.sender, _txIndex);
    }

    // Transaction에 Confirm을 취소하는 기능
    // Transaction의 txIndex값을 인자로 받아 해당하는 트랜잭션에 대해서
    // 이미 confirm한 것을 철회하는 기능 
    function revokeConfirmation(uint256 _txIndex)
        public
        onlyOwner
        txExists(_txIndex)
        notExecuted(_txIndex)
    {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 _txIndex)
        public
        view
        returns (
            address to,
            uint256 value,
            bytes memory data,
            bool executed,
            uint256 numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }
}