import React from 'react';
import PropTypes from 'prop-types';
import Switch from '../Common/Switch';
import { map } from 'lodash';

const RESTRICTION_LABELS = {
  directMarketing: 'Direct marketing',
  emailCommunication: 'Email communication',
  research: 'Research and Analytics'
};

class Restriction extends React.PureComponent {
  state = {
    restrictions: {}
  };

  async componentDidMount() {
    const restrictions = await this.props.cg.Subject.getRestrictions();
    this.setState({ restrictions });
  }

  toggleRestriction = async (e, key, value) => {
    const restrictionsPayload = { ...this.state.restrictions, ...{ [key]: !value } };
    this.setState({ restrictions: restrictionsPayload });

    return await this.props.cg.Subject.updateRestrictions(restrictionsPayload);
  };

  render() {
    const { label } = this.props.options;
    const { restrictions } = this.state;

    console.log({ restrictions });

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
  cg: PropTypes.object
};

Restriction.defaultProps = {
  options: {
    label: 'Restrict processing'
  }
};

export default Restriction;
