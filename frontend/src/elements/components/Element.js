import React from 'react';
import Consent from './Consent';
import ForgottenRequest from './ForgottenRequest';
import ExportRequest from './ExportRequest';
import UserData from './UserData';
import ShareData from './ShareData';

// Factory of React Components
// Basic setup for any component is done here
// Probably a wrapper component should be added to avoid conflicts

// TODO: Factory pattern to create different elements from scratch
export default class Element {
  static create({ source, ...options }) {
    switch (source) {
      case 'consent':
        return <Consent options={options} />;
      case 'forgotten':
        return <ForgottenRequest options={options} />;
      case 'export':
        return <ExportRequest options={options} />;
      case 'data':
        return <UserData options={options} />;
      case 'share-data':
        return <ShareData options={options} />;
      default:
        return undefined;
    }
  }
}
