'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useState } from 'react';

import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import EditJobFormModal from '@/components/EditJobFormModal/EditJobFormModal';
import JobCard from '@/components/JobCard/JobCard';
import ListingDrawer from '@/components/ListingDrawer/ListingDrawer';
import Loader from '@/components/Loader/Loader';
import { getAllFulltimeJobsByEmployerId, getAllInternshipsByEmployerId } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { USER_TYPE } from '@/utils/enums/UserType';

// const jobs = [
//   {
//     id: 1,
//     image: null,
//     title: 'Data Analyst Job',
//     company: 'Blitzpath',
//     address: 'Jabalpur, India',
//     skills: [
//       'Good Communication',
//       'Data Analysis',
//       'Excel',
//       'Project management',
//     ],
//     offer: '₹ 3 LPA - 3.6 LPA',
//     startDate: 'Immediate',
//     openings: 2,
//     experience: '3+ years',
//     probationPeriod: null,
//     noOfApplicants: '100+',
//     postedOn: '5d ago',
//     applyBy: '13 September 2024',
//     workType: 'Work From Home',
//     workLevel: 'Beginner',
//   },
//   {
//     id: 2,
//     image:
//       'https://production-cuvette.s3.ap-south-1.amazonaws.com/company/61812a1893e4a3a859e149e0/logo.jpg?d=1693567753460',
//     title: 'Fullstack Developer Job',
//     company: 'ZuPay',
//     address: 'Bangalore, India',
//     skills: ['NextJs', 'Javascript', 'MongoDB'],
//     offer: '₹ 4 LPA - 6 LPA',
//     startDate: 'Immediate',
//     openings: 1,
//     experience: '0-3 years',
//     probationPeriod: null,
//     noOfApplicants: '100+',
//     postedOn: '6d ago',
//     applyBy: '12 September 2024',
//     workType: 'Work From Home',
//     workLevel: 'Expert',
//   },
//   {
//     id: 3,
//     image:
//       'https://production-cuvette.s3.ap-south-1.amazonaws.com/company/65f1ff77c6f5a8fc88370314/logo.jpg?d=1710366126673',
//     title: 'Mobile App Developer Job',
//     company: 'Rivach',
//     address: 'Hyderabad, India',
//     skills: ['React Native', 'React.js', 'Git', 'REST'],
//     offer: '₹ 6 LPA - 6.6 LPA',
//     startDate: '5 Sept 24',
//     openings: 5,
//     experience: '0-3 years',
//     probationPeriod: '3 Months',
//     noOfApplicants: '100+',
//     postedOn: '2w ago',
//     applyBy: '1 September 2024',
//     workType: 'In-Office',
//     workLevel: 'Intermediate',
//   },

//   {
//     id: 4,
//     image:
//       'https://production-cuvette.s3.ap-south-1.amazonaws.com/company/65f1ff77c6f5a8fc88370314/logo.jpg?d=1710366126673',
//     title: 'Mobile App Developer Job',
//     company: 'Rivach',
//     address: 'Hyderabad, India',
//     skills: ['React Native', 'React.js', 'Git', 'REST'],
//     offer: '₹ 6 LPA - 6.6 LPA',
//     startDate: '5 Sept 24',
//     openings: 5,
//     experience: '0-3 years',
//     probationPeriod: '3 Months',
//     noOfApplicants: '100+',
//     postedOn: '2w ago',
//     applyBy: '1 September 2024',
//     workType: 'In-Office',
//     workLevel: 'Intermediate',
//   },
// ];

const FulltimeJobsPage = () => {
  const [jobCategory, setJobCategory] = useState('jobs');
  const employerId = useAppSelector((state) => state.userState.user?.id);
  const jobState = useAppSelector((state) => state.jobState);
  const user = useAppSelector((state) => state.userState.user);
  const { employerJobs, employerInternships, editJobForm, editJobDetails } = jobState;
  const dispatch = useAppDispatch();
  const router = useRouter();

  useLayoutEffect(() => {
    if(user && user.userType != USER_TYPE.EMPLOYER) {
      router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  async function getFulltimeJobs(employerId: number) {
    const response = await dispatch(getAllFulltimeJobsByEmployerId(employerId));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  async function getInternships(employerId: number) {
    const response = await dispatch(getAllInternshipsByEmployerId(employerId));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  useEffect(() => {
    if(user && user.userType == USER_TYPE.EMPLOYER && jobCategory == 'internships' && employerId) getInternships(employerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCategory, user]);


  useEffect(() => {
    if(user && user.userType == USER_TYPE.EMPLOYER && jobCategory == 'jobs' && employerId) getFulltimeJobs(employerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobCategory, user]);
  return (
    <>
      {!user ? (<Loader />) : (
        <div className={clsx(editJobForm && 'overflow-hidden')}>
          {editJobForm && editJobDetails && <EditJobFormModal { ...editJobDetails } />}
          <DashboardWrapper>
            <ListingDrawer jobCategory={jobCategory} setJobCategory={setJobCategory} />
            <div className='w-screen md:w-[calc(100dvw-260px)] h-full flex flex-col md:p-8 p-6 gap-8 sm:mt-0  no-scrollbar'>
              <div className='w-full flex flex-col gap-6 sm:gap-8'>
                <div className='w-full md:flex hidden gap-16'>
                  <div onClick={() => setJobCategory('jobs')} className='w-fit h-fit cursor-pointer group'>
                    <p className={clsx('text-2xl font-semibold', jobCategory == 'jobs' ? 'text-black' : 'text-neutral-500')}>My Jobs ({employerJobs ? employerJobs.length : 0})</p>
                    <div className={clsx('w-full h-[2.5px] bg-[#142683]', jobCategory == 'jobs' ? '' : 'scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300')}></div>
                  </div>
                  <div onClick={() => setJobCategory('internships')} className='w-fit h-fit cursor-pointer group'>
                    <p className={clsx('text-2xl font-semibold', jobCategory == 'internships' ? 'text-black' : 'text-neutral-500')}>My Internships ({employerInternships ? employerInternships.length : 0})</p>
                    <div className={clsx('w-full h-[2.5px] bg-[#142683]', jobCategory == 'internships' ? '' : 'scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300')}></div>
                  </div>
                </div>

                {jobCategory == 'jobs' && <div className='w-full h-[calc(100vh-200px)] pt-10 pb-20 overflow-y-auto mt-7 flex flex-col gap-6 sm:gap-8'>
                  {!employerJobs ? <Loader /> : employerJobs.length == 0 ? (
                    <div className='w-full flex justify-center items-center text-4xl h-full text-neutral-500 font-bold'>
                      No Full time Jobs Are Created Yet
                    </div>
                  ) : (
                    employerJobs.map((job) => (
                      <JobCard key={job.id} { ...job } />
                    ))
                  )}
                </div>}

                {jobCategory == 'internships' && <div className='w-full h-[calc(100vh-200px)] pt-10 pb-20 overflow-y-auto mt-7 flex flex-col gap-6 sm:gap-8'>
                  {!employerInternships ? <Loader /> : employerInternships.length == 0 ? (
                    <div className='w-full flex justify-center items-center text-4xl h-full text-neutral-500 font-bold'>
                      No Internships Are Created Yet
                    </div>
                  ) : (
                    employerInternships.map((job) => (
                      <JobCard key={job.id} { ...job } />
                    ))
                  )}
                </div>}
              </div>
            </div>
          </DashboardWrapper>
        </div>
      )}
    </>
  );
};

export default FulltimeJobsPage;
