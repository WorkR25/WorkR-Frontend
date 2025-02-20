'use client';

// type FTJob = {
//   image: null | string;
//   title: string;
//   company: string;
//   address: string;
//   skills: string[];
//   offer: string;
//   startDate: string;
//   openings: number;
//   experience: string;
//   probationPeriod: null | string;
//   noOfApplicants: string;
//   postedOn: string;
//   applyBy: string;
//   workType: string;
//   workLevel: string;
// };
// import clsx from 'clsx';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { FC } from 'react';
import toast from 'react-hot-toast';
import { BsPeople } from 'react-icons/bs';
import { CiCalendar } from 'react-icons/ci';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { MdPendingActions } from 'react-icons/md';
// import { LiaBusinessTimeSolid } from 'react-icons/lia';
import { PiMoneyLight } from 'react-icons/pi';
import { RiSuitcaseLine } from 'react-icons/ri';

import { setOpenApplyModal } from '@/lib/features/applications/applicationSlice';
import { approveJob, setEditJobDetails, setEditJobForm, setExternalApplyLink, setJobId } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { ApproveJobRequest, JobResponseObject } from '@/types';
import { getDateOfPost } from '@/utils';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { JOB_STATE } from '@/utils/enums/JobState';
import { USER_ROLE } from '@/utils/enums/UserRole';
import { USER_TYPE } from '@/utils/enums/UserType';

// import WorkLevel from '@/components/WorkLevel';

