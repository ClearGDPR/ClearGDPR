// findsecrets-ignore-file
import React from 'react';
import PropTypes from 'prop-types';

const ProcessorsUpdated = ({ params = {} }) => (
  <React.Fragment>New processor address - {params.address}</React.Fragment>
);

const ConsentGiven = ({ params = {} }) => (
  <ul>
    <li>Given by subject with id {params.subjectId}</li>
    <li>Givent to processors with id {params.processorsConsented.join(', ')}</li>
  </ul>
);

const DataAccessed = ({ params = {} }) => {
  return <React.Fragment>Data of subject with id {params.subjectId}</React.Fragment>;
};

const DataRectified = ({ params = {} }) => {
  return (
    <React.Fragment>
      Data of subject with id {params.subjectId} rectified. Rectifications count is{' '}
      {params.rectificationCount}
    </React.Fragment>
  );
};

const DataRestricted = ({ params = {} }) => {
  return (
    <React.Fragment>Data processing restricted by subject id {params.subjectId}.</React.Fragment>
  );
};

const DataObjected = ({ params = {} }) => {
  return (
    <React.Fragment>Data processing objected by subject id {params.subjectId}.</React.Fragment>
  );
};

const DataErasedByController = ({ params = {} }) => {
  return (
    <React.Fragment>
      Subjects data(subject id {params.subjectId}) erased by controller.
    </React.Fragment>
  );
};

const DataErasedByProcessor = ({ params = {} }) => {
  return (
    <React.Fragment>
      Subjects data(subject id {params.subjectId}) erased by processor address {params.processor}.
    </React.Fragment>
  );
};

const GenericEvent = ({ params = {} }) => {
  const argumentsList = Object.keys(params).map(argument => (
    <li key={argument}>
      {argument} => {params[argument]}
    </li>
  ));

  return (
    <React.Fragment>
      {argumentsList.length > 0 ? (
        <React.Fragment>
          Event arguments:<ul>{argumentsList}</ul>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

const EVENTS_MAP = {
  Controller_ProcessorsUpdated: ProcessorsUpdated,
  Controller_ConsentGivenTo: ConsentGiven,
  Controller_SubjectDataAccessed: DataAccessed,
  Controller_SubjectDataRectified: DataRectified,
  Controller_SubjectDataRestricted: DataRestricted,
  Controller_SubjectDataObjected: DataObjected,
  Controller_SubjectDataErased: DataErasedByController,
  Processor_SubjectDataErased: DataErasedByProcessor
};

const Event = ({ event }) => {
  const { eventName, from, fromName } = event;
  const eventView = EVENTS_MAP[eventName] || GenericEvent;
  return (
    <React.Fragment>
      <p>
        <b>{eventName}</b> received from <b>{fromName}</b>:
      </p>
      <ul>
        <li>address: {from}</li>
        <li>{React.createElement(eventView, event)}</li>
      </ul>
    </React.Fragment>
  );
};

ProcessorsUpdated.propTypes = ConsentGiven.propTypes = DataAccessed.propTypes = DataRectified.propTypes = DataRestricted.propTypes = DataObjected.propTypes = DataErasedByController.propTypes = DataErasedByProcessor.propTypes = GenericEvent.propTypes = {
  params: PropTypes.object
};

Event.propTypes = {
  event: PropTypes.object
};

export default Event;
