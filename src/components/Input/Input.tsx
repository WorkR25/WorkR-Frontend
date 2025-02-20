'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FieldError, Merge, Path, UseFormRegister } from 'react-hook-form';

import { CreateAdminData, JobFormData, OnboardingFormData, SigninFormData, SignupFormData } from '@/types';

interface InputProps<T extends SignupFormData | SigninFormData | OnboardingFormData | JobFormData | CreateAdminData> {
  label: string
  type: string
  field: keyof T,
  value?: string
  disabled?: boolean
  register: UseFormRegister<T>
  placeholder: string
  error?: Merge<FieldError, (FieldError | undefined)[]>
}

const Input = <T extends SignupFormData | SigninFormData | OnboardingFormData | JobFormData | CreateAdminData>({ label, disabled, value, field, type, register, placeholder, error }: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputType, setInputType] = useState(type);

  function togglePassword() {
    setShowPassword(!showPassword);
    if(inputType == 'password') {
      setInputType('text');
    } else {
      setInputType('password');
    }
  }

  return (
    <div className='flex flex-col gap-3 w-full'>
      <label className='font-semibold text-neutral-500 text-base'>
        {label}
      </label>
      <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
        <input 
          {...register(field as unknown as Path<T>)}
          value={value}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
        />

        {type == 'password' && (
          <div className='cursor-pointer' onClick={togglePassword}>
            {showPassword ? (
              <EyeOff size={20} color='#525252' />
            ) : (
              <Eye size={20} color='#525252' />
            )}
          </div>
        )}
      </div>

      {error && <p className='text-red-500 text-sm'>{error?.message}</p>}
    </div>
  );
};

export default Input;