/*  ClearGDPR smart contract version 9
*       A piece of art made by CleverTech
*       Author contact: sindelio.lima@clevertech.biz
*       Coffee => Code!
*
*   IMPORTANT NOTES !!!!
*       1. The controller is a processor, but the processors are not controllers
*       2. All processor addresses and subject IDs are hashed in the back-end before entering the smart contract
*       3. In production only the record functions should be used and they should provide all functionality needed to the system
*       4. There's a bug when we use bytes32 instead of address to identificate the processors. The memory seems to not be cleared out
*       5. A subject restrictions apply to all the processors, globally
*       6. A subject objection also apply to all processors, globally
*       7. This smart contract was compiled without errors or warnings and all functions were tested
*/

pragma solidity ^0.4.24; 
contract ClearGDPR {
    address public controller; 
    address[] private processors; 
    enum State {unconsented, consented, erased}
    struct subjectStatus{
        bool isErased;
        bool isObjected;
        uint256 rectificationCount;
        // The 3 booleans bellow are the actions that can be restricted
        bool directMarketing;
        bool emailCommunication;
        bool research;
        mapping(address => State) processorState;  
    }
    mapping(bytes32 => subjectStatus) private subjects;

    event Controller_ProcessorsUpdated(address[] newProcessors);
    event Controller_ConsentGivenTo(bytes32 subjectId, address[] processorsConsented); 
    event Controller_SubjectDataAccessed(bytes32 subjectId);
    event Controller_SubjectDataRectified(bytes32 subjectId, uint256 rectificationCount);
    event Controller_SubjectDataRestricted(bytes32 subjectId, bool directMarketing, bool emailCommunication, bool research);
    event Controller_SubjectDataObjected(bytes32 subjectId, bool objection);
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

    function prependControllerAsProcessor(address[] _processors) private view returns(address[]){
        address[] memory allProcessors = new address[](_processors.length + 1);
        allProcessors[0] = controller;
        for(uint256 i = 0; i < _processors.length; i++){
            require(_processors[i] != controller);
            for(uint256 j = i + 1; j < _processors.length; j++){ // Checks if the processors are unique
                require(_processors[i] != _processors[j]);
            }
            allProcessors[i + 1] = _processors[i];
        }
        return allProcessors;
    }

    function getRectificationCount(bytes32 _subjectId) public view returns(uint256){
        return subjects[_subjectId].rectificationCount;
    }

    function getIsErased(bytes32 _subjectId) public view returns(bool){ // We should change this to getSubjectErasure
        return subjects[_subjectId].isErased;
    }

    function getSubjectDataState(bytes32 _subjectId, address _processor) public view returns(State){
        return subjects[_subjectId].processorState[_processor];
    }
    
    function getSubjectRestrictions(bytes32 _subjectId) public view returns(bool, bool, bool){
        return (subjects[_subjectId].directMarketing, subjects[_subjectId].emailCommunication, subjects[_subjectId].research);
    }
    
    function getSubjectObjection(bytes32 _subjectId) public view returns(bool){
        return subjects[_subjectId].isObjected;
    }

    function getProcessors() public view returns(address[], uint256){
        return (processors, processors.length);
    }

    function setSubjectDataState(bytes32 _subjectId, address _processor, State _state) public returns(bool){
        subjects[_subjectId].processorState[_processor] = _state;
        return true;
    }
    
    function setSubjectRestrictions(bytes32 _subjectId, bool _directMarketing, bool _emailCommunication, bool _research) public returns(bool){
        subjects[_subjectId].directMarketing = _directMarketing;
        subjects[_subjectId].emailCommunication = _emailCommunication;
        subjects[_subjectId].research = _research;
        return true;
    }
    
    function setSubjectObjection(bytes32 _subjectId, bool _objection) public returns(bool){
        subjects[_subjectId].isObjected = _objection;
        return true;
    }

    function setProcessors(address[] _newProcessors) public returns(bool){
        processors = prependControllerAsProcessor(_newProcessors);
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
        emit Controller_ProcessorsUpdated(processors);  
        return true;
    }

    function recordConsentGivenTo(bytes32 _subjectId, address[] _processorsConsented) public onlyController notErased(_subjectId) returns(bool){
        require(areAllValidProcessors(_processorsConsented));
        for(uint256 i = 0; i < processors.length; i++){
            subjects[_subjectId].processorState[processors[i]] = State.unconsented;
        }
        address[] memory allProcessorsConsented = prependControllerAsProcessor(_processorsConsented);
        for(i = 0; i < allProcessorsConsented.length; i++){
            subjects[_subjectId].processorState[allProcessorsConsented[i]] = State.consented;
        }
        subjects[_subjectId].directMarketing = true;
        subjects[_subjectId].emailCommunication = true;
        subjects[_subjectId].research = true;
        subjects[_subjectId].isErased = false;
        emit Controller_ConsentGivenTo(_subjectId, allProcessorsConsented);
        return true;
    }
  
    function recordAccessByController(bytes32 _subjectId) public onlyController notErased(_subjectId) returns(State[]){
        State[] memory states = new State[](processors.length);
        for(uint256 i = 0; i < processors.length; i++){
            states[i] = subjects[_subjectId].processorState[processors[i]];   
        }
        emit Controller_SubjectDataAccessed(_subjectId);
        return states;
    }
  
    function recordRectificationByController(bytes32 _subjectId) public onlyController notErased(_subjectId) returns(bool){
        subjects[_subjectId].rectificationCount++;
        emit Controller_SubjectDataRectified(_subjectId, subjects[_subjectId].rectificationCount);
        return true;
    }
    
    function recordRestrictionByController(bytes32 _subjectId, bool _directMarketing, bool _emailCommunication, bool _research) public onlyController notErased(_subjectId) returns(bool){
        require(setSubjectRestrictions(_subjectId, _directMarketing, _emailCommunication, _research));
        emit Controller_SubjectDataRestricted(_subjectId, _directMarketing, _emailCommunication, _research);
        return true;
    }
    
    function recordObjectionByController(bytes32 _subjectId, bool _objection) public onlyController notErased(_subjectId) returns(bool){
        require(setSubjectObjection(_subjectId, _objection));
        emit Controller_SubjectDataObjected(_subjectId, _objection);
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
*       1. Only 1 controller per smart contract.
*       2. Subjects can only interact directly with the controller. That means data access requests don't need to be informed to the processors.
*       3. Only controllers can initiate data erasure events.
*       4. The controller always has consent to use the user data. Else how could the user data be stored in the first place?
*
*   TODO: 
*       1. Change accessibility of setters to private (they are public for testing purposes)
*       2. Implement the add/remove function of processor nodes in the network, or use a system ID for each processor, which would be simpler
*       3. Study more about memory allocation/deallocation in Solidity. Will need to dive in inline Assembly
*       4. Consider that each processor can delete their data of a subject, without the data being deleted from the whole network
*/