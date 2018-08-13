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
