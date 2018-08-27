# ClearGDPR.js and Elements SDK

ClearGDPR.js is the foundational JavaScript library for building ClearGDPR flows. With it you can collect sensitive information from the Subject and allow them to manage it identifying users with an unique token.

## Elements SDK

Elements is a set of pre-built UI components for building different flows, sign up flow for instance, and is available as a feature of ClearGDPR.js. Elements provides ready-made UI components like inputs and buttons for collecting information from the Subject. ClearGDPR.js then tokenizes the sensitive information within an Element without ever having it touch your server.

Elements includes features like:

- [x] Consent flow (signup and login)
- [x] Right to data portability (exporting and sharing data)
- [x] Right to data erasue (request to be forgotten)
- [x] Right to rectification of data
- [x] Right to restriction of processing
- [x] Right to objection of processing
- [ ] (WIP) Launch Subject profile management from single button

## Quickstart

```
npm install -S @cleargdpr/elements
```

```js
<script src="https://unpkg.com/react@15.6.2/dist/react.min.js" async defer></script>
<script src="https://unpkg.com/react-dom@15.6.2/dist/react-dom.min.js" async defer></script>
<script src="https://cdn.cleargdpr.com/sdk.js" async defer></script>
<script src="https://cdn.cleargdpr.com/cleargdpr.min.js" async defer></script>
<script src="https://cdn.cleargdpr.com/elements.min.js" async defer></script>
```

## Elements and basic usage

Basic Elements start up to create an instance of ClearGDPR object is through an API Key. Your key is required when calling the constructor and it works to identify your website to the Controller.

```js
const stripe = CG('pk_test_TYooMQauvdEDq54NiTphI7jx');
```

### Consent flow (signup and login)

Listens to all input forms submitted with the data attribute `data-cleargdpr="true"`. For each field extracts the value and prepares the payload sent to the CG Server instance.

### Right to data portability (exporting and sharing data)

### Right to data erasue (request to be forgotten)

### Right to rectification of data

### Right to restriction of processing

### Right to objection of processing
