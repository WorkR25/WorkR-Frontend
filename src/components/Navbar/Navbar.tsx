'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { MdPendingActions } from 'react-icons/md';

import { employerOptions, jobseekerOptions, MAX_FILE_SIZE } from '@/constants/constant';
import { setJobCategory, setOpenJobForm } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout, setOpenAdminModal, uploadResume } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { UploadRequest } from '@/types';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { USER_ROLE } from '@/utils/enums/UserRole';
import { USER_TYPE } from '@/utils/enums/UserType';

// import EditProfile from '../JobFormModal/JobFormModal';

const Navbar = () => {
  const userState = useAppSelector((state) => state.userState.user);
  const openJobForm = useAppSelector((state) => state.jobState.openJobForm);
  const dispatch = useAppDispatch();
  const router = useRouter();
  //   const [openJobForm, setOpenJobForm] = useState(false);
  const currentPath = usePathname();

  //   function handleFormModal() {
  //     setOpenJobForm(!openJobForm);
  //   }

  function handleJobForm(category: JOB_CATEGORY) {
    dispatch(setJobCategory(category));
    dispatch(setOpenJobForm(!openJobForm));
  }

  function handleCategory(categoryLink: string) {
    const category = categoryLink.split('/')[2];
    if(category == 'full-time') dispatch(setJobCategory(JOB_CATEGORY.FULLTIME));
    else dispatch(setJobCategory(JOB_CATEGORY.INTERNSHIP));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files || event.target.files.length == 0) return;

    const file = event.target.files[0];

    if(file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    if(file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds the 3MB limit');
      return;
    }

    const formData = new FormData();

    formData.append('file', file);

    const requestObject: UploadRequest = {
      userId: Number(userState?.id),
      file: formData
    };

    const res = await dispatch(uploadResume(requestObject));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  return (
    <div className='hidden md:flex flex-col border-r-[1px] overflow-hidden flex-1 max-w-64 min-w-64 h-auto min-h-svh py-8 gap-8'>
      {/* {openJobForm && <EditProfile handleCancel={handleFormModal} />} */}
      <div className='flex flex-col gap-4'>
        {userState?.userType == USER_TYPE.JOBSEEKER && (
          <>
            <div className='flex flex-col gap-4'>
              <input type='file' id='resume-upload' className='hidden' onChange={handleFileChange} />
              <div className='flex flex-col gap-2'>
                <label
                  htmlFor='resume-upload'
                  className='py-1 px-8 bg-ankerblue text-white font-semibold w-fit ml-12 rounded-md cursor-pointer'
                >
                  {userState.resumeLink ? 'Edit Resume' : 'Upload Resume'}
                </label> 
              </div>
            </div>
            {jobseekerOptions.map((Option, index) => (
              <Link href={Option.href} onClick={() => handleCategory(Option.href)} className='relative' key={index}>
                <button
                  className={clsx(
                    'flex flex-row items-center gap-2 ml-12 z-50',
                    currentPath == Option.href
                      ? 'text-ankerblue font-semibold'
                      : 'text-slate-500'
                  )}
                >
                  <Option.icon />
                  <p>{Option.title}</p>
                </button>
                {currentPath === Option.href && (
                  <div className='absolute bg-slate-100 h-9 -top-[25%] w-[calc(95%)] -z-10 rounded-r-full' />
                )}
              </Link>
            ))}
          </>
        )}

        {userState?.userType == USER_TYPE.EMPLOYER && (
          <>
            {currentPath == '/' && <div className='flex flex-col gap-5 items-center -mt-3'>
              <button onClick={() => handleJobForm(JOB_CATEGORY.FULLTIME)} className='bg-[#30c972] text-white font-bold rounded-lg p-2 w-8/12 hover:scale-95 duration-300'>Post Fulltime Job</button>
              <button onClick={() => handleJobForm(JOB_CATEGORY.INTERNSHIP)} className='bg-[#142683] text-white font-bold rounded-lg p-2 w-8/12 hover:scale-95 duration-300'>Post Internship</button>
              {userState.role == USER_ROLE.ADMIN && <button onClick={() => dispatch(setOpenAdminModal(true))} className='bg-[#9803fc] text-white font-bold rounded-lg p-2 w-8/12 hover:scale-95 duration-300'>Make Admin</button>}
            </div>}

            <div className='mt-2 flex flex-col gap-5'>
              {employerOptions.map((Option, index) => (
                <div className='relative' key={index}>
                  <button
                    className={clsx(
                      'flex flex-row items-center gap-2 ml-12 z-50',
                      currentPath == Option.href
                        ? 'text-ankerblue font-semibold'
                        : 'text-slate-500'
                    )}
                  >
                    <Option.icon />
                    <Link href={Option.href}>{Option.title}</Link>
                  </button>
                  {currentPath === Option.href && (
                    <div className='absolute bg-slate-100 h-9 -top-[25%] w-[calc(95%)] -z-10 rounded-r-full' />
                  )}
                </div>
              ))}

              {userState.role == USER_ROLE.ADMIN && (
                <div className='relative'>
                  <Link href={`/pending-jobs?userId=${userState.id}`} className={clsx(
                    'flex flex-row items-center gap-2 ml-12 z-50',
                    currentPath == '/pending-jobs'
                      ? 'text-ankerblue font-semibold'
                      : 'text-slate-500'
                  )}>
                    <MdPendingActions />
                    <p>Pending Jobs</p>
                  </Link>

                  {currentPath === '/pendingjobs' && (
                    <div className='absolute bg-slate-100 h-9 -top-[25%] w-[calc(95%)] -z-10 rounded-r-full' />
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
