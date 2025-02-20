'use client';

import { FC } from 'react';

import { setJobCategory, setOpenJobForm, setOpenPostTab } from '@/lib/features/jobs/jobSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';

const PostTab: FC = () => {
  const openPostTab = useAppSelector((state) => state.jobState.openPostTab);
  const openJobForm = useAppSelector((state) => state.jobState.openJobForm);
  const dispatch = useAppDispatch();

  function handleJobForm(category: JOB_CATEGORY) {
    dispatch(setJobCategory(category));
    dispatch(setOpenJobForm(!openJobForm));
    dispatch(setOpenPostTab(false));
  }
  return (
    <>
      {openPostTab && <div className='absolute bottom-20 z-[200] md:hidden right-2 bg-background border-[1px] border-black flex flex-col gap-4 justify-center items-center p-3 w-[95%] mx-auto'>
        <button onClick={() => handleJobForm(JOB_CATEGORY.FULLTIME)} className='bg-[#30c972] text-white font-bold rounded-lg p-2 w-11/12 hover:scale-95 duration-300'>Post Fulltime Job</button>
        <button onClick={() => handleJobForm(JOB_CATEGORY.INTERNSHIP)} className='bg-[#142683] text-white font-bold rounded-lg p-2 w-11/12 hover:scale-95 duration-300'>Post Internship</button>
      </div>}
    </>
  );
};

export default PostTab;