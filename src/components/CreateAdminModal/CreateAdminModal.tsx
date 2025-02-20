'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { clearToken } from '@/lib/features/users/authSlice';
import { logout, makeAdmin, setOpenAdminModal } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createAdminZodSchema } from '@/schemas/FormSchemas';
import { CreateAdminData } from '@/types';

import Input from '../Input/Input';

const CreateAdminModal: FC = () => {
  const adminEmail = useAppSelector((state) => state.userState.user?.email);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { register, getValues, formState: { errors }, reset, handleSubmit } = useForm<CreateAdminData>({
    defaultValues: {
      adminEmail,
      employerEmail: ''
    },
    resolver: zodResolver(createAdminZodSchema)
  });

  const { register: registerMobile, getValues: getValuesMobile, formState: { errors: errorsMobile }, reset: resetMobile, handleSubmit: handleSubmitMobile } = useForm<CreateAdminData>({
    defaultValues: {
      adminEmail,
      employerEmail: ''
    },
    resolver: zodResolver(createAdminZodSchema)
  });

  const onSubmit: SubmitHandler<CreateAdminData> = async () => {
    const requestObject: CreateAdminData = {
      adminEmail: String(adminEmail),
      employerEmail: getValues('employerEmail')
    };

    const res = await dispatch((makeAdmin(requestObject)));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }

    reset();
    dispatch(setOpenAdminModal(false));
  };

  const onSubmitMobile: SubmitHandler<CreateAdminData> = async () => {
    const requestObject: CreateAdminData = {
      adminEmail: String(adminEmail),
      employerEmail: getValuesMobile('employerEmail')
    };

    const res = await dispatch((makeAdmin(requestObject)));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }

    resetMobile();
    dispatch(setOpenAdminModal(false));
  };
  return (
    <div className='w-full absolute h-screen z-[998] flex items-center justify-center'>
      <div className='flex w-full items-center justify-center absolute z-[999] h-full bg-black bg-opacity-60'>
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-md p-8 md:flex md:flex-col hidden gap-8 w-2/6'>
          <Input<CreateAdminData> 
            label='Your Email*'
            type='text'
            placeholder='Enter Admin Email'
            register={register}
            field='adminEmail'
            error={errors.adminEmail}
            disabled={true}
          />

          <Input<CreateAdminData> 
            label='Employer Email*'
            type='text'
            placeholder='Enter Employer Email'
            register={register}
            field='employerEmail'
            error={errors.employerEmail}
          />

          <div className='flex gap-4 sm:gap-6 ml-auto'>
            <button
              onClick={() => dispatch(setOpenAdminModal(false))}
              className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'
            >
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>Make Admin</p>
            </button>
          </div>
        </form>

        <form onSubmit={handleSubmitMobile(onSubmitMobile)} className='bg-white w-full h-auto md:hidden flex flex-col rounded-lg gap-5 pb-6 pt-6 px-4'>
          <Input<CreateAdminData> 
            label='Your Email*'
            type='text'
            placeholder='Enter Admin Email'
            register={registerMobile}
            field='adminEmail'
            error={errorsMobile.adminEmail}
            disabled={true}
          />

          <Input<CreateAdminData> 
            label='Employer Email*'
            type='text'
            placeholder='Enter Employer Email'
            register={registerMobile}
            field='employerEmail'
            error={errorsMobile.employerEmail}
          />

          <div className='flex gap-8 sm:gap-6 mx-auto'>
            <button
              onClick={() => dispatch(setOpenAdminModal(false))}
              className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-7 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'
            >
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-7 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>Make Admin</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;