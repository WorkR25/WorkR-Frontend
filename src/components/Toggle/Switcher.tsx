'use client';

import React from 'react';

const Switcher = ({
  background = 'bg-dark',
  foreground = 'bg-white',
  activeForeground = 'bg-white',
  activeBackground = 'bg-ankerblue',
  hasBorder = false,
}) => {
  const [isChecked, setIsChecked] = React.useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <>
      <label className='flex cursor-pointer select-none items-center'>
        <div className='relative'>
          <input
            type='checkbox'
            checked={isChecked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <div
            className={`box block h-5 w-10 rounded-full ${
              isChecked ? activeBackground : background
            }${hasBorder ? ' border-[1px] border-gray-300' : ''}`}
          ></div>
          <div
            className={`absolute left-[2px] top-[2px] flex h-4 w-4 items-center justify-center rounded-full transition ${
              isChecked ? `translate-x-5 ${activeForeground}` : foreground
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default Switcher;
