/*  ClearGDPR smart contract version 7
*       A piece of art made by CleverTech
*       Author contact: sindelio.lima@clevertech.biz
*       Coffee => Code!
*
*   IMPORTANT NOTES !!!!       
*       1. All processor addresses and subject IDs are hashed in the back-end before entering the smart contract.
*       2. In production only the record functions should be used and they should provide all functionality needed to the system.
*       3. There's a bug when we use bytes32 instead of address to identificate the processors. The memory seems to not be cleared out.
*       4. This smart contract was compiled without errors or warnings and all functions were tested.
*/

pragma solidity ^0.4.24; 
contract ClearGDPR {
    address public controller; 
    address[] private processors; 
    enum State {notShareable, shareable, erased} 
    struct subjectData{
        bool isErased;
        uint256 rectificationCount;
        mapping(address => State) statePerProcessor;  
    }
    mapping(bytes32 => subjectData) private subjects;

    event Controller_ProcessorsUpdated(address[] newProcessors);
    event Controller_ConsentGivenTo(bytes32 subjectId, address[] processorsConsented); 
    event Controller_SubjectDataAccessed(bytes32 subjectId);
    event Controller_SubjectDataRectified(bytes32 subjectId, uint256 rectificationCount);
    event Controller_SubjectDataErased(bytes32 subjectId); 
    event Processor_SubjectDataErased(bytes32 subjectId, address processor);

    modifier onlyController(){
        require(msg.sender == controller);
        _;
    }
  
    modifier onlyProcessor(){
        require(isProcessor(msg.sender));
        _;     
    }
  
    modifier notErased(bytes32 _subjectId){
        require(subjects[_subjectId].isErased == false);
        _;
    }

    constructor() public {
        controller = msg.sender;
        processors = new address[](1);
        processors[0] = controller;
    }

    function getRectificationCount(bytes32 _subjectId) public view returns(uint256){
        return subjects[_subjectId].rectificationCount;
    }

    function getIsErased(bytes32 _subjectId) public view returns(bool){
        return subjects[_subjectId].isErased;
    }

    function getSubjectDataState(bytes32 _subjectId, address _processor) public view returns(State){
        return subjects[_subjectId].statePerProcessor[_processor];
    }

    function getProcessors() public view returns(address[], uint256){
        return (processors, processors.length);
    }

    function setSubjectDataState(bytes32 _subjectId, address _processor, State _state) public returns(bool){
        subjects[_subjectId].statePerProcessor[_processor] = _state;
        return true;
    }

    function setProcessors(address[] _newProcessors) public returns(bool){
        processors = new address[](_newProcessors.length + 1);
        processors[0] = controller;
        for(uint256 i = 0; i < _newProcessors.length; i++){
            //requires that none of the processors is equal to the controller
            //Processors should all be different
            processors[i + 1] = _newProcessors[i];
        }
        return true;
    }
  
    function isProcessor(address _processor) public view returns(bool){
        for(uint256 i = 0; i < processors.length; i++){
            if(processors[i] == _processor){
                return true;
            }
        }
        return false;
    }
  
    function areAllValidProcessors(address[] _processors) public view returns(bool){
        for(uint256 i = 0; i < _processors.length; i++){
            require(isProcessor(_processors[i]));
        }
        return true;
    }
  
    function recordProcessorsUpdate(address[] _newProcessors) public onlyController returns(bool){
        require(setProcessors(_newProcessors));
        emit Controller_ProcessorsUpdated(_newProcessors);  
        return true;
    }

    function recordConsentGivenTo(bytes32 _subjectId, address[] _processorsConsented) public onlyController notErased(_subjectId) returns(bool){
        require(areAllValidProcessors(_processorsConsented));
        for(uint256 i = 0; i < processors.length; i++){
            subjects[_subjectId].statePerProcessor[processors[i]] = State.notShareable;  
        }
        for(i = 0; i < _processorsConsented.length; i++){
            subjects[_subjectId].statePerProcessor[_processorsConsented[i]] = State.shareable;  
        }
        subjects[_subjectId].statePerProcessor[controller] = State.shareable;  
        subjects[_subjectId].isErased = false;
        emit Controller_ConsentGivenTo(_subjectId, _processorsConsented);
        return true;
    }
  
    function recordAccessByController(bytes32 _subjectId) public onlyController notErased(_subjectId) returns(State[]){
        State[] memory states = new State[](processors.length);
        for(uint256 i = 0; i < processors.length; i++){
            states[i] = subjects[_subjectId].statePerProcessor[processors[i]];
        }
        emit Controller_SubjectDataAccessed(_subjectId);
        return states;
    }
  
    function recordRectificationByController(bytes32 _subjectId) public onlyController notErased(_subjectId) returns(bool){
        subjects[_subjectId].rectificationCount++;
        emit Controller_SubjectDataRectified(_subjectId, subjects[_subjectId].rectificationCount);
        return true;
    }

    function recordErasureByController(bytes32 _subjectId) public onlyController notErased(_subjectId) returns(bool){
        subjects[_subjectId].isErased = true;
        emit Controller_SubjectDataErased(_subjectId);
        return true;
    }
  
    function recordErasureByProcessor(bytes32 _subjectId, address _processor) public onlyProcessor returns(bool){
        emit Processor_SubjectDataErased(_subjectId, _processor);
        return true;
    }

}

/*  ASSUMPTIONS:
*       1. The controller is a processor, but processors are not controllers.
*       1. Only 1 controller per smart contract.
*       2. Users can only interact directly with the controller. That means data access requests don't need to be informed to the processors.
*       3. Only controllers can initiate data erasure events.
*       4. The controller always has consent to use/consume/process the user data. Else how could the user data be stored in the first place?
*            Although the consent can be restricted or objected by the subject, and those actions affect every participant in the network. A controller without consent when the processors have is a scenario that can't happen in the system. 
*
*   TODO: 
*       1. Change accessibility of setters to private (they are public for testing purposes).
*       2. Implement the add/remove function of processor nodes in the network, or use a system ID for each processor, which would be simpler.
*       3. Study more about memory allocation/deallocation in Solidity. Will need to dive in inline Assembly.
*       4. Consider that each processor can delete their data of a subject, without the data being deleted from the whole network.
*       5. When a subjects gives consent, does that work as a rectification of data? If not, his data should not be altered when he gives consent again.
*/