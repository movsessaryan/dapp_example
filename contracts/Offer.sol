pragma solidity ^0.4.4;

contract Offer {
    uint public creationTimestamp ;
    uint public expirationTimestamp;
    string public resourceUri;
    string public arbiterUri;
    address owner;
    address public account_to_pay;

    function Offer() {
        owner = msg.sender;
        arbiterUri = 'http://localhost:3000';
        account_to_pay = msg.sender;
        resourceUri = 'http://localhost:3001';
        //...
    }
}
