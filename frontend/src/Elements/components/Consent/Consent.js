import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Checkbox from '../Common/Checkbox';
import PopoverView from '../Common/Views/Popover';
import ProcessorsList from '../Processors/ProcessorsList';
import Subject from '../../contexts/Subject';

class Consent extends React.PureComponent {
  state = {
    processors: [],
    showProcessors: false
  };

  consentGiven = false;

  async componentDidMount() {
    await this.props.subject.fetchProcessors();
    const { processors, isGuest } = this.props.subject;
    this.setState({ processors, isGuest });

    this.form = ReactDOM.findDOMNode(this).parentNode;
  }

  componentWillUpdate(newProps) {
    //@todo figure out a better way how to listen to subject's sign up event
    if (this.props.subject.isGuest && !newProps.subject.isGuest && !this.consentGiven) {
      this.handleGiveConsent();
    }
  }

  toggleProcessors = e => {
    e.preventDefault();

    this.setState(prevState => ({
      showProcessors: !prevState.showProcessors
    }));
  };

  handleGiveConsent = async () => {
    this.consentGiven = true;
    let processors = this.state.processors.slice();

    // Get Data from parent form
    const data = Array.prototype.slice
      .call(this.form.querySelectorAll('[data-cleargdpr="true"]'), 0)
      .reduce((result, formField) => {
        if (formField.value) {
          result[formField.name] = formField.value;
        }
        return result;
      }, []);

    try {
      await this.giveConsent(data, processors.filter(p => p.enabled).map(p => p.id));
      if (this.props.options.onSuccessCallback) {
        this.props.options.onSuccessCallback();
      }
    } catch (e) {
      console.log(e);
    }
  };

  onProcessorChange = processor => {
    let processors = this.state.processors.slice();
    let index = _.findIndex(processors, { id: processor.id });
    if (index !== -1) {
      processors.splice(index, 1, processor);
      this.setState({ processors });
    }
  };

  giveConsent = async (data = {}, processors) => {
    this.props.subject.giveConsent({
      personalData: { ...data },
      processors: [...processors]
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          styles={this.props.options.styles}
          label={this.props.options.label}
          onChange={this.onChange}
          required={this.props.options.required}
          name="cleargdpr-give-consent"
        />
        <div style={{ position: 'relative', padding: '10px 0 0 40px' }}>
          <button
            className="button is-primary is-outlined is-small"
            onClick={this.toggleProcessors}
          >
            <span role="img" aria-labelledby="lock">
              🔒
            </span>Config Processors
          </button>
          {this.state.showProcessors ? (
            <PopoverView open={this.state.showProcessors} onClose={this.toggleProcessors}>
              <ProcessorsList
                processors={this.state.processors}
                onProcessorChange={this.onProcessorChange}
              />
            </PopoverView>
          ) : null}
        </div>
      </div>
    );
  }
}

Consent.propTypes = {
  options: PropTypes.object,
  subject: PropTypes.instanceOf(Subject)
};

export default Consent;
