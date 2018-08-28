<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [JS-SDK](#js-sdk)
  - [Related reads](#related-reads)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# JS-SDK

SDK design is based on several patterns, but main idea is to provide a way to abstract calls to the CG API, and have a way to trigger internal Events when some specific actions is done.

```
├─ config
├─ scripts
└─ src
    ├─ common     # Reusable functions
    ├─ factories  # Service provider of different functions
    ├─ modules    # Each module represents a specification of the CG API
    ├─ cg.js      # CG SDK definition require Token and register all the modules
    ├─ events.js  # Events subscription/notification used by different flows
    ├─ config.js  # Default configuration, could be overwritten
    └─ index.js
```

## Related reads

- https://github.com/hueitan/javascript-sdk-design
- https://github.com/dropbox/dropbox-sdk-js
- https://developers.facebook.com/docs/javascript/reference/v3.1
