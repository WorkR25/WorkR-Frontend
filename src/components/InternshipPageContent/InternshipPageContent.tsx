'use client';

import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';

// import { TbArrowsDownUp } from 'react-icons/tb';
import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import JobCard from '@/components/JobCard/JobCard';
import JobDrawer from '@/components/JobDrawer/JobDrawer';
// import Input from '@/components/Input/Input';
import JobFilter from '@/components/JobFilter/JobFilter';
import JobFilterMobile from '@/components/JobFilterMobile/JobFilterMobile';
import Loader from '@/components/Loader/Loader';
import UserDetailsModal from '@/components/UserDetailsModalForApply/UserDetailsModal';
import { clearAllQueryParams, getAllInternships, getAllInternshipsByFilter, setOpenFilter, setTitle } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { JobRequestByFilter } from '@/types';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
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

const InternshipPageContent = () => {
  const user = useAppSelector((state) => state.userState.user);
  const jobState = useAppSelector((state) => state.jobState);
  const openApplyModal = useAppSelector((state) => state.applicationState.openApplyModal);
  const { internships, officeType, experience, minSalary, title, internshipType, minStipend, openFilter } = jobState;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const queryParams = useSearchParams();

  useLayoutEffect(() => {
    if(user && user.userType == USER_TYPE.EMPLOYER) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  async function getInternships() {
    const response = await dispatch(getAllInternships());
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  async function getInternshipsJobsByFilter(query: JobRequestByFilter) {
    const response = await dispatch(getAllInternshipsByFilter(query));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  function handleMoreFilters() {
    const queryParams = new URLSearchParams(window.location.search);

    if(title.trim()) {
      queryParams.set('jobTitle', title.trim());
    }

    if(officeType) {
      queryParams.set('officeType', officeType);
    }

    if(experience) {
      queryParams.set('workExperience', experience);
    }

    if(minSalary) {
      queryParams.set('minSalary', minSalary);
    }

    if(internshipType) {
      queryParams.set('internshipType', internshipType);
    }

    if(minStipend) {
      let stipentAmount;
      if(minStipend.length == 2) {
        stipentAmount = Number(minStipend[0]) * 1000;
      } else {
        stipentAmount = Number(minStipend[0] + minStipend[1]) * 1000;
      }
      queryParams.set('minStipend', String(stipentAmount));
    }

    router.push(`${pathName}?${queryParams.toString()}`);
  }

  function clearParams() {
    dispatch(setOpenFilter(false));
    dispatch(clearAllQueryParams());
    router.push('/jobs/internship');
  }

  useEffect(() => {
    getInternships();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const jobTitle = queryParams.get('jobTitle') || '';
    const jobType = queryParams.get('officeType') || '';
    const workExperience = queryParams.get('workExperience') || '';
    const minSalary = queryParams.get('minSalary') || '';
    const minStipend = queryParams.get('minStipend') || '';
    const internshipType = queryParams.get('internshipType') || '';
    const responseObject: JobRequestByFilter = {
      jobTitle,
      jobType,
      workExperience,
      internshipType,
      minSalary: minSalary ? Number(minSalary) : minStipend ? Number(minStipend) : undefined
    };
    if(jobTitle || jobType || workExperience || minSalary || minStipend || internshipType) getInternshipsJobsByFilter(responseObject);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);
  return (
    <>
      {!user ? (<Loader />) : (
        <div className={clsx(openFilter && 'overflow-hidden', openApplyModal && 'overflow-hidden')}>
          {openFilter && <JobFilterMobile jobCategory={JOB_CATEGORY.FULLTIME} handleMoreFilters={handleMoreFilters} clearParams={clearParams} />}
          {openApplyModal && <UserDetailsModal />}
          <DashboardWrapper>
            <JobDrawer handleMoreFilters={handleMoreFilters} />
            <div className='w-screen md:w-[calc(100dvw-260px)] h-full flex flex-col xl:flex-row md:p-8 p-6 gap-8 sm:mt-0 mt-28 no-scrollbar'>
              <div className='w-full flex flex-col gap-6 sm:gap-8'>
                <div className='bg-background rounded-md p-6 w-full h-fit hidden sm:flex flex-col gap-4'>
                  <div className='flex items-center gap-4'>
                    <div className='flex flex-col gap-3 w-full'>
                      <div className='px-[10px] py-3 relative border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                        <input
                          type='text'
                          placeholder='Search by Internship Title'
                          className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                          value={title}
                          onChange={(e) => dispatch(setTitle(e.target.value))}
                        />

                        <button onClick={handleMoreFilters} className='bg-[#142683] absolute right-1 text-white font-semibold text-lg px-3 py-2 rounded-lg hover:scale-95 duration-300'>Search</button>
                      </div>
                    </div>
                  </div>
                  {internships && <p className='text-sm text-slate-500 ml-auto'>{`${internships.length} results Found`}</p>}
                </div>
                <div className='w-full h-[calc(100vh-200px)] pt-6 overflow-y-auto flex flex-col gap-6 sm:gap-8'>
                  {/* {jobs.map((job) => (
              <FTJobCard job={job} key={job.id} />
            ))} */}
                  {!internships ? <Loader /> : (
                    internships.map((job) => (
                      <JobCard key={job.id} { ...job } />
                    ))
                  )}
                </div>
              </div>
              <JobFilter jobCategory={JOB_CATEGORY.INTERNSHIP} handleMoreFilters={handleMoreFilters} clearParams={clearParams} />
            </div>
          </DashboardWrapper>
        </div>
      )}
    </>
  );
};

export default InternshipPageContent;
