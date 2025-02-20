'use client';

import clsx from 'clsx';
import { jwtDecode } from 'jwt-decode';
import {
  // Bell,
  ChevronDown,
  CircleHelp,
  LogOut,
  Settings,
  UserRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CiImageOn } from 'react-icons/ci';

// import Switcher from '@/components/Toggle/Switcher';
import { MAX_FILE_SIZE } from '@/constants/constant';
import { clearToken } from '@/lib/features/users/authSlice';
import { getUser, logout, uploadProfimeImage } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { UploadRequest, UserPayload, UserRequest } from '@/types';
// import { USER_STATUS } from '@/utils/enums/UserStatus';
import { USER_TYPE } from '@/utils/enums/UserType';
// import { USER_STATUS } from '@/utils/enums/UserStatus';
import Company from '~/images/companyLogo.png';

const Header = () => {
  const [open, setOpen] = React.useState(false);
  const userState = useAppSelector((state) => state.userState.user);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    setOpen(!open);
  };

  async function loadUser() {
    if(!localStorage.getItem('token')) {
      return;
    }
      
    const token = localStorage.getItem('token') as string;
    const tokenDetails = jwtDecode<UserPayload>(token);
      
    const userRequestObject: UserRequest = {
      id: tokenDetails.id,
      token
    };
    const res = await dispatch(getUser(userRequestObject));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
    }
  }
    
  useEffect(() => {
    async function load() {
      if(!userState) {
        await loadUser();
      }
      
      // if(userState?.userStatus == USER_STATUS.ACTIVE) {
      //   router.push('/');
      //   return;
      // }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  function logOut() {
    router.push('/signin');
    dispatch(logout());
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
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
  
    const res = await dispatch(uploadProfimeImage(requestObject));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
  }

  return (
    <>
      <nav className='w-[95%] rounded-full py-4 justify-between flex items-center pr-8 pl-[0.9rem] md:px-16 h-20 bg-[#f7f8fa] shadow-[0px_4px_6px_2px_rgba(0,_0,_0,_0.1)] border-[2px] fixed top-0 -translate-x-1/2 left-1/2 z-[997]'>
        {/* <a href='#' className='text-3xl tracking-widest'>
        <Company />
      </a> */}
        <Image src={Company} alt='company' width={62} className='absolute left-4' />
        {userState && (
          <div className='flex justify-center items-center md:gap-2 gap-4 w-1/5 absolute right-10' key={1}>
            <button
              onClick={handleOpen}
              className='flex relative hover:bg-background gap-4 items-center h-full p-2 sm:border-[1px] rounded-md bg-white'
            >
              <div className='flex text-xs sm:w-8 sm:h-8 w-12 h-12 rounded-full justify-center items-center bg-background text-black'>
                {userState.fullName[0]}
              </div>
              <p className='text-sm font-semibold sm:block hidden text-black'>{userState.fullName}</p>
              <ChevronDown size={18} className='sm:block hidden text-black' />
              <div
                className={clsx(
                  'absolute rounded-md bg-white border-[1px] p-6 flex flex-col gap-4 top-[calc(140%)] mt-0 right-0 z-50',
                  open ? 'flex' : 'hidden'
                )}
              >
                <div className='flex flex-col gap-4 text-black'>
                  <div className='flex items-center gap-2 hover:text-ankerblue cursor-pointer transition-all'>
                    <CiImageOn />
                    <div className='flex flex-col'>
                      <input type='file' id='profile-upload' className='hidden' onChange={handleFileChange} />
                      <label htmlFor='profile-upload' className='whitespace-nowrap cursor-pointer'>
                        {userState.profileImage ? userState.userType == USER_TYPE.JOBSEEKER ? 'Edit Profile Image' : 'Upload Profile Image' : userState.userType == USER_TYPE.EMPLOYER ? 'Edit Company Logo' : 'Upload Company Logo'}
                      </label>
                    </div>
                  </div>
                  {userState.resumeLink && <div className='flex items-center gap-2 hover:text-ankerblue cursor-pointer transition-all' onClick={() => window.open(String(userState.resumeLink))}>
                    <UserRound size={16} />
                    <p className='whitespace-nowrap'>
                  Show My Resume
                    </p>
                  </div>}
                  <div className='flex items-center gap-2 hover:text-ankerblue transition-all'>
                    <Settings size={16} />
                    <Link href='/settings' className='whitespace-nowrap'>
                  Account Settings
                    </Link>
                  </div>
                </div>
                <div className='w-full border-[0.5px]' />
                <div className='flex flex-col gap-4 text-black'>
                  {/* <div className='flex items-center gap-4 hover:text-ankerblue transition-all'>
                  <div className='flex items-center gap-2 hover:text-ankerblue transition-all'>
                    <Bell size={16} />
                    <p className='whitespace-nowrap'>Notifications</p>
                  </div>
                  <Switcher />
                </div> */}
                  <div className='flex items-center gap-2 hover:text-ankerblue transition-all'>
                    <CircleHelp size={16} />
                    <p className='whitespace-nowrap'>Suggestions / Help</p>
                  </div>
                  <div onClick={logOut} className='flex items-center gap-2 hover:text-ankerblue transition-all'>
                    <LogOut size={16} />
                    <p className='whitespace-nowrap'>Logout</p>
                  </div>
                </div>
              </div>
            </button>
            
            <Image
              width={52}
              height={52}
              src={userState.profileImage ? userState.profileImage : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
              alt='profile'
              className='rounded-full md:translate-x-8 w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
            />
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
