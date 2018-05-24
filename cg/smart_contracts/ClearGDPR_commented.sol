/*  ClearGDPR smart contract version 5
*       A piece of art made by CleverTech
*       Author contact: sindelio.lima@clevertech.biz
*       Coffee => Code!
*/

//This code is compiled without errors and all functions were tested 
pragma solidity 0.4.21; //Latest version of the stable compiler
contract ClearGDPR {
  address public controller; //Address of the controller, who owns the smart contract
  address[] private processors; //Array containing all processors registedred for data sharing with the controller
  enum State {notShareable, shareable, erased} //Possible states of the subjects data
  struct subjectData{ //Structure of each subject's data
    bool isErased; //bool specifiyng if the subject's data was completely erased from the entire system. false by default
    mapping(address => State) statePerProcessor; //State of the subject's data for each registered processor 
  }
  mapping(bytes32 => subjectData) private subjects; //Maps a subject's ID to his correspondent data struct

  /*
  *     Possible events in the system. Note that the name before the "_" represents who can fire the event.
  *     Currently only one event can be fired by processors in the network.
  */
  event Controller_ProcessorsUpdated(address[] newProcessors); //Logs when the array of registered processors is updated
  event Controller_ConsentGivenTo(bytes32 subjectIdHash, address[] newProcessorsWhiteListed); //Logs when a subject gives consent to a selection of the registered processors 
  event Controller_SubjectDataAccessed(bytes32 subjectIdHash); //Logs when the subject requests access to his data
  event Controller_SubjectDataErased(bytes32 subjectIdHash); //Logs when the controller destroys a subjects's data per request of the subject
  event Processor_SubjectDataErased(bytes32 subjectIdHash, address processorIdHash); //Logs when a processor delete a subjects's data per request of the subject.
  //When a subject requests that his data be erased, the request is made to the controller, which then notifies the  white listed processors via event to also delete the user's data

  //Function modifier that only allows the execution of the function if the executor is the owner(a.k.a. creator) of the smart contract
  modifier onlyController(){
    require(msg.sender == controller);
    _;
  }
  
  //Function modifier that only allows the execution of the function if the executor is not the owner of the smart contract
  modifier onlyProcessor(){
    require(isProcessor(msg.sender));
    _;     
  }
  
  //Function modifier that only allows the execution of the function if the executor is the subject's data is not erased
  modifier notErased(bytes32 _subjectIdHash){
    require(subjects[_subjectIdHash].isErased == false);
    _;
  }

  /*
  *     Constructor function/method. 
  *     It stores the address of the creator, or owner, of the smart contract. 
  *     In our case, the owner is the controller node in the Quorum network.
  *     Input arguments:
  *         -
  *     Output arguments:
  *         -
  */
  function ClearGDPR() public {
    controller = msg.sender;
    //maybe give the possibility to set the processors here
  }

  /*
  *     Getter for a subject's data erasure state.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *     Output arguments:
  *         bool - true for completely erased, false for active.
  */
  function getIsErased(bytes32 _subjectIdHash) public view returns(bool){
    return subjects[_subjectIdHash].isErased;
  }

  /*
  *     Getter for a subject's data state for a specific registered processor.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *     Output arguments:
  *         State - state of the subject's data for a specific processor in the system.
  */
  function getSubjectDataState(bytes32 _subjectIdHash, address _processorIdHash) public view returns(State){
    return subjects[_subjectIdHash].statePerProcessor[_processorIdHash];
  }

  /*
  *     Getter for the array of registered processors.
  *     Input arguments:
  *         -
  *     Output arguments:
  *         address[] - array of processors address containing all registered processors.
  *         uint256 - length of the array of registered processors.
  */ 
  function getProcessors() public view returns(address[], uint256){
    return (processors, processors.length);
  }

  /*
  *     Setter for a subject's data state for a specific registered processor.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *         address _processorIdHash - address of a registered processor in the system.
  *     Output arguments:
  *         State - state of the subject's data for the processor specified in _processorIdHash.
  */
  function setSubjectDataState(bytes32 _subjectIdHash, address _processorIdHash, State _state) public returns(bool){
    subjects[_subjectIdHash].statePerProcessor[_processorIdHash] = _state;
    return true;
  }

  /*   
  *     Setter for the array of registered processors.
  *     Input arguments:
  *         address[] _newProcessors - dynamic array of processors address containing the new registered processors.
  *      Output arguments:
  *         bool - true if the array of registered processors was succesfully updated, false otherwise.
  */
  function setProcessors(address[] _newProcessors) public returns(bool){
    processors = new address[](_newProcessors.length);
    processors = _newProcessors;
    return true;
  }
  
  /*
  *     Function to verify that a processor is registered by the controller for data sharing.
  *     Input arguments:
  *         address processor - the address of a registered processor in the Quorum network.
  *     Output arguments:
  *         bool - true if _processor is registered, false otherwise.
  */
  function isProcessor(address _processor) public view returns(bool){ //0x1 for remix, since it's the only argument
    for(uint256 i = 0; i < processors.length; i++){
      if(processors[i] == _processor){
        return true;
      }
    }
    return false;
  }
  
  /*
  *     Function to verify if an array of processors is registered by the controller.
  *     Input arguments:
  *         address[] _processors - dynamic array of processor's addresses in the Quorum network.
  *     Output arguments:
  *         bool - true if all processors in _processors are registered, false otherwise.
  */
  function areAllValidProcessors(address[] _processors) public view returns(bool){
    for(uint256 i = 0; i < _processors.length; i++){
      require(isProcessor(_processors[i]));
    }
    return true;
  }
  
  /*
  *     Function that records, i.e. fires events, when the array of registered processors is updated.
  *     Input arguments:
  *         address[] _newProcessors - array of processors address that contains the new registered processors.
  *     Output arguments:
  *         bool - true if the array of registered processors was succesfully updated, false otherwise.
  */
  function recordProcessorsUpdate(address[] _newProcessors) public onlyController returns(bool){
    require(setProcessors(_newProcessors));
    emit Controller_ProcessorsUpdated(_newProcessors);  
    return true;
  }

  /*
  *     Function that records when a subject gives consent to a selection of  the registered processors to process his data.
  *     This function also implements the right to consent.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *         address[] _processorsWhiteListedBySubject - dynamic array of processors addresses that contains the new white listed processors by a subject.
  *     Output arguments:
  *         bool - true if the execution was successful, false otherwise.
  */
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
  
  /*
  *     Function that records when a subject requests access to his personal data.
  *     This function implements the right to access personal data.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *     Output arguments:
  *         State[] - dynamic array of State containing the state of the subject's data for each processor in the system.
  */
  function recordAccessByController(bytes32 _subjectIdHash) public onlyController notErased(_subjectIdHash) returns (State[]){
    State[] memory states = new State[](processors.length);
    for(uint256 i = 0; i < processors.length; i++){
      states[i] = subjects[_subjectIdHash].statePerProcessor[processors[i]];
    }
    emit Controller_SubjectDataAccessed(_subjectIdHash);
    return states;
  }
  
  /*
  *     Function that records when a subject's data is erased by the controller.
  *     This function is the first part of the implementation of the right to be forgotten.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *     Output arguments:
  *         bool - true if the execution was successful, false otherwise. 
  */
  function recordErasureByController(bytes32 _subjectIdHash) public onlyController notErased(_subjectIdHash) returns (bool){
    subjects[_subjectIdHash].isErased = true;
    emit Controller_SubjectDataErased(_subjectIdHash);
    return true;
  }
  
  /*
  *     Function that records when a subject's data is erased by a processor.
  *     All processors whitelisted by the subject must delete his data if requested.
  *     This function is the second and last part of the implementation of the right to be forgotten.
  *     Input arguments:
  *         bytes32 _subjectIdHash - hashed ID of a subject in the system.
  *         address _processor - address of a processor in the Quorum network.
  *     Output arguments:
  *         bool - true if the execution was successful, false otherwise.
  */
  function recordErasureByProcessor(bytes32 _subjectIdHash, address _processor) public onlyProcessor returns (bool){
    emit Processor_SubjectDataErased(_subjectIdHash, _processor);
    return true;
  }

}

/*  ASSUMPTIONS:
*       1. Only 1 controller per smart contract.
*       2. Users can only interact directly with the controller. That means data access requests don't need to be informed to the processors.
*       3. Only controllers can initiate data erasure events.
*       4. The controller always has consent to use the user data. Else how could the user data be stored in the first place?
*
*   NOTES:
*       1. We should move any processing of data to the back-end if possible. The only processing done in the smart contract is to ascertain that the data stored is valid.
*       2. Controllers and processors have a different set of possible actions in the system. Hence the events each can fire are also different.
*      We need a way to enforce this difference in the back-end if we stick with this smart contract.
*       3. There's a bug when we use bytes32 instead of address to identificate the processors. The memory seems to not be cleared out. 
*       
*   TODO: 
*       1. Change accessibility of setters to private (they are public for testing purposes)
*       2. Implement the add/remove function of processor nodes in the network, or use a system ID for each processor, which would be simpler
*       3. Study more about memory allocation/deallocation in Solidity. Will need to dive in inline Assembly
*       4. Consider that each processor can delete their data of a subject, without the data being deleted from the whole network
*/