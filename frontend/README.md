# Frontend 

This package has 3 main sub-packages. We are trying to build a SDK of usable and simple to integrate components. Since different the approaches of implementing and solving the way a Subject request right to control of his own data, strategy followed is to figure out the best flow and then adding the recyclable components to the main SDK.

## Demo

```
├─ config
├─ public          # Public assets (e.g. images)
├─ scripts
└─ src
   ├─ components   # Dumb components
   ├─ containers   # Smart components (aka containers) that connect to redux
   ├─ config.js
   ├─ history.js
   ├─ index.js     # where the react app is mounted
   ├─ routes.js    # react-router configuration
   └─ yarn.lock
```

## JS-SDK

SDK design is based on several patterns, but main idea is to provide a way to abstract calls to the CG API, and have a way to trigger internal Events when some specific actions is done.

These two are the main patterns the Core SDK is based on:

- https://github.com/dropbox/dropbox-sdk-js
- https://developers.facebook.com/docs/javascript/reference/v3.1

```
├─ config
├─ scripts
└─ src
   └─ js-sdk
      ├─ common     # Reusable functions
      ├─ factories  # Service provider of different functions
      ├─ modules    # Each module represents a specification of the CG API
      ├─ cg.js      # CG SDK definition require Token and register all the modules
      ├─ config.js  # Default configuration, could be overwritten
      └─ index.js   
```


## Elements SDK

These two are the main patterns the Core SDK is based on:

- https://github.com/stripe/react-stripe-elements
- https://auth0.com/docs/libraries/lock/v11


```
├─ config
├─ scripts
└─ src
   └─ Elements
      ├─ components
      |  ├─ Common		      # Reusable components for all the Rights
      |  ├─ Consent		      # Right to Consent Components
      |  ├─ Erasure		      # Right to be Forgotten Components
      |  ├─ Portability		  # Data Portability Components
      |  ├─ Processors		  # Processors Components (used by other components)
      |  ├─ Rectification		# Right to Rectification Components
      |  └─ Share           # Data Sharing Componets
      ├─ theme              # Default styling
      ├─ utils              # Useful functions
      ├─ Element.js         # Factory to instance different Components
      ├─ Elements.js        # Inject `window.cg` or check if exists and give access to different flows
      └─ index.js
```




