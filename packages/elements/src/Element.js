import React from 'react';
import { inject } from 'contexts/SubjectContext';

import Consent from 'components/Consent/Consent';
import ForgottenRequest from 'components/Erasure/ForgottenRequest';
import ExportRequest from 'components/Portability/ExportRequest';
import UserData from 'components/Portability/UserData';
import ShareData from 'components/Share/ShareData';
import Objection from 'components/Objection/Objection';
import Rectification from 'components/Rectification/Rectification';
import Restriction from 'components/Restriction/Restriction';

const ELEMENTS = {
  consent: inject(Consent),
  forgotten: inject(ForgottenRequest),
  objection: inject(Objection),
  rectification: inject(Rectification),
  export: inject(ExportRequest),
  data: inject(UserData),
  'share-data': inject(ShareData),
  restriction: inject(Restriction)
};

/**
 * Factory to setup elements by `source` type.
 */
export default class Element {
  static create({ source, cg, ...options }) {
    const element = ELEMENTS[source];
    if (!element) {
      throw new Error('Element type was not specified.');
    }
    return React.createElement(element, { options, cg });
  }
}