const JobCard: FC<JobResponseObject> = (job) => {
  const userType = useAppSelector((state) => state.userState.user?.userType);
  const userRole = useAppSelector((state) => state.userState.user?.role);
  const userId = useAppSelector((state) => state.userState.user?.id);
  const resume = useAppSelector((state) => state.userState.user?.resumeLink);
  const dispatch = useAppDispatch();
  const pathName = usePathname();
  const router = useRouter();

  function formatStipend(minStipend: number, maxStipend: number) {
    const min = minStipend / 1000;
    const max = maxStipend / 1000;

    return `${min}K - ${max}K`;
  }

  function handleJobEdit() {
    dispatch(setEditJobDetails(job));
    dispatch(setEditJobForm(true));
  }

  function handleViewJobDetailsAdmin() {
    if(job.jobCategory == JOB_CATEGORY.FULLTIME) {
      router.push(`/jobs/full-time/${job.id}`);
    } else {
      router.push(`/jobs/internship/${job.id}`);
    }
  }

  async function makeApprove() {
    const requestObject: ApproveJobRequest = {
      userId: Number(userId),
      jobId: job.id
    };

    const response = await dispatch(approveJob(requestObject));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  function applyJob() {
    if(!resume) {
      toast.error('You have not uploaded your resume yet, upload it then apply');
      return;
    }

    if(job.applyLink) {
      dispatch(setExternalApplyLink(job.applyLink));
    }
    dispatch(setJobId(job.id));
    dispatch(setOpenApplyModal(true));
  }
  return (
    <>
      <div
        key={job.jobTitle}
        className='rounded-xl min-h-fit p-4 sm:p-6 flex flex-col gap-4 sm:gap-8 bg-white border-[1px] relative'
      >
        {/* {showBanner && (
        <div className='absolute flex gap-4 -top-3 sm:-top-4 sm:right-8 right-4'>
          <div
            className={clsx(
              'bg-white flex items-center border-[1px] gap-1 whitespace-nowrap sm:rounded-md rounded-full py-[2px] sm:text-base text-xs sm:py-1 px-[10px]',
              job.workLevel === 'Beginner'
                ? 'text-primarygreen border-primarygreen'
                : job.workLevel === 'Intermediate'
                  ? 'text-primaryorange border-primaryorange'
                  : 'text-primaryred border-primaryred'
            )}
          >
            <WorkLevel
              Level={{
                type: job.workLevel as 'Beginner' | 'Intermediate' | 'Expert',
              }}
            />
            <p>{job.workLevel}</p>
          </div>
          <div className='whitespace-nowrap bg-subtleblue sm:rounded-md border-[1px] border-ankerblue rounded-full text-ankerblue py-[2px] sm:text-base text-xs sm:py-1 px-[10px]'>
            {job.workType}
          </div>
        </div>
      )} */}
        <div className='flex items-center gap-4 sm:justify-start justify-between'>
          {job.companyLogo ? (
            <Image
              src={job.companyLogo}
              alt={job.companyName[0].toUpperCase()}
              className='sm:w-12 sm:h-12 w-9 h-9 rounded-full order-2 sm:order-1 object-cover'
              width={64}
              height={64}
            />
          ) : (
            <div className='rounded-full text-slate-300 text-2xl border-[1px] sm:w-12 sm:h-12 w-9 h-9 flex items-center justify-center order-2 sm:order-1'>
              <RiSuitcaseLine />
            </div>
          )}
          <div className='flex flex-col gap-1 order-1 sm:order-2'>
            <p className='text-sm sm:text-lg font-bold'>{job.jobTitle}</p>
            <p className='text-slate-400 sm:text-base text-xs'>
              {job.companyName} | {job.officeLocation ? job.officeLocation : 'Work From Home'}
            </p>
          </div>
          {/* <div className='ml-auto sm:flex hidden items-start gap-4 order-3'>
          <button className='rounded-full items-center justify-center w-9 h-9 hover:bg-subtleblue flex'>
            <IoBookmarkOutline className='text-2xl text-ankerblue' />
          </button>
          <button className='rounded-full items-center justify-center w-9 h-9 hover:bg-subtleblue flex'>
            <GrShareOption className='text-2xl text-ankerblue' />
          </button>
        </div> */}
        </div>
        <div className='flex sm:gap-6 gap-4 flex-wrap sm:order-1 order-2'>
          {job.requiredSkills.map((skill) => (
            <span
              key={skill}
              className='bg-background py-1 px-2 rounded-2xl text-slate-500 whitespace-nowrap sm:text-base text-xs'
            >
              {skill}
            </span>
          ))}
        </div>
        <div className='sm:flex sm:order-2 order-1 sm:flex-row sm:flex-wrap sm:gap-0 gap-10 sm:justify-around sm:items-center grid grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
              <PiMoneyLight className='text-lg' />
              <p>{job.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Offer': 'Stipend Per Month'}</p>
            </div>
            {job.jobCategory == JOB_CATEGORY.FULLTIME && (
              <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
              ₹ {job.minSalary}{job.jobCategory == JOB_CATEGORY.FULLTIME && 'LPA'} - {job.maxSalary}{job.jobCategory == JOB_CATEGORY.FULLTIME && 'LPA'}
              </p>)}

            {job.jobCategory == JOB_CATEGORY.INTERNSHIP && (
              <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
              ₹ {formatStipend(job.minSalary, job.maxSalary)}
              </p>)}
          </div>
          {job.jobCategory == JOB_CATEGORY.FULLTIME && <div className='w-[0.5px] h-full bg-slate-300 hidden lg:block' />}
          {job.jobCategory == JOB_CATEGORY.FULLTIME && (
            <div className='flex flex-col gap-1'>
              <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                <CiCalendar className='text-lg' />
                <p>Experience</p>
              </div>
              <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
                {job.workExperience} years
              </p>
            </div>)}
          <div className='w-[0.5px] h-full bg-slate-300 hidden lg:block' />
          <div className='md:flex md:flex-col hidden gap-1'>
            <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
              <BsPeople className='text-lg' />
              <p>Office Type</p>
            </div>
            <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
              {job.jobType}
            </p>
          </div>
          {job.jobCategory == JOB_CATEGORY.INTERNSHIP && <div className='w-[0.5px] h-full bg-slate-300 hidden lg:block' />}
          {job.jobCategory == JOB_CATEGORY.INTERNSHIP && (
            <div className='flex flex-col gap-1'>
              <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2'>
                <p>Intership Type</p>
              </div>
              <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
                {job.internshipType}
              </p>
            </div>)}

          {userType == USER_TYPE.EMPLOYER && <div className='w-[0.5px] h-full bg-slate-300 hidden lg:block' />}
          {userType == USER_TYPE.EMPLOYER && (
            <div className='md:flex md:flex-col hidden gap-1'>
              <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                {job.jobState == JOB_STATE.PENDING ? <MdPendingActions className='text-lg' /> : <FaRegCircleCheck className='text-lg' />}
                <p>Status</p>
              </div>
              <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
                {job.jobState}
              </p>
            </div>)}
          {/* {job.probationPeriod && (
          <div className='w-[0.5px] h-full bg-slate-300 hidden lg:block' />
        )}
        {job.probationPeriod && (
          <div className='flex flex-col gap-1'>
            <div className='sm:text-sm text-xs text-slate-400 flex items-start gap-2 whitespace-nowrap'>
              <LiaBusinessTimeSolid className='text-lg sm:block hidden' />
              <p>Probation Duration</p>
            </div>
            <p className='sm:text-sm text-xs text-slate-500 font-bold whitespace-nowrap'>
              {job.probationPeriod}
            </p>
          </div>
        )} */}
        </div>
        <div className='flex sm:flex-row flex-col justify-between order-3 gap-4'>
          <div className='flex mt-3 flex-col'>
            {/* <p className='text-ankerblue font-bold sm:text-sm text-xs'>
            {job.noOfApplicants} applicants
          </p> */}
            <p className='text-ankerblue font-light sm:text-sm text-xs'>
            Posted {getDateOfPost(job.createdAt)}
            </p>
          </div>
          <div className='flex justify-between items-center'>
            {/* <div className='flex sm:hidden items-start'>
              <button className='rounded-full items-center justify-center w-8 h-8 hover:bg-subtleblue flex'>
                <IoBookmarkOutline className='text-xl text-ankerblue' />
              </button>
              <button className='rounded-full items-center justify-center w-8 h-8 hover:bg-subtleblue flex'>
                <GrShareOption className='text-xl text-ankerblue' />
              </button>
            </div> */}
            <div className='flex gap-4'>
              {userType == USER_TYPE.JOBSEEKER && (
                <div className='flex gap-4 sm:gap-6'>
                  <button onClick={() => router.push(`${pathName}/${job.id}`)} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'>
                    <p className='font-medium sm:text-base text-sm'>View Details</p>
                  </button>
                  <button onClick={applyJob} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
                    <p className='font-semibold sm:text-base text-sm'>Apply Now</p>
                  </button>
                </div>)}

              {userType == USER_TYPE.EMPLOYER && pathName == '/my-listings' && (
                <div className='flex gap-4 sm:gap-6'>
                  <button onClick={handleJobEdit} className={clsx('flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md', (job.jobState == JOB_STATE.APPROVED && userRole != USER_ROLE.ADMIN) ? 'cursor-not-allowed pointer-events-none text-slate-300' : '')}>
                    <p className='font-medium sm:text-base text-sm'>Edit Details</p>
                  </button>
                  <Link href={`/job-applications?jobId=${job.id}`} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
                    <p className='font-semibold sm:text-base text-sm'>Show Applicants</p>
                  </Link>
                </div>)}

              {userRole == USER_ROLE.ADMIN && pathName == '/pending-jobs' && (
                <div className='flex gap-4 sm:gap-6'>
                  <button onClick={handleViewJobDetailsAdmin} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'>
                    <p className='font-medium sm:text-base text-sm'>View Details</p>
                  </button>
                  <button onClick={makeApprove} className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
                    <p className='font-semibold sm:text-base text-sm'>Approve</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobCard;
