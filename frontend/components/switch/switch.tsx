import React from 'react';

interface Props {
  switchHandler: () => void;
}
const ToggleSwitch = ({ switchHandler }: Props) => {
  return (
    <label htmlFor='switch' className='switch'>
      <input id='switch' type='checkbox' onClick={switchHandler} />
      <span className='slider round'></span>
    </label>
  );
};

export default ToggleSwitch;
