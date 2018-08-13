# JS-SDK

SDK design is based on several patterns, but main idea is to provide a way to abstract calls to the CG API, and have a way to trigger internal Events when some specific actions is done.

These two are the main patterns the Core SDK is based on:

- https://github.com/dropbox/dropbox-sdk-js
- https://developers.facebook.com/docs/javascript/reference/v3.1

```
├─ config
├─ scripts
└─ src
    ├─ common     # Reusable functions
    ├─ factories  # Service provider of different functions
    ├─ modules    # Each module represents a specification of the CG API
    ├─ cg.js      # CG SDK definition require Token and register all the modules
    ├─ config.js  # Default configuration, could be overwritten
    └─ index.js   
```
