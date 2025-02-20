'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ArrowRight, Award, CreditCard, File, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

import Input from '@/components/Input/Input';
import { signup } from '@/lib/features/users/authSlice';
import { useAppDispatch } from '@/lib/hooks';
import { signupFormSchema } from '@/schemas/FormSchemas';
import { SignupDetails, SignupFormData } from '@/types';
import { USER_TYPE } from '@/utils/enums/UserType';
import Airtel from '~/svg/companies/Airtel';
import Bookmyshow from '~/svg/companies/Bookmyshow';
import Cardekho from '~/svg/companies/Cardekho';
import Spinny from '~/svg/companies/Spinny';
import TripAdvisor from '~/svg/companies/TripAdvisor';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [userType, setUserType] = useState(USER_TYPE.JOBSEEKER);
  const { register, getValues, handleSubmit, formState: { errors }, reset } = useForm<SignupFormData>({
    defaultValues: {
      userType,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: undefined,
      designation: undefined
    },
    resolver: zodResolver(signupFormSchema)
  });

  const handleUserTypeToggle = (type: USER_TYPE) => {
    setUserType(type);
  };

  useEffect(() => {
    reset({
      userType,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: undefined,
      designation: undefined
    });
  }, [userType, reset]);

  const onSubmit: SubmitHandler<SignupFormData> = async () => {
    try {
      const signupDetails: SignupDetails = {
        fullName: getValues('fullName'),
        email: getValues('email'),
        password: getValues('password'),
        mobileNumber: getValues('mobileNumber'),
        companyName: getValues('companyName'),
        designation: getValues('designation'),
        userType
      };

      const res = await dispatch(signup(signupDetails));
      if(res.payload?.data == 400) return;
      
      router.push('/signin');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-full min-h-screen flex flex-row overflow-y-auto'>
      <div className='hidden mt-20 lg:flex w-[calc(50sw)] xl:min-w-[568px] bg-background min-h-screen p-16 lg:flex-col lg:justify-between'>
        <div className='flex flex-col gap-12'>
          <div>
            <h1 className='text-2xl text-neutral-900'>Find your dream job!</h1>
            <h2 className='text-lg text-neutral-600 font-light'>
              Trusted by 300000+ students
            </h2>
          </div>
          <div className='flex flex-row flex-wrap items-center gap-4'>
            <Airtel />
            <Bookmyshow secondaryFill='#000' fill='#f6542b82' />
            <Cardekho />
            <Spinny />
            <TripAdvisor />
          </div>
          <div className='grid grid-cols-2'>
            <div className='flex flex-row gap-4 border-r-[1px] border-b-[1px] pb-8'>
              <File
                size={20}
                color='#a3a3a3'
                style={{
                  marginTop: '4px',
                }}
              />
              <div className='flex flex-col bg-g'>
                <p className='text-xl font-bold text-neutral-500'>7000 +</p>
                <p className='text-lg font-medium text-neutral-400'>Jobs</p>
              </div>
            </div>
            <div className='flex flex-row gap-4 justify-center border-b-[1px] pb-8 pl-8'>
              <CreditCard
                size={20}
                color='#a3a3a3'
                style={{
                  marginTop: '4px',
                }}
              />
              <div className='flex flex-col'>
                <p className='text-xl font-bold text-neutral-500'>18K +</p>
                <p className='text-lg font-medium text-neutral-400'>
                  Avg. Stipend
                </p>
              </div>
            </div>
            <div className='flex flex-row gap-4 border-r-[1px] pt-8'>
              <Award
                size={20}
                color='#a3a3a3'
                style={{
                  marginTop: '4px',
                }}
              />
              <div className='flex flex-col'>
                <p className='text-xl font-bold text-neutral-500'>6000 +</p>
                <p className='text-lg font-medium text-neutral-400'>
                  Companies
                </p>
              </div>
            </div>
            <div className='flex flex-row gap-4 justify-center pt-8 pl-8'>
              <Shield
                size={20}
                color='#a3a3a3'
                style={{
                  marginTop: '4px',
                }}
              />
              <div className='flex flex-col'>
                <p className='text-xl font-bold text-neutral-500'>100 %</p>
                <p className='text-lg font-medium text-neutral-400'>
                  Verified Jobs
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-row gap-8'>
            <FaInstagram size={24} color='#525252' />
            <FaLinkedin size={24} color='#525252' />
            <FaYoutube size={24} color='#525252' />
          </div>
          <div className='flex flex-row gap-4'>
            <p className='text-neutral-600'>©️ InterviewCall 2024</p>
            <div className='h-full bg-black w-[2px]' />
            <a href='#' className='no-underline text-neutral-600'>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <div className='w-full mt-20 p-8 sm:p-16 flex flex-col items-start sm:items-center gap-8 sm:gap-6'>
        <div className='flex flex-row gap-4 items-center justify-center mx-auto'>
          <button
            onClick={() => handleUserTypeToggle(USER_TYPE.JOBSEEKER)}
            className={clsx(
              'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
              userType === 'jobseeker'
                ? 'bg-primaryblue text-white'
                : 'text-primaryblue bg-white'
            )}
          >
            Job Seeker
          </button>
          <button
            onClick={() => handleUserTypeToggle(USER_TYPE.EMPLOYER)}
            className={clsx(
              'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
              userType === 'employer'
                ? 'bg-primaryblue text-white'
                : 'text-primaryblue bg-white'
            )}
          >
            Employer
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='border-0 sm:border w-full sm:w-fit rounded-md h-auto flex flex-col gap-8 p-0 sm:p-8'
        >
          <div className='flex justify-between items-center'>
            <p className='font-bold text-xl'>CREATE ACCOUNT</p>
            <a
              href='signin'
              className='font-semibold text-sm text-ankerblue underline'
            >
              Sign In
            </a>
          </div>
          <div className='w-full bg-gray-200 h-[1px]' />
          {userType === USER_TYPE.JOBSEEKER ? (
            <>
              <div className='w-full sm:w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-8'>
                <Input<SignupFormData>
                  label='Full Name'
                  type='text'
                  field='fullName'
                  register={register}
                  placeholder='Your Name'
                  error={errors.fullName}
                />

                <Input<SignupFormData>
                  label='Email Address'
                  type='email'
                  field='email'
                  register={register}
                  placeholder='Your Email Address' 
                  error={errors.email}
                />

                <Input<SignupFormData>
                  label='Password'
                  type='password'
                  field='password'
                  register={register}
                  placeholder='Enter Password' 
                  error={errors.password}
                />

                <Input<SignupFormData>
                  label='Confirm Password'
                  type='password'
                  field='confirmPassword'
                  register={register}
                  placeholder='Confirm Password' 
                  error={errors.confirmPassword}
                />
              </div>
              <div className='w-full sm:w-[500px]'>
                <Input<SignupFormData>
                  label='Mobile Number'
                  type='text'
                  field='mobileNumber'
                  register={register}
                  placeholder='Your Mobile Number' 
                  error={errors.mobileNumber}
                />
              </div>
            </>
          ) : (
            <>
              <div className='w-full sm:w-[500px]'>
                <Input
                  label='Full Name'
                  type='text'
                  field='fullName'
                  register={register}
                  placeholder='Your Name'
                  error={errors.fullName}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <div className='w-full sm:w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-8'>
                  <Input<SignupFormData>
                    label='Company Name'
                    type='text'
                    field='companyName'
                    register={register}
                    placeholder='Your Company Name'
                    error={errors.companyName}
                  />

                  <Input<SignupFormData>
                    label='Designation'
                    type='text'
                    field='designation'
                    register={register}
                    placeholder='Your designation'
                    error={errors.designation}
                  />
                </div>
                <p className='text-sm text-ankerblue font-semibold'>
                  Add the brand name for your <br /> company like Spinny, OLA
                </p>
              </div>
              <div className='w-full sm:w-[500px]'>
                <Input<SignupFormData>
                  label='Mobile Number'
                  type='text'
                  field='mobileNumber'
                  register={register}
                  placeholder='Your Mobile Number' 
                  error={errors.mobileNumber}
                />
              </div>
              <div className='w-full sm:w-[500px]'>
                <Input<SignupFormData>
                  label='Work Email'
                  type='email'
                  field='email'
                  register={register}
                  placeholder='abc@interviewcall.club' 
                  error={errors.email}
                />
              </div>
              <div className='w-full sm:w-[500px] grid grid-cols-1 sm:grid-cols-2 gap-8'>
                <Input<SignupFormData>
                  label='Password'
                  type='password'
                  field='password'
                  register={register}
                  placeholder='Enter Password' 
                  error={errors.password}
                />

                <Input<SignupFormData>
                  label='Confirm Password'
                  type='password'
                  field='confirmPassword'
                  register={register}
                  placeholder='Confirm Password' 
                  error={errors.confirmPassword}
                />
              </div>
            </>
          )}
          <div className='flex items-center gap-4'>
            <input
              type='checkbox'
              className='rounded-md w-6 h-6 text-primaryblue focus:ring-0 active:ring-0 focus:outline-none'
            />
            <p className='font-medium'>
              I agree to{' '}
              <a href='#' className='text-sm no-underline text-ankerblue'>
                Terms & Conditions
              </a>
            </p>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button
              type='submit'
              className='flex flex-row items-center py-2 px-5 justify-center gap-2 w-full bg-primaryblue rounded-md text-white'
            >
              <p className='font-semibold'>Create new account</p>
              <ArrowRight size={16} color='#FFF' />
            </button>
            <div className='w-full bg-gray-200 h-[1px]' />
            <p className='text-center text-sm'>
              Have an account?{' '}
              <a href='signin' className='font-semibold text-sm underline'>
                Signin Now
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
