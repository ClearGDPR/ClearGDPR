<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Elements SDK](#elements-sdk)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Elements SDK

These two are the main patterns the Core SDK is based on:

- https://github.com/stripe/react-stripe-elements
- https://auth0.com/docs/libraries/lock/v11


```
├─ config
├─ scripts
└─ src
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
