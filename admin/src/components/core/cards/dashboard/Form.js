import React from 'react';
import TextInput from './TextInput';

const Form = () => {
  return (
    <form action="" method="">
      <TextInput for="example" label="Example" placeholder="This is an input example" />
      <TextInput
        for="example-error"
        label="Example w/ error"
        placeholder="This is an input example with error"
        error
      />
      <fieldset>
        <legend>Radio Buttons</legend>
        <div className="input-group">
          <input type="radio" id="radio-example-1" name="radio-example" value="1" />
          <label htmlFor="radio-example-1">Radio Example 1</label>
        </div>
        <div className="input-group">
          <input type="radio" id="radio-example-2" name="radio-example" value="2" />
          <label htmlFor="radio-example-2">Radio Example 2</label>
        </div>
      </fieldset>

      <div className="input-group">
        <input type="checkbox" id="checkbox-example" name="checkbox-example" />
        <label htmlFor="checkbox-example">I'm a checkbox!</label>
      </div>

      <div>
        <input type="submit" className="btn" value="submit example" />
      </div>
    </form>
  );
};

export default Form;
