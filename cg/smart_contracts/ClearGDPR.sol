pragma solidity 0.4.21; 
contract ClearGDPR {
  address public controller; 
  address[] private processors;  
  enum State {notShareable, shareable, erased} 
  struct subjectData{
    bool isErased; 
    mapping(address => State) statePerProcessor;  
  }
  mapping(bytes32 => subjectData) private subjects;

  event Controller_ProcessorsUpdated(address[] newProcessors);
  event Controller_ConsentGivenTo(bytes32 subjectIdHash, address[] newProcessorsWhiteListed); 
  event Controller_SubjectDataAccessed(bytes32 subjectIdHash);
  event Controller_SubjectDataErased(bytes32 subjectIdHash); 
  event Processor_SubjectDataErased(bytes32 subjectIdHash, address processorIdHash);

  modifier onlyController(){
    require(msg.sender == controller);
    _;
  }
  
  modifier onlyProcessor(){
    require(isProcessor(msg.sender));
    _;     
  }
  
  modifier notErased(bytes32 _subjectIdHash){
    require(subjects[_subjectIdHash].isErased == false);
    _;
  }

  function ClearGDPR() public {
    controller = msg.sender; 
  }

  function getIsErased(bytes32 _subjectIdHash) public view returns(bool){
    return subjects[_subjectIdHash].isErased;
  }

  function getSubjectDataState(bytes32 _subjectIdHash, address _processorIdHash) public view returns(State){
    return subjects[_subjectIdHash].statePerProcessor[_processorIdHash];
  }

  function getProcessors() public view returns(address[], uint256){
    return (processors, processors.length);
  }

  function setSubjectDataState(bytes32 _subjectIdHash, address _processorIdHash, State _state) public returns(bool){
    subjects[_subjectIdHash].statePerProcessor[_processorIdHash] = _state;
    return true;
  }

  function setProcessors(address[] _newProcessors) public returns(bool){ //BUG IN HERE, CAN'T USE BYTES32
    processors = new address[](_newProcessors.length);
    processors = _newProcessors;
    return true;
  }
  
  function isProcessor(address _processor) public view returns(bool){ //0x1 for remix, since it's the only argument
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

  function recordConsentGivenTo(bytes32 _subjectIdHash, address[] _processorsWhiteListedBySubject) public onlyController notErased(_subjectIdHash)  returns (bool){
    require(areAllValidProcessors(_processorsWhiteListedBySubject));
    for(uint256 i = 0; i < processors.length; i++){
      subjects[_subjectIdHash].statePerProcessor[processors[i]] = State.notShareable;  
    }
    for(i = 0; i < _processorsWhiteListedBySubject.length; i++){
      subjects[_subjectIdHash].statePerProcessor[_processorsWhiteListedBySubject[i]] = State.shareable;  
    }
    subjects[_subjectIdHash].isErased = false;
    emit Controller_ConsentGivenTo(_subjectIdHash, _processorsWhiteListedBySubject);
    return true;
  }
  
  function recordAccessByController(bytes32 _subjectIdHash) public onlyController notErased(_subjectIdHash) returns (State[]){
    State[] memory states = new State[](processors.length);
    for(uint256 i = 0; i < processors.length; i++){
      states[i] = subjects[_subjectIdHash].statePerProcessor[processors[i]];
    }
    emit Controller_SubjectDataAccessed(_subjectIdHash);
    return states;
  }

  function recordErasureByController(bytes32 _subjectIdHash) public onlyController notErased(_subjectIdHash) returns (bool){
    subjects[_subjectIdHash].isErased = true;
    emit Controller_SubjectDataErased(_subjectIdHash);
    return true;
  }
  
  function recordErasureByProcessor(bytes32 _subjectIdHash, address _processor) public onlyProcessor returns (bool){
    emit Processor_SubjectDataErased(_subjectIdHash, _processor);
    return true;
  }

}