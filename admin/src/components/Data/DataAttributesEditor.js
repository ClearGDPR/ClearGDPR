import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'components/core/cards/dashboard/Loader';
import JSONInput from 'react-json-editor-ajrm/index';
import locale from 'react-json-editor-ajrm/locale/en';

const DataAttributesEditor = ({ isBusy, config, updateConfig }) => {
  if (isBusy || !config) {
    return <Loader />;
  }

  let newConfig = config;

  const onSubmit = e => {
    e.preventDefault();
    updateConfig(newConfig);
  };
  return (
    <div className="cards">
      <form className="card col-3" onSubmit={onSubmit}>
        <div className="row">
          <JSONInput
            id="data-attributes-editor"
            placeholder={config}
            locale={locale}
            onChange={({ jsObject }) => {
              newConfig = jsObject;
            }}
            theme="light_mitsuketa_tribute"
            height="350px"
          />
        </div>
        <div className="row">
          <button className="ui-action btn primary">Save</button>
        </div>
      </form>
    </div>
  );
};

DataAttributesEditor.propTypes = {
  updateConfig: PropTypes.func.isRequired,
  config: PropTypes.object,
  isBusy: PropTypes.bool.isRequired
};

export default DataAttributesEditor;
