'use client';

// import clsx from 'clsx';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

// import { TbArrowsDownUp } from 'react-icons/tb';
// import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import InternshipPageContent from '@/components/InternshipPageContent/InternshipPageContent';
// import JobCard from '@/components/JobCard/JobCard';
// import JobDrawer from '@/components/JobDrawer/JobDrawer';
// import Input from '@/components/Input/Input';
// import JobFilter from '@/components/JobFilter/JobFilter';
// import JobFilterMobile from '@/components/JobFilterMobile/JobFilterMobile';
import Loader from '@/components/Loader/Loader';
// import UserDetailsModal from '@/components/UserDetailsModalForApply/UserDetailsModal';
// import { clearAllQueryParams, getAllInternships, getAllInternshipsByFilter, setOpenFilter, setTitle } from '@/lib/features/jobs/jobSlice';
// import { clearToken } from '@/lib/features/users/authSlice';
// import { logout } from '@/lib/features/users/userSlice';
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { JobRequestByFilter } from '@/types';
// import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
// import { USER_TYPE } from '@/utils/enums/UserType';

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

const InternshipPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <InternshipPageContent />
    </Suspense>
  );
};

export default InternshipPage;
