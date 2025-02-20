'use client';


// import { jwtDecode } from 'jwt-decode';
// import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaBolt } from 'react-icons/fa';

import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
import Loader from '@/components/Loader/Loader';
// import EditJobFormModal from '@/components/EditJobFormModal/EditJobFormModal';
import { MAX_FILE_SIZE } from '@/constants/constant';
// import JobDrawer from '@/components/ListingDrawer/ListingDrawer';
// import { setJobCategory, setOpenJobForm, setOpenPostTab } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout, uploadResume } from '@/lib/features/users/userSlice';
// import EditProfile from '@/components/JobFormModal/JobFormModal';
// import { clearToken } from '@/lib/features/users/authSlice';
// import { getUser, logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { UploadRequest } from '@/types';
// import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
// import { UserPayload, UserRequest } from '@/types';
import { USER_STATUS } from '@/utils/enums/UserStatus';
import { USER_TYPE } from '@/utils/enums/UserType';

// const courses = [
//   {
//     id: 1,
//     title: 'Introduction to Python',
//     description: 'Python is a high-level, interpreted programming language.',
//     image: 'https://cuvette.tech/app/static/media/cgipBannerTest.1bef02ff.jpg',
//     primary: 'bg-ankerblue',
//     secondary: 'bg-subtleblue',
//   },
//   {
//     id: 2,
//     title: 'Introduction to JavaScript',
//     description:
//       'JavaScript is a high-level, interpreted programming language.',
//     image: 'https://cuvette.tech/app/static/media/dataScience.36dd03b9.jpg',
//     primary: 'bg-orange',
//     secondary: 'bg-subtleorange',
//   },
// ];

const DashboardPage = () => {
  const userState = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const router = useRouter();


  useEffect(() => {
    if(!userState) {
      router.push('/signin');
      return;
    }
    if(userState) {
      if(userState.userStatus != USER_STATUS.ACTIVE) {
        router.push('/onboarding');
      }
    }
  }, [userState, router]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.stopPropagation();

    if(!event.target.files || event.target.files.length == 0) return;
  
    const file = event.target.files[0];
  
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
    <>
      {!userState ? (<Loader />) : (
        <DashboardWrapper>
          {/* <JobDrawer /> */}
          {userState?.userType == USER_TYPE.JOBSEEKER && <div className='sm:hidden h-fit p-4 fixed w-screen bg-background border-none flex flex-row'>
            <input type='file' id='resume-mobile-upload' className='hidden' onChange={handleFileChange} />
            <label
              htmlFor='resume-mobile-upload'
              className='w-full p-2 bg-ankerblue text-white font-semibold border-none cursor-pointer rounded-md text-center'
              onClick={(e) => e.stopPropagation()}
            >
              {userState.resumeLink ? 'Edit Resume' : 'Upload Resume'}
            </label> 
          </div>}
          <div className='flex flex-col xl:flex-row p-8 gap-8 w-full mt-12 mb-20 sm:mb-0 sm:mt-0'>
            <div className='flex flex-col w-full gap-6 order-2 xl:order-1'>
              <div className='text-xl flex items-center gap-2'>
                <h1 className='text-xl'>Trending</h1>
                <FaBolt className='text-primaryyellow' />
              </div>
              {/* <div className='grid sm:grid-cols-2 grid-cols-1 gap-8'>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={clsx(
                    'flex gap-4 flex-col p-4 rounded-md min-h-80',
                    course.secondary
                  )}
                >
                  <Image
                    src={course.image}
                    alt={course.title}
                    className='h-48 w-full object-fill rounded-md'
                    width={400}
                    height={400}
                  />
                  <div>
                    <h1 className='text-base font-semibold'>{course.title}</h1>
                    <p>{course.description}</p>
                  </div>
                  <button
                    className={clsx(
                      'rounded-2xl py-1 px-8 w-fit text-white font-semibold ml-auto',
                      course.primary
                    )}
                  >
                  View Details
                  </button>
                </div>
              ))}
            </div> */}
            </div>
            {/* <div className='h-20 flex items-center justify-center text-primaryblue xl:h-screen w-full order-1 xl:order-2 bg-background xl:max-w-80 rounded-md max-h-[calc(80vh)]'>
            <p className='text-xl font-bold'>3150 Students placed 🎉</p>
          </div> */}
          </div>
        </DashboardWrapper>
      )}
    </>
  );
};

export default DashboardPage;
