import { CG } from '../src/js-sdk';
import { Elements } from '../src/Elements';

// Define instance of the SDK
// This will come from the window component
// TODO: We are assuming that `accessToken` is defined externaly
// const cgClient = CG({
//   accessToken: '...'
// });

// Define instance of Elements SDK
// In the future will be instanced as CG.elements()
const elements = new Elements();

// Add your base input styles here. For example:
const style = {
  base: {
    fontSize: '16px',
    color: '#32325d'
  }
};

// Create an instance of the card Element.
const button = elements.create('consent', { style });

// Add an instance of the requestAccess Element into the `request-access-element` <div>.
button.mount('#request-access-element');

// Handle real-time validation errors from the card Element.
button.addEventListener('change', event => {
  const displayError = document.getElementById('button-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
const form = document.getElementById('request-processors-form');
form.addEventListener('submit', event => {
  event.preventDefault();

  CG.Subject.giveConsent()
    .then(res => {
      console.log(res);
    })
    .catch(console.log);
});
