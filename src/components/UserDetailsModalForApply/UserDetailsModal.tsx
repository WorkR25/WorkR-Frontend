'use client';

import { useRouter } from 'next/navigation';
import { FC } from 'react';

import { createApplication, setOpenApplyModal } from '@/lib/features/applications/applicationSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ApplicationRequest } from '@/types';

const UserDetailsModal: FC = () => {
  const userState = useAppSelector((state) => state.userState.user);
  const jobId = useAppSelector((state) => state.jobState.jobIdForApply);
  const externalApplyLink = useAppSelector((state) => state.jobState.externalApplyLink);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function apply() {
    const requestObject: ApplicationRequest = {
      applicantId: Number(userState?.id),
      jobId
    };

    const res = await dispatch(createApplication(requestObject));
    if(externalApplyLink) {
      window.open(externalApplyLink);
    }
    
    dispatch(setOpenApplyModal(false));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }
  return (
    <div className='w-full absolute h-screen z-[998] flex items-center justify-center'>
      <div className='flex w-full items-center justify-center absolute z-[999] h-full bg-black bg-opacity-60'>
        <div className='bg-white rounded-md p-8 md:flex md:flex-col hidden gap-6 w-2/6'>
          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Full Name</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.fullName}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Email Address</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.email}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Mobile</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.mobileNumber}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Linkedin Profile</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0 cursor-pointer hover:text-blue-600 hover:underline duration-300'
                value={String(userState?.linkedInProfile)}
                onClick={() => window.open(String(userState?.linkedInProfile))}
                readOnly
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Resume</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0 cursor-pointer hover:text-blue-600 hover:underline duration-300'
                value={String(userState?.resumeLink)}
                onClick={() => window.open(String(userState?.resumeLink))}
                readOnly
              />
            </div>
          </div>

          <div className='flex justify-center gap-6'>
            <button onClick={() => dispatch(setOpenApplyModal(false))} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'>
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' onClick={apply} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>Check Details & Apply</p>
            </button>
          </div>
        </div>

        <div className='bg-white w-full h-auto md:hidden flex flex-col rounded-lg gap-5 pb-6 pt-6 px-4'>
          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Full Name</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.fullName}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Email Address</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.email}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Mobile</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                value={userState?.mobileNumber}
                disabled
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Linkedin Profile</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0 cursor-pointer hover:text-blue-600 hover:underline duration-300'
                value={String(userState?.linkedInProfile)}
                onClick={() => window.open(String(userState?.linkedInProfile))}
                readOnly
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full'>
            <label className='font-semibold text-neutral-500 text-base'>Resume</label>
            <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
              <input 
                type='text'
                placeholder='Full Name'
                className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0 cursor-pointer hover:text-blue-600 hover:underline duration-300'
                value={String(userState?.resumeLink)}
                onClick={() => window.open(String(userState?.resumeLink))}
                readOnly
              />
            </div>
          </div>

          <div className='flex justify-center gap-6'>
            <button onClick={() => dispatch(setOpenApplyModal(false))} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'>
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' onClick={apply} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>Check Details & Apply</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;