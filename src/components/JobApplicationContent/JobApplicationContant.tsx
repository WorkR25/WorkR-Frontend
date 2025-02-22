'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useLayoutEffect } from 'react';

import Loader from '@/components/Loader/Loader';
import { getAllApplicants } from '@/lib/features/applications/applicationSlice';
import { getJobWithId } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { GetApplicantRequest } from '@/types';
import { getDateOfPost } from '@/utils';
import { USER_TYPE } from '@/utils/enums/UserType';

const JobApplicationContent: FC = () => {
  const queryParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const jobId = queryParams.get('jobId') as string;
  //   const userId = useAppSelector((state) => state.userState.user);
  const user = useAppSelector((state) => state.userState.user);
  const applications = useAppSelector((state) => state.applicationState.applications);
  const job = useAppSelector((state) => state.jobState.job);

  useLayoutEffect(() => {
    if(user && user.userType != USER_TYPE.EMPLOYER) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function getApplicants(userId: number, jobId: string) {
    const requestObject: GetApplicantRequest = {
      userId,
      jobId
    };
    
    const response = await dispatch(getAllApplicants(requestObject));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  async function getJobById(jobId: string) {
    const response = await dispatch(getJobWithId(jobId));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  useEffect(() => {
    if(user && user.userType == USER_TYPE.EMPLOYER) getJobById(jobId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, user]);

  useEffect(() => {
    if(user && user.userType == USER_TYPE.EMPLOYER) getApplicants(Number(user.id), jobId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, user]);
  return (
    <>
      {!user ? (<Loader />) : (
        <div className='pt-20'>
          {(!job || !applications) ? (<Loader />) : (
            <div className='p-4 md:p-8 flex flex-col md:gap-8 gap-4 overflow-scroll'>
              <div className='w-full border rounded-lg p-4 md:p-8 flex flex-col relative gap-4'>
                <div className='flex items-center gap-4 md:justify-start justify-between'>
                  <Image 
                    src={String(job.companyLogo)}
                    alt='alt'
                    className='rounded-full w-[64px] h-[64px] sm:order-1 order-2 object-cover aspect-square flex justify-center items-center'
                    width={64}
                    height={64}
                  />
    
                  <div className='flex flex-col gap-1 order-1 md:order-2'>
                    <p className='text-sm md:text-lg font-bold'>{job.jobTitle}</p>
                    <p className='text-slate-400 md:text-base text-xs'>
                      {job.companyName} | {job.officeLocation ? job.officeLocation : 'Work From Home'}
                    </p>
                    <p className='text-slate-400 md:text-base text-xs'>
                      {job.numberOfEmployees ? job.numberOfEmployees : user?.numberOfEmployees} employees
                    </p>
                  </div>
                </div>
    
                <p className='text-ankerblue md:text-base text-sm'>
                Posted {getDateOfPost((job.createdAt))}
                </p>
              </div>
            
              <div className='flex flex-col gap-4 w-full'>
                <div className='hidden md:grid grid-cols-5 items-center text-lg font-semibold px-7 py-3 bg-gray-100 rounded-md'>
                  {/* <p className='text-center'>Profile Image</p> */}
                  <p className='text-center'>Full Name</p>
                  <p className='text-center'>Email Address</p>
                  <p className='text-center'>Mobile Number</p>
                  <p className='text-center'>LinkedIn</p>
                  <p className='text-center'>Resume</p>
                </div>

                <div className='w-full h-[2px] bg-gray-300'></div>

                {(applications.length === 0) && (
                  <div className='flex justify-center items-center text-neutral-600 uppercase py-4'>
                      No Applications Yet
                  </div>
                )}

                {applications.length !== 0 &&
                applications.map((application) => (
                  <div key={application.email} className='border-b flex flex-col md:grid md:grid-cols-5 md:items-center md:px-5 md:py-3'>
                    {/* <div className='hidden md:flex justify-center'>
                      <Image
                        width={65}
                        height={65}
                        src={application.profileImage}
                        alt='Profile'
                        className='rounded-full w-[65px] h-[65px] object-cover aspect-square'
                      />
                    </div> */}

                    <div className='flex justify-between md:hidden pb-4'>
                      <div className='flex md:hidden flex-col gap-2'>
                        <p className='text-lg font-semibold'>{application.fullName}</p>
                        <p className='text-sm text-gray-500'>{application.email}</p>
                        <p className='text-sm text-gray-500'>{application.mobileNumber}</p>
                        <p
                          className='text-blue-600 hover:underline cursor-pointer'
                          onClick={() => window.open(application.linkedInProfile)}
                        >
                        Go To LinkedIn
                        </p>
        
                        <p
                          className='text-blue-600 hover:underline cursor-pointer'
                          onClick={() => window.open(application.resumeLink)}
                        >
                        Show Resume
                        </p>
                      </div>

                      <div className='flex justify-center'>
                        <Image
                          width={80}
                          height={80}
                          src={application.profileImage}
                          alt='Profile'
                          className='rounded-full w-[80px] h-[80px] object-cover aspect-square'
                        />
                      </div>
                    </div>

                    <p className='hidden justify-center md:flex text-lg font-semibold'>{application.fullName}</p>
                    <p className='hidden md:flex justify-center text-lg font-semibold'>{application.email}</p>
                    <p className='hidden md:flex justify-center text-lg font-semibold'>{application.mobileNumber}</p>
        
                    <button
                      className='text-blue-600 hover:underline hidden md:flex justify-center'
                      onClick={() => window.open(application.linkedInProfile)}
                    >
                        Go To LinkedIn
                    </button>

                    <button
                      className='text-blue-600 hover:underline hidden md:flex justify-center'
                      onClick={() => window.open(application.resumeLink)}
                    >
                        Show Resume
                    </button>
                  </div>
                ))}
              </div>


            </div>
          )}
        </div>
      )}
    </>
  );
};

export default JobApplicationContent;