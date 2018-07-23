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

  componentDidMount() {
    if (!this.state.processors.lenght) {
      window.cg.Subject.getProcessors()
        .then(processors => {
          processors.map(p => {
            p.enabled = true;
            return p;
          });
          this.setState({ processors });
        })
        .catch(err => {
          console.log('failure', err);
        });
    }

    const form = ReactDOM.findDOMNode(this).parentNode;
    form.addEventListener('submit', this.waitForToken, false);
  }

  componentWillUnmount() {
    const form = ReactDOM.findDOMNode(this).parentNode;
    form.removeEventListener('submit', () => {});
    window.cg.Events.clear('auth.setAccessToken');
  }

  toggleProcessors = e => {
    e.preventDefault();

    this.setState(prevState => ({
      showProcessors: !prevState.showProcessors
    }));
  };

  onSubmit = e => {
    if (this.props.options.onSubmit) {
      this.props.options.onSubmit();
    }
  };

  onChange = e => {
    if (this.props.options.onChange) {
      this.props.options.onChange();
    }
  };

  callback = e => {
    if (this.props.options.callbackFn) {
      this.props.options.callbackFn();
    }
  };

  waitForToken = e => {
    // Listen to token setup for CG SDK, then launch related events.
    window.cg.Events.subscribe('auth.setAccessToken', token => {
      this.handleGiveConsent(e, token);
    });
  };

  handleGiveConsent = e => {
    e.preventDefault();

    let data = {};
    let processors = this.state.processors.slice();

    // Get Data from parent form
    const form = ReactDOM.findDOMNode(this).parentNode;

    for (let field in { ...form }) {
      const input = form[field];
      const hasConsent = input.attributes && input.attributes.getNamedItem('data-cleargdpr');
      if (hasConsent && hasConsent.value === 'true' && input.value) {
        data[input.name] = input.value;
      }
    }

    this.giveConsent(data, processors.filter(p => p.enabled).map(p => p.id))
      .then(() => {
        if (this.props.options.onSuccessCallback) {
          this.props.options.onSuccessCallback();
        }
      })
      .catch(err => {
        console.log(err);
      });
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

    await window.cg.Subject.giveConsent(payload)
      .then(() => {})
      .catch(err => {
        console.log('failure', err);
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
  options: PropTypes.object
};

export default Consent;
