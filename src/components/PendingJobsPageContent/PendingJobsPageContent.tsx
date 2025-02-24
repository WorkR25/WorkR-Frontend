'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useEffect, useLayoutEffect } from 'react';

import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import JobCard from '@/components/JobCard/JobCard';
import Loader from '@/components/Loader/Loader';
import { getAllPendingJobs } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { USER_ROLE } from '@/utils/enums/UserRole';

const PendingJobsPageContent: FC = () => {
  const queryParams = useSearchParams();
  const userId = Number(queryParams.get('userId'));
  const pendingjobs = useAppSelector((state) => state.jobState.pendingJobs);
  const user = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useLayoutEffect(() => {
    if(user && user.role != USER_ROLE.ADMIN) {
      router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function getPendingJobs(userId: number) {
    const response = await dispatch(getAllPendingJobs(userId));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  useEffect(() => {
    if(user && user.role == USER_ROLE.ADMIN) getPendingJobs(userId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return (
    <>
      {!user ? (<Loader />) : (
        <div>
          <DashboardWrapper>
            <div className='w-screen md:w-[calc(100dvw-260px)] h-full flex flex-col md:p-8 pt-6 px-6 pb-12 gap-8 sm:mt-0  no-scrollbar'>
              <div className='w-full flex flex-col gap-6 sm:gap-8'>
                <p className='sm:text-4xl text-2xl font-semibold mx-auto'>
                All Pending Jobs ({pendingjobs ? pendingjobs.length : 0})
                </p>

                {pendingjobs?.length == 0 && (
                  <div className='text-gray-500 sm:text-4xl text-2xl font-semibold w-full h-full flex justify-center items-center'>
                    <p>No More Pending Jobs Are Left</p>
                  </div>
                )}

                <div className='w-full h-[calc(100vh-280px)] pt-6 pb-8 overflow-y-auto mt-7 flex flex-col gap-6 sm:gap-8'>
                  {!pendingjobs ? <Loader /> : (
                    pendingjobs.map((job) => (
                      <JobCard key={job.id} { ...job } />
                    ))
                  )}
                </div>
              </div>
            </div>
          </DashboardWrapper>
        </div>
      )}
    </>
  );
};

export default PendingJobsPageContent;