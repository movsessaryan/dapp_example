pragma solidity ^0.4.4;
import "./DateTime.sol";

contract Offer {

    DateTime dt; //should be replaced with static contract
    uint public creationTimestamp ;
    uint public expirationTimestamp;
    string resourceUri;
    string arbiterUri;
    address owner;
    function Offer() {
        dt = new DateTime();
        owner = msg.sender;
        //...
    }

    function getArbiterUri() constant returns(string){
        return arbiterUri;
    }
    function getResourceUri() constant returns(string){
        return resourceUri;
    }
}
