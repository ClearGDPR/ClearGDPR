# Elements SDK

[![npm (scoped)](https://img.shields.io/npm/v/@cleargdpr/elements.svg)](https://www.npmjs.com/package/@cleargdpr/elements)

Elements is a set of pre-built UI components for building different flows, sign up flow for instance, and is available as a feature of ClearGDPR.js. Elements provides ready-made UI components like inputs and buttons for collecting information from the Subject. ClearGDPR.js then tokenizes the sensitive information within an Element without ever having it touch your server.

Elements includes features like:

- [x] Consent flow (signup and login)
- [x] Right to data portability (exporting and sharing data)
- [x] Right to data erasue (request to be forgotten)
- [x] Right to rectification of data
- [x] Right to restriction of processing
- [x] Right to objection of processing
- [ ] (WIP) Launch Subject profile management from single button

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Architecture](#architecture)
- [Quickstart](#quickstart)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Elements CG context](#elements-cg-context)
  - [Consent flow (signup and login)](#consent-flow-signup-and-login)
  - [Right to data portability (exporting and sharing data)](#right-to-data-portability-exporting-and-sharing-data)
  - [Right to data erasue (request to be forgotten)](#right-to-data-erasue-request-to-be-forgotten)
  - [Right to rectification of data](#right-to-rectification-of-data)
  - [Right to restriction of processing](#right-to-restriction-of-processing)
  - [Right to objection of processing](#right-to-objection-of-processing)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Architecture

This component library is React wrapper around ClearGDPR.js SDK (`js-sdk`) which is the foundational JS library for controlling ClearGDPR flows.

Internally data state management is handled via React Content API. Each right defined in the GDPR regulation has it own set of associated components.

The file structure is as follow:

```
├─ config
├─ scripts
└─ src
   └─ Elements
      ├─ components
      |  ├─ Common          # Reusable components for all the Rights
      |  ├─ Consent         # Right to Consent Components
      |  ├─ Erasure         # Right to be Forgotten Components
      |  ├─ Portability     # Data Portability Components
      |  ├─ Processors      # Processors Components (used by other components)
      |  ├─ Rectification   # Right to Rectification Components
      |  └─ Share           # Data Sharing Componets
      ├─ theme              # Default styling
      ├─ utils              # Useful functions
      ├─ Element.js         # Factory to instance different Components
      ├─ Elements.js        # Inject `window.cg` or check if exists and give access to different flows
      └─ index.js
```

> **Related reads**
>
> - https://github.com/stripe/react-stripe-elements
> - https://auth0.com/docs/libraries/lock/v11
> - https://hackernoon.com/making-of-a-component-library-for-react-e6421ea4e6c7

## Quickstart

TBD (jsfiddle example)

## Installation

Install with yarn:

```shell
yarn add @cleargdpr/elements
```

OR with npm:

```shell
npm install --save @cleargdpr/elements
```

OR using UMD build (exports a global Elements object);

```html
<script src="https://unpkg.com/@cleargdpr/elements@latest/dist/@cleargdpr/elements.js"></script>
```

If you don't provide styles for each component you can use default styling importing the base css

```html
<link rel="stylesheet" href="https://cdn.cleargdpr.com/elements.css">
```

## Getting Started

To know more about each prebuild component in the SDK you can go to [Components referece](REFERENCE.md).

### Elements CG context

Basic Elements start up to create an instance of ClearGDPR object is through an API Key. Your key is required when calling the constructor and it works to identify your website to the Controller.

In order for your application to have access to the `CG` object and share date state across components, you shold wrap your components or app with the Elements Provider. After that you can start defining new Right components and inject them into your components.

```js
// index.js
import React from 'react';
import { render } from 'react-dom';
import { ElementsProvider } from '@cleargdpr/elements';

import MyApp from './MyApp';

const App = () => {
  return (
    <ElementsProvider apiKey="pk_test_12345">
      <MyApp />
    </ElementsProvider>
  );
};

render(<App />, document.getElementById('root'));
```

### Consent flow (signup and login)

Listens to all input forms submitted with the data attribute `data-cleargdpr="true"`. For each field extracts the value and prepares the payload sent to the CG Server instance.

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class SignUp extends React.Component {
  render() {
    const ConsentFormController = Elements.element({
      source: 'consent',
      label: `Label for Consent button`,
      onSuccessCallback: () => {
        this.props.history.push('/success');
      }
    });

    return (
      <form>
        <input className="input" name="Address" type="text" required data-cleargdpr="true" />
        <input className="input" name="Address" type="text" required data-cleargdpr="true" />
        {ConsentFormController}
        <button>Submit</button>
      </form>
    );
  }
}
```

### Right to data portability (exporting and sharing data)

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class Profile extends React.Component {
  render() {
    const ExportDataButton = Elements.element({
      source: 'export',
      className: 'button is-primary',
      label: 'Export data'
    });

    return <div>{ExportDataButton}</div>;
  }
}
```

### Right to data erasue (request to be forgotten)

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class Profile extends React.Component {
  render() {
    const ForgottenRequestButton = Elements.element({
      source: 'forgotten',
      className: 'button is-primary',
      label: 'Request to be forgotten'
    });

    return <div>{ForgottenRequestButton}</div>;
  }
}
```

### Right to rectification of data

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class Profile extends React.Component {
  render() {
    const Rectification = Elements.element({
      source: 'rectification',
      label: 'Request rectification'
    });

    return <div>{Rectification}</div>;
  }
}
```

### Right to restriction of processing

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class Profile extends React.Component {
  render() {
    const ExportDataButton = Elements.element({
      source: 'export',
      className: 'button is-primary',
      label: 'Export data'
    });

    return <div>{ExportDataButton}</div>;
  }
}
```

### Right to objection of processing

```js
import React from 'react';
import { Elements } from '@cleargdpr/elements';

class Profile extends React.Component {
  render() {
    const Restriction = Elements.element({
      source: 'restriction',
      label: 'Restrict processing to controller'
    });

    return <div>{Restriction}</div>;
  }
}
```

## Troubleshooting

None for the moment.

## Development

Install dependencies:

```shell
yarn install
```

Run the demo:

```shell
yarn demo
```

Run the tests:

```shell
yarn test
```

Build:

```shell
yarn build
```
