import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'components/Common/Switch';
import { map } from 'lodash';
import Subject from '../../contexts/Subject';

const RESTRICTION_LABELS = {
  directMarketing: 'Direct marketing',
  emailCommunication: 'Email communication',
  research: 'Research and Analytics'
};

class Restriction extends React.PureComponent {
  state = {
    restrictions: {}
  };

  componentDidMount() {
    this.props.subject.fetchRestrictions();
  }

  toggleRestriction = (e, key, value) => {
    const restrictionsPayload = { ...this.props.subject.restrictions, ...{ [key]: !value } };
    this.props.subject.updateRestrictions(restrictionsPayload);
  };

  render() {
    const { label } = this.props.options;
    const { restrictions } = this.props.subject;

    return (
      <div>
        <label>{label}</label>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left'
          }}
        >
          {map(restrictions, (value, key) => (
            <div
              key={key}
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{RESTRICTION_LABELS[key]}</span>
              <Switch onChange={e => this.toggleRestriction(e, key, value)} value={value} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

Restriction.propTypes = {
  options: PropTypes.object,
  subject: PropTypes.instanceOf(Subject)
};

Restriction.defaultProps = {
  options: {
    label: 'Restrict processing'
  }
};

export default Restriction;
