'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { BsPeople } from 'react-icons/bs';
import { CiCalendar } from 'react-icons/ci';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoPersonCircleOutline } from 'react-icons/io5';
import { MdOutlineMail, MdPendingActions } from 'react-icons/md';
import { PiBuildingOffice } from 'react-icons/pi';
import { PiMoneyLight } from 'react-icons/pi';
import { RiSuitcaseLine } from 'react-icons/ri';

import Loader from '@/components/Loader/Loader';
import UserDetailsModal from '@/components/UserDetailsModalForApply/UserDetailsModal';
import { setOpenApplyModal } from '@/lib/features/applications/applicationSlice';
import { getEmployerWithId, getJobWithId, setExternalApplyLink, setJobId } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { getDateOfPost } from '@/utils';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { JOB_STATE } from '@/utils/enums/JobState';
import { USER_ROLE } from '@/utils/enums/UserRole';
import { USER_TYPE } from '@/utils/enums/UserType';

// import FTJobCard from '@/components/FTJobCard';
// import WorkLevel from '@/components/WorkLevel';

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
// ];

const Internship = () => {
  const user = useAppSelector((state) => state.userState.user);
  const jobState = useAppSelector((state) => state.jobState);
  const userRole = useAppSelector((state) => state.userState.user?.role);
  const userType = useAppSelector((state) => state.userState.user?.userType);
  const resume = useAppSelector((state) => state.userState.user?.resumeLink);
  const openApplyModal = useAppSelector((state) => state.applicationState.openApplyModal);
  const { job, employer } = jobState;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  // useLayoutEffect(() => {
  //   if(user && user.userType == USER_TYPE.EMPLOYER) {
  //     router.push('/');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user]);

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: job?.jobDescription || '<p>Loading...</p>',
    editable: false,
    immediatelyRender: false
  });

  const aboutEditor = useEditor({
    extensions: [StarterKit],
    content: employer?.companyAbout || '<p>Loading...</p>',
    editable: false,
    immediatelyRender: false
  });

  async function getJobById(id: string) {
    const response = await dispatch(getJobWithId(id));
    if(response.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  async function getEmployerById(id: number) {
    const response = await dispatch(getEmployerWithId(id));
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

    if(job?.applyLink) {
      dispatch(setExternalApplyLink(job.applyLink));
    }
    dispatch(setJobId(jobId));
    dispatch(setOpenApplyModal(true));
  }

  useEffect(() => {
    if(!job || job.id != jobId) {
      getJobById(jobId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  useEffect(() => {
    if(job && (!employer || employer.id != job.employerId)) {
      getEmployerById(job.employerId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job]);

  useEffect(() => {
    if (descriptionEditor && job?.jobDescription) {
      descriptionEditor.commands.setContent(job.jobDescription);
    }
  }, [descriptionEditor, job?.jobDescription]);

  useEffect(() => {
    if(aboutEditor && employer?.companyAbout) {
      aboutEditor.commands.setContent(employer.companyAbout);
    }
  }, [aboutEditor, employer?.companyAbout]);

  if((!job || job.id != jobId) && (!employer || employer.id != job?.employerId)) {
    return <Loader />;
  }
  return (
    <>
      {!user ? (<Loader />) : (
        <div className={clsx(openApplyModal && 'overflow-hidden')}>
          {openApplyModal && <UserDetailsModal />}
          <div className='pt-20'>
            {(!job || job.id != jobId) ? <Loader /> : (
              <div className='p-4 md:p-8 flex flex-col md:gap-8 gap-4 overflow-scroll'>
                <div className='w-full border rounded-lg p-4 md:p-8 flex flex-col relative gap-4'>
                  {/* <div className='absolute flex gap-4 -top-3 md:-top-4 md:right-8 right-4'>
            <div className='bg-white text-primarygreen border-primarygreen flex items-center border-[1px] gap-1 whitespace-nowrap md:rounded-md rounded-full py-[2px] md:text-base text-xs md:py-1 px-[10px]'>
              <p>Beginner</p>
            </div>
            <div className='whitespace-nowrap bg-subtleblue md:rounded-md border-[1px] border-ankerblue rounded-full text-ankerblue py-[2px] md:text-base text-xs md:py-1 px-[10px]'>
              In-Office
            </div>
          </div> */}
                  <div className='flex items-center gap-4 md:justify-start justify-between'>
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
                    <div className='flex flex-col gap-1 order-1 md:order-2'>
                      <p className='text-sm md:text-lg font-bold'>{job.jobTitle}</p>
                      <p className='text-slate-400 md:text-base text-xs'>
                        {job.companyName} | {job.officeLocation ? job.officeLocation : 'Work From Home'}
                      </p>
                    </div>
                    {/* <div className='ml-auto md:flex hidden items-start gap-4 order-3'>
              <button className='rounded-full items-center justify-center w-9 h-9 hover:bg-subtleblue flex'>
                <IoBookmarkOutline className='text-2xl text-ankerblue' />
              </button>
              <button className='rounded-full items-center justify-center w-9 h-9 hover:bg-subtleblue flex'>
                <GrShareOption className='text-2xl text-ankerblue' />
              </button>
            </div> */}
                  </div>
                  <div className='flex md:flex-row flex-col justify-between md:items-end items-start order-3 gap-4 w-full'>
                    <p className='text-ankerblue md:text-base text-sm'>
                Posted {getDateOfPost(job.createdAt)}
                    </p>
                    <div className='flex justify-between items-center md:w-fit w-full'>
                      {/* <div className='flex md:hidden items-start gap-4 mr-auto'>
                  <button className='rounded-full items-center justify-center hover:bg-subtleblue flex'>
                    <IoBookmarkOutline className='text-xl text-ankerblue' />
                  </button>
                  <button className='rounded-full items-center justify-center hover:bg-subtleblue flex'>
                    <GrShareOption className='text-xl text-ankerblue' />
                  </button>
                </div> */}
                      {userRole != USER_ROLE.ADMIN && <div className='flex gap-4 md:gap-6'>
                        <button onClick={applyJob} className='flex flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
                          <p className='font-semibold md:text-base text-sm'>
                    Apply Now
                          </p>
                        </button>
                      </div>}
                    </div>
                  </div>
                </div>
                <div className='md:flex border rounded-lg p-4 md:p-8 md:flex-row md:flex-wrap md:gap-0 gap-4 md:justify-around md:items-center grid grid-cols-2'>
                  <div className='flex flex-col gap-1'>
                    <div className='md:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                      <PiMoneyLight className='text-lg' />
                      <p>{job.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Offer': 'Stipend Per Month'}</p>
                    </div>
                    <p className='md:text-sm text-xs font-bold whitespace-nowrap'>
              ₹ {job.minSalary} {job.jobCategory == JOB_CATEGORY.FULLTIME && 'LPA'} - {job.maxSalary} {job.jobCategory == JOB_CATEGORY.FULLTIME && 'LPA'}
                    </p>
                  </div>
                  {job.jobCategory == JOB_CATEGORY.FULLTIME && <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />}
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
                  <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />
                  <div className='flex flex-col gap-1'>
                    <div className='md:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                      <BsPeople className='text-lg' />
                      <p>Office Type</p>
                    </div>
                    <p className='md:text-sm text-xs font-bold whitespace-nowrap'>
                      {job.jobType}
                    </p>
                  </div>
                  {job.jobCategory == JOB_CATEGORY.INTERNSHIP && <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />}
                  {job.jobCategory == JOB_CATEGORY.INTERNSHIP && (
                    <div className='flex flex-col gap-1'>
                      <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2'>
                        <PiBuildingOffice className='text-lg' />
                        <p>Intership Type</p>
                      </div>
                      <p className='sm:text-sm text-xs font-bold whitespace-nowrap'>
                        {job.internshipType}
                      </p>
                    </div>)}

                  {userType == USER_TYPE.EMPLOYER && <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />}
                  {userType == USER_TYPE.EMPLOYER && (
                    <div className='md:flex md:flex-col hidden gap-1'>
                      <div className='sm:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                        {job.jobState == JOB_STATE.PENDING ? <MdPendingActions className='text-lg' /> : <FaRegCircleCheck className='text-lg' />}
                        <p>Status</p>
                      </div>
                      <p className='sm:text-sm text-xs text-black font-bold whitespace-nowrap'>
                        {job.jobState}
                      </p>
                    </div>)}

                  {userRole == USER_ROLE.ADMIN && <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />}
                  {userRole == USER_ROLE.ADMIN && (
                    <div className='flex flex-col gap-1'>
                      <div className='md:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                        <IoPersonCircleOutline className='text-lg' />
                        <p>Recruiter Name</p>
                      </div>
                      <p className='md:text-sm text-xs font-bold whitespace-nowrap'>
                        {employer?.fullName}
                      </p>
                    </div>
                  )}
              
                  {userRole == USER_ROLE.ADMIN && <div className='w-[0.5px] h-10 bg-slate-300 hidden lg:block' />}
                  {userRole == USER_ROLE.ADMIN && (
                    <div className='flex flex-col gap-1'>
                      <div className='md:text-sm text-xs text-slate-400 flex items-center gap-2 whitespace-nowrap'>
                        <MdOutlineMail className='text-lg' />
                        <p>Recruiter Email</p>
                      </div>
                      <p className='md:text-sm text-xs font-bold whitespace-nowrap'>
                        {employer?.email}
                      </p>
                    </div>
                  )}
                </div>
                <div className='flex md:flex-row flex-col md:gap-8 gap-4'>
                  <div className='flex flex-col w-full md:gap-8 gap-4 md:order-1 order-2'>
                    <div className='w-full border rounded-lg p-4 md:p-8 flex flex-col gap-4'>
                      <p className='font-semibold text-xl'>{job.jobCategory == JOB_CATEGORY.FULLTIME ? 'About Job': 'About Internship'}</p>
                      {/* <p className='text-slate-500'>Requirements and skills</p>
                <ul className='list-disc text-slate-500 ml-4 w-full'>
                  <li>
                  Requirements and skills Technical expertise with data
                  interpretation, data analysis, project management and
                  operations
                  </li>
                  <li>Good Communication skills</li>
                  <li>Good in Excel</li>
                  <li>Great numerical and analytical skills</li>
                  <li>
                  Degree in Computer Science, IT, or similar field; a
                  Master&apos;s is a plus
                  </li>
                </ul> */}
                      <div className='text-neutral-500'>
                        <EditorContent 
                          className='outline-none text-neutral-500 text-base focus:outline-none h-full prose' 
                          editor={descriptionEditor} 
                        />
                      </div>
                    </div>
                    <div className='w-full border rounded-lg p-4 md:p-8 flex flex-col gap-8'>
                      <div className='flex flex-col gap-2'>
                        <p className='font-semibold'>About the Company</p>
                        <div className='flex justify-between items-start'>
                          <div className='flex flex-col'>
                            <p className='font-semibold text-slate-500'>{job.companyName}</p>
                            <p className='text-slate-500 text-sm'>
                              <span onClick={() => window.open(employer?.companyWebsite, '_blank')} className='text-ankerblue cursor-pointer'>Website</span> •{' '}
                              <span onClick={() => window.open(employer?.linkedInProfile, '_blank')} className='text-ankerblue cursor-pointer'>LinkedIn</span>
                            </p>
                          </div>
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
                        </div>
                      </div>
                      <p className='text-xs'>
                        {employer?.companyType} • {employer?.numberOfEmployees} employees
                        {/* <span className='bg-background text-ankerblue rounded-sm px-1 py-[2px]'>
                  1 Student hired
                  </span> */}
                      </p>
                      <div className='text-slate-500 text-sm'>
                        {/* Since our establishment in 2017, we have been committed to
                creating a platform that empowers individuals in remote areas to
                access IT job opportunities from their homes. With our
                innovative and flexible working model, we have successfully
                eliminated the need for relocation to metro cities to build a
                career in the industry */}
                        <EditorContent 
                          className='outline-none text-neutral-500 text-base focus:outline-none h-full prose' 
                          editor={aboutEditor} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className='md:max-w-[480px] md:order-2 order-1 w-full border h-fit rounded-lg p-4 md:p-8 flex flex-col gap-4'>
                    <p className='font-semibold'>Skills - Mandatory</p>
                    <div className='flex md:gap-6 gap-4 flex-wrap md:order-1 order-2'>
                      {job.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className='bg-background py-1 px-2 rounded-2xl text-slate-500 whitespace-nowrap md:text-base text-xs'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='flex flex-col md:gap-4 gap-2'>
                  {/* <p className='text-ankerblue text-lg md:text-xl font-medium'>
            Similar Jobs
            </p> */}
                  {/* <div className='w-full flex flex-nowrap overflow-scroll no-scrollbar z-50 gap-6 md:gap-8'>
          {jobs.map((job) => (
            <div key={job.id} className='min-w-fit'>
              <FTJobCard job={job} showBanner={false} />
            </div>
          ))}
        </div> */}
                </div>
              </div>)}
          </div>
        </div>
      )}
    </>
  );
};

export default Internship;
