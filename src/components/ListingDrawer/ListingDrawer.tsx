'use client';

import clsx from 'clsx';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { TbArrowsDownUp } from 'react-icons/tb';

import { useAppSelector } from '@/lib/hooks';
import { USER_TYPE } from '@/utils/enums/UserType';

interface ListingProps {
  jobCategory: string
  setJobCategory: Dispatch<SetStateAction<string>>
}

const ListingDrawer: FC<ListingProps> = ({ jobCategory, setJobCategory }) => {
  const userType = useAppSelector((state) => state.userState.user?.userType);
  const jobState = useAppSelector((state) => state.jobState);
  const { employerJobs, employerInternships } = jobState;
  return (
    <div className='md:hidden h-fit p-4 fixed top-20 w-screen bg-white border-b max-md:flex max-md:flex-col z-50 gap-6'>
      <div className='bg-white flex justify-center gap-8 w-full text-slate-500'>
        <button onClick={() => setJobCategory('jobs')} className={clsx('w-2/5 text-center py-2 border-[1px] rounded-lg', jobCategory == 'jobs' ? 'border-ankerblue bg-subtleblue text-ankerblue' : 'text-slate-500')}>
          My Jobs ({employerJobs ? employerJobs.length : 0})
        </button>
        
        <button onClick={() => setJobCategory('internships')} className={clsx('w-2/5 text-center py-2 border-[1px] rounded-lg', jobCategory == 'internships' ? 'border-ankerblue bg-subtleblue text-ankerblue' : 'text-slate-500')}>
          My Internships ({employerInternships ? employerInternships.length : 0})
        </button>
        {/* <p className='w-1/3 text-center py-2 bg-white text-slate-500 border-r-[1px] border-y-[1px] overflow-clip rounded-r-lg'>
          Other Jobs
        </p> */}
      </div>
      {userType == USER_TYPE.JOBSEEKER && <div className='flex flex-col gap-4 w-full'>
        <div className='flex gap-4'>
          <input
            type='text'
            placeholder='Role / Skills'
            className='border-[1px] border-slate-300 rounded-md h-9 w-full outline-none text-sm'
          />
          <div className='w-9 h-9 min-w-9 rounded-lg border flex items-center justify-center text-slate-500'>
            <TbArrowsDownUp />
          </div>
        </div>
        {/* <input
          type='text'
          placeholder='Location Preference (Upto 3)'
          className='border-[1px] border-slate-300 rounded-md h-9 w-full outline-none text-sm'
        /> */}
      </div>}
    </div>
  );
};

export default ListingDrawer;
