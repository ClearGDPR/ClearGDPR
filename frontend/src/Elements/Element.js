import React from 'react';

import Consent from './components/Consent/Consent';
import ForgottenRequest from './components/Erasure/ForgottenRequest';
import ExportRequest from './components/Portability/ExportRequest';
import UserData from './components/Portability/UserData';
import ShareData from './components/Share/ShareData';

const ELEMENT_TYPES = {
  CONSENT: 'consent',
  ERASURE: 'forgotten',
  DATA_EXPORT: 'export',
  DATA_STATUS: 'data',
  DATA_SHARE: 'share-data'
};

/**
 * Factory to setup elements by `source` type.
 */
export default class Element {
  static create({ source, cg, ...options }) {
    switch (source) {
      case ELEMENT_TYPES.CONSENT:
        return <Consent options={options} />;
      case ELEMENT_TYPES.ERASURE:
        return <ForgottenRequest options={options} />;
      case ELEMENT_TYPES.DATA_EXPORT:
        return <ExportRequest {...{ options, cg }} />;
      case ELEMENT_TYPES.DATA_STATUS:
        return <UserData options={options} />;
      case ELEMENT_TYPES.DATA_SHARE:
        return <ShareData options={options} />;
      default:
        throw new Error('Element was type not specified.');
    }
  }
}
