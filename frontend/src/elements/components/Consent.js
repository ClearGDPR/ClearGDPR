import React from 'react';
import ReactDOM from 'react-dom';
import ProcessorsList from './ProcessorsList';
import Checkbox from './Checkbox';
import PopoverView from './Views/Popover';
import _ from 'lodash';
import config from '../../config';

const { API_BASE } = config;

class Consent extends React.PureComponent {
  state = {
    registered: false,
    processors: [],
    showProcessors: false
  };

  componentDidMount() {
    // TODO: Improve cache, save to elements store, add localStorage
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
    form.addEventListener('submit', this.handleGiveConsent.bind(this));
  }

  componentWillUnmount() {
    const form = ReactDOM.findDOMNode(this).parentNode;
    form.removeEventListener('submit', () => {});
  }

  toggleProcessors(e) {
    e.preventDefault();

    this.setState(prevState => ({
      showProcessors: !prevState.showProcessors
    }));
  }

  onSubmit(e) {
    if (this.props.options.onSubmit) {
      this.props.options.onSubmit();
    }
  }

  onChange(e) {
    if (this.props.options.onSubmit) {
      this.props.options.onChange();
    }
  }

  callback(e) {
    if (this.props.options.onSubmit) {
      this.props.options.callback();
    }
  }

  handleGiveConsent(e) {
    e.preventDefault();

    let data = {};
    let processors = this.state.processors.slice();

    if (processors.length < 1 && !ReactDOM.findDOMNode(this)) {
      return null;
    }

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
        e.target.submit(); // Submit parent form callback
      })
      .catch(err => {
        console.log(err);
      });
  }

  onProcessorChange(processor) {
    let processors = this.state.processors.slice();
    let index = _.findIndex(processors, { id: processor.id });
    if (index !== -1) {
      processors.splice(index, 1, processor);
      this.setState({ processors });
    }
  }

  async giveConsent(data = {}, processors) {
    // TODO: Temporary fix to store user sign up credentials
    // TODO: Should require that Elements framework store this locally with Redux
    // TODO: Should recover existent users if sign up is repeated
    if (data.email && !this.state.registered) {
      const url = API_BASE + '/api/users/register';
      const token = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.email,
          password: 'some password' //tempfix
        })
      })
        .then(res => res.json())
        .then(res => {
          if (res.error) {
            throw new Error(res.error);
          }

          return res;
        });

      localStorage.setItem('cgToken', token.cgToken);

      this.setState({
        registered: token
      });
    }

    const { cgToken } = this.state.registered;

    // TODO: Get payload from store
    const payload = {
      personalData: { ...data },
      processors: [...processors]
    };

    window.cg.setAccessToken(cgToken);
    await window.cg.Subject.giveConsent(payload)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log('failure', err);
      });
  }

  render() {
    return (
      <div>
        <Checkbox
          styles={this.props.options.styles}
          label={this.props.options.label}
          onChange={this.onChange.bind(this)}
          required={this.props.options.required}
          name="cleargdpr-give-consent"
        />
        <div style={{ position: 'relative', padding: '10px 0 0 40px' }}>
          <button
            className="button is-primary is-outlined is-small"
            onClick={this.toggleProcessors.bind(this)}
          >
            <span role="img" aria-labelledby="lock">
              🔒
            </span>Config Processors
          </button>
          {this.state.showProcessors ? (
            <PopoverView
              open={this.state.showProcessors}
              onClose={this.toggleProcessors.bind(this)}
            >
              <ProcessorsList
                processors={this.state.processors}
                onProcessorChange={this.onProcessorChange.bind(this)}
              />
            </PopoverView>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Consent;
