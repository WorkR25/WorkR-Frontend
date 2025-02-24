'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { jwtDecode } from 'jwt-decode';
import { ArrowRight, Award, CreditCard, File, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

import Input from '@/components/Input/Input';
import { signin } from '@/lib/features/users/authSlice';
import { getUser } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { signinFormSchema } from '@/schemas/FormSchemas';
import { SigninDetails, SigninFormData, UserPayload, UserRequest } from '@/types';
import { USER_STATUS } from '@/utils/enums/UserStatus';
import Airtel from '~/svg/companies/Airtel';
import Bookmyshow from '~/svg/companies/Bookmyshow';
import Cardekho from '~/svg/companies/Cardekho';
import Spinny from '~/svg/companies/Spinny';
import TripAdvisor from '~/svg/companies/TripAdvisor';

export default function LoginPage() {
  const userState = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { register, getValues, handleSubmit, formState: { errors } } = useForm<SigninFormData>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(signinFormSchema)
  });

  const onSubmit: SubmitHandler<SigninFormData> = async () => {
    try {
      const signinDetails: SigninDetails = {
        email: getValues('email'),
        password: getValues('password')
      };

      await dispatch(signin(signinDetails));

      const token = localStorage.getItem('token') as string;
      if(!token) return;
      
      const tokenDetails = jwtDecode<UserPayload>(token);

      const userRequestObject: UserRequest = {
        id: tokenDetails.id,
        token
      };

      await dispatch(getUser(userRequestObject));
    } catch (error) {
      throw error;
    }
  };

  React.useEffect(() => {
    if(userState) {
      if(userState.userStatus != USER_STATUS.ACTIVE) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    }
  }, [userState, router]);

  return (
    <div className='w-screen min-h-screen flex flex-row overflow-y-auto overflow-x-hidden'>
      <div className='hidden mt-20 lg:flex w-[calc(50sw)] xl:min-w-[568px] bg-background h-auto p-16 lg:flex-col lg:justify-between static'>
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
        {/* <div className='flex flex-row gap-4 items-center justify-center'>
          <button
            onClick={() => handleToggle('jobseeker')}
            className={clsx(
              'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
              toggle === 'jobseeker'
                ? 'bg-primaryblue text-white'
                : 'text-primaryblue bg-white'
            )}
          >
            Job Seeker
          </button>
          <button
            onClick={() => handleToggle('employer')}
            className={clsx(
              'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
              toggle === 'employer'
                ? 'bg-primaryblue text-white'
                : 'text-primaryblue bg-white'
            )}
          >
            Employer
          </button>
        </div> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='border-0 sm:border w-full sm:w-fit rounded-md h-auto flex flex-col gap-8 p-0 sm:p-8'
        >
          <div className='flex justify-between items-center'>
            <p className='font-bold text-xl'>SIGN IN</p>
            <Link
              href='/signup'
              className='font-semibold text-sm text-ankerblue underline'
            >
              Create an account
            </Link>
          </div>
          <div className='w-full bg-gray-200 h-[1px]' />
          <div className='flex flex-col gap-12 w-full sm:w-[400px]'>
            <Input<SigninFormData>
              label='Email Address'
              type='email'
              field='email'
              register={register}
              placeholder='Your Email Address' 
              error={errors.email}
            />

            <Input<SigninFormData>
              label='Password'
              type='password'
              field='password'
              register={register}
              placeholder='Enter Password' 
              error={errors.password}
            />
          </div>
          <a href='#' className='text-xs hover:text-neutral-400 transition-all'>
            Forgot Password?
          </a>
          <div className='w-full flex flex-col gap-4'>
            <button
              type='submit'
              className='flex flex-row items-center py-2 px-5 justify-center gap-2 w-full bg-primaryblue rounded-md text-white'
            >
              <p className='font-semibold'>Sign In</p>
              <ArrowRight size={16} color='#FFF' />
            </button>
            <div className='w-full bg-gray-200 h-[1px]' />
            <p className='text-center text-sm'>
              New to WorkR?{' '}
              <Link href='/signup' className='font-semibold text-sm underline'>
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
