'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import Input from '@/components/Input/Input';
import { useAppSelector } from '@/lib/hooks';
import { SignupFormData } from '@/types';
import { USER_TYPE } from '@/utils/enums/UserType';

const AccountSettingsPage = () => {
  const userState = useAppSelector((state) => state.userState.user);
  const { register, getValues, formState: { errors } } = useForm<SignupFormData>({
    defaultValues: {
      userType: userState?.userType,
      fullName: userState?.fullName,
      email: userState?.email,
      password: userState?.password,
      confirmPassword: '',
      mobileNumber: userState?.mobileNumber,
      companyName: userState?.companyName ? String(userState.companyName) : undefined,
      designation: userState?.designation ? String(userState.designation) : undefined
    }
  });
  return (
    <DashboardWrapper>
      <div className='flex justify-center w-screen md:w-[calc(100vw-256px)]'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className='border-0 sm:border w-[620px] rounded-md h-auto flex flex-col gap-8 p-0 sm:p-8 mt-16'
        >
          <div className='flex justify-between items-center'>
            <p className='font-bold text-xl'>Edit Account Details</p>
          </div>
          <div className='w-full bg-gray-200 h-[1px]' />
          <div className='flex flex-col gap-8 w-full'>
            <Input
              label='Full Name'
              type='text'
              field='fullName'
              value={getValues('fullName')}
              register={register}
              placeholder=''
              error={errors.fullName}
            />
            {userState?.userType == USER_TYPE.EMPLOYER && (
              <div className='flex gap-6'>
                <Input
                  label='Company Name'
                  type='text'
                  field='companyName'
                  value={getValues('companyName')}
                  register={register}
                  placeholder=''
                  error={errors.companyName}
                />

                <Input
                  label='Designation'
                  type='text'
                  field='designation'
                  value={getValues('designation')}
                  register={register}
                  placeholder=''
                  error={errors.designation}
                />
              </div>
            )}
            <Input
              label='Email Address'
              type='email'
              field='email'
              value={getValues('email')}
              register={register}
              placeholder=''
              error={errors.email}
              disabled={true}
            />
            <Input
              label='Password'
              type='password'
              field='password'
              placeholder=''
              value={getValues('password')}
              register={register}
              error={errors.password}
              disabled={true}
            />
            <Input
              label='Mobile Number'
              type='text'
              field='mobileNumber'
              placeholder=''
              value={getValues('mobileNumber')}
              register={register}
              error={errors.mobileNumber}
              disabled={true}
            />
          </div>
        </form>
      </div>
    </DashboardWrapper>
  );
};

export default AccountSettingsPage;
