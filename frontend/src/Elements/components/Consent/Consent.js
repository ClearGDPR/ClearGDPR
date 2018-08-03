import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Checkbox from '../Common/Checkbox';
import PopoverView from '../Common/Views/Popover';
import ProcessorsList from '../Processors/ProcessorsList';

class Consent extends React.PureComponent {
  state = {
    processors: [],
    showProcessors: false
  };

  async componentDidMount() {
    if (!this.state.processors.lenght) {
      try {
        const processors = await this.props.cg.Subject.getProcessors();
        this.setState({
          processors: processors.map(p => {
            p.enabled = true;
            return p;
          })
        });
      } catch (e) {
        console.log('failure', e);
      }
    }

    this.form = ReactDOM.findDOMNode(this).parentNode;
    this.form.addEventListener('submit', this.waitForToken, false);
  }

  componentWillUnmount() {
    this.form.removeEventListener('submit', () => {});
    this.props.cg.Events.clear('auth.setAccessToken');
  }

  toggleProcessors = e => {
    e.preventDefault();

    this.setState(prevState => ({
      showProcessors: !prevState.showProcessors
    }));
  };

  waitForToken = e => {
    // Listen to token setup for CG SDK, then launch related events.
    this.props.cg.Events.subscribe('auth.setAccessToken', token => {
      this.handleGiveConsent(e, token);
    });
  };

  handleGiveConsent = async e => {
    e.preventDefault();

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
    const payload = {
      personalData: { ...data },
      processors: [...processors]
    };

    try {
      await this.props.cg.Subject.giveConsent(payload);
    } catch (e) {
      console.log('failure', e);
    }
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
  cg: PropTypes.object
};

export default Consent;
