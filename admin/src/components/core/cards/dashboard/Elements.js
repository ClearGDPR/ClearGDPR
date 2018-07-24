import React from 'react';
import { DefaultButton, PrimaryButton, SecondaryButton } from './../../Common/Buttons/Buttons';

const Elements = () => {
  return (
    <div className="kitchen-examples">
      <h3>Elements</h3>
      <h4>Buttons</h4>
      <p>DefaultButton</p>
      <div className="row">
        <DefaultButton text="Default Button" buttonState="" />
        <DefaultButton text="Default Button Success" buttonState="success" />
        <DefaultButton text="Default Button Warning" buttonState="warning" />
        <DefaultButton text="Default Button Error" buttonState="error" />
      </div>

      <p>PrimaryButton</p>
      <div className="row">
        <PrimaryButton text="Primary Button" buttonState="" />
        <PrimaryButton text="Primary Button Success" buttonState="success" />
        <PrimaryButton text="Primary Button Warning" buttonState="warning" />
        <PrimaryButton text="Primary Button Error" buttonState="error" />
      </div>

      <p>SecondaryButton</p>
      <div className="row">
        <SecondaryButton text="Secondary Button" buttonState="" />
        <SecondaryButton text="Secondary Button Success" buttonState="success" />
        <SecondaryButton text="Secondary Button Warning" buttonState="warning" />
        <SecondaryButton text="Secondary Button Error" buttonState="error" />
      </div>
    </div>
  );
};

export default Elements;
