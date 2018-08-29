import React from 'react';
import PropTypes from 'prop-types';

import styles from 'theme/ShareData.scss';

class EditForm extends React.Component {
  handleOnSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.refs);
  };

  render() {
    const { onCancel, initialValues = {} } = this.props;

    return (
      <form className={styles.form} onSubmit={this.handleOnSubmit}>
        <div className={styles.formName}>
          <label htmlFor="name">Name</label>
          <input
            ref="name"
            type="text"
            name="name"
            id="name"
            defaultValue={initialValues.name}
            autoComplete="off"
          />
        </div>
        <button
          className="button is-small"
          style={{ position: 'absolute', bottom: 15, left: 15 }}
          onClick={onCancel}
        >
          Go Back
        </button>
        <button
          type="submit"
          className={`button is-small ${styles.buttonGreen}`}
          style={{ position: 'absolute', bottom: 15, right: 15 }}
        >
          Save
        </button>
      </form>
    );
  }
}

EditForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValues: PropTypes.object
};

export default EditForm;
