'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { FC } from 'react';
import { TbFilterSearch } from 'react-icons/tb';

import { setJobDrawerCategory, setOpenFilter, setTitle } from '@/lib/features/jobs/jobSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface JobDrawerProps {
  handleMoreFilters: () => void
}

const JobDrawer: FC<JobDrawerProps> = ({ handleMoreFilters }) => {
  const jobState = useAppSelector((state) => state.jobState);
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const { fulltimeJobs, internships, title } = jobState;
  return (
    <div className='md:hidden h-fit p-4 fixed top-20 w-screen bg-white border-b max-md:flex max-md:flex-col z-50 gap-6'>
      <div className='bg-white flex justify-center gap-8 w-full text-slate-500'>
        <Link href='/jobs/internship' onClick={() => dispatch(setJobDrawerCategory('internships'))} className={clsx('w-2/5 text-center py-2 border-[1px] rounded-lg', pathName == '/jobs/internship' ? 'border-ankerblue bg-subtleblue text-ankerblue' : 'text-slate-500')}>
          Internships ({internships ? internships.length : 0})
        </Link>
        <Link href='/jobs/full-time' onClick={() => dispatch(setJobDrawerCategory('jobs'))} className={clsx('w-2/5 text-center py-2 border-[1px] rounded-lg', pathName == '/jobs/full-time' ? 'border-ankerblue bg-subtleblue text-ankerblue' : 'text-slate-500')}>
          Jobs ({fulltimeJobs ? fulltimeJobs.length : 0})
        </Link>
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex gap-4 relative'>
          <input
            type='text'
            placeholder={pathName == '/jobs/full-time' ? 'Job Title' : 'Internship title'}
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            className='border-[1px] border-slate-300 rounded-md h-9 w-full outline-none text-sm'
          />
          <button onClick={handleMoreFilters} className='bg-[#142683] absolute right-12 text-white font-semibold text-sm px-3 py-2 rounded-lg hover:scale-95 duration-300'>Search</button>
          <button onClick={() => dispatch(setOpenFilter(true))} className='w-9 h-9 min-w-9 rounded-lg border flex items-center justify-center text-slate-500'>
            <TbFilterSearch className='text-lg' />
          </button>
        </div>
        {/* <input
          type='text'
          placeholder='Location Preference (Upto 3)'
          className='border-[1px] border-slate-300 rounded-md h-9 w-full outline-none text-sm'
        /> */}
      </div>
    </div>
  );
};

export default JobDrawer;
