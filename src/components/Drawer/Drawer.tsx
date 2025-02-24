'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { GoHome } from 'react-icons/go';
import {
  MdOutlineAddBox, MdPendingActions
} from 'react-icons/md';
import {  RiAdminLine, RiSuitcaseLine } from 'react-icons/ri';

import { setOpenPostTab, setSelectPost } from '@/lib/features/jobs/jobSlice';
import { setOpenAdminModal } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { USER_ROLE } from '@/utils/enums/UserRole';
import { USER_TYPE } from '@/utils/enums/UserType';

// const options = [
//   {
//     id: 1,
//     title: 'Home',
//     iconOutlined: <GoHome />,
//     iconFilled: <RiHomeFill />,
//   },
//   {
//     id: 2,
//     title: 'Post',
//     iconOutlined: <MdOutlineAddBox />,
//     iconFilled: <MdOutlineAddBox />,
//   },
//   {
//     id: 3,
//     title: 'Jobs',
//     iconOutlined: <RiSuitcaseLine />,
//     iconFilled: <RiSuitcaseFill />,
//   },
// ];

const Drawer = () => {
  const [selected, setSelected] = React.useState('home');
  // const [selectPost, setSelectPost] = useState(false);
  const selectPost = useAppSelector((state) => state.jobState.selectPost);
  const openPostTab = useAppSelector((state) => state.jobState.openPostTab);
  const userType = useAppSelector((state) => state.userState.user?.userType);
  const userRole = useAppSelector((state) => state.userState.user?.role);
  const userState = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const pathName = usePathname();

  function handlePost() {
    dispatch(setSelectPost(!selectPost));
    dispatch(setOpenPostTab(!openPostTab));
  }

  return (
    <> 
      {userType == USER_TYPE.EMPLOYER && <div className={clsx('md:hidden fixed h-[70px] w-[70px] rounded-full bottom-12 left-1/2 -translate-x-1/2 z-[100] flex justify-center items-center', selectPost ? 'bg-[#5e9eff]' : 'bg-[#fff]')}>
        <div className={clsx(selectPost ? 'bg-[#0b66ef]' : 'bg-background', 'rounded-full aspect-square flex justify-center items-center h-[60px] w-[60px]')} onClick={handlePost}>
          <MdOutlineAddBox className={clsx('text-2xl font-bold', selectPost ?  'text-white' : 'text-black')} />
        </div>
      </div>}
      <div className='md:hidden h-20 fixed bottom-0 w-screen pb-1 bg-background max-md:flex'>
        {/* <div className='flex w-full justify-between'>
        <button>Home</button>
        <button>Post</button>
        <button>Jobs</button>
      </div> */}

        <Link href='/' onClick={() => setSelected('home')} className={clsx('flex flex-col text-xl items-center justify-center w-full h-full', pathName == '/' ? 'text-primaryblue font-semibold' : 'text-slate-500')}>
          <GoHome />
          <p className='text-xs'>Home</p>
        </Link>

        {userType == USER_TYPE.EMPLOYER && <Link href='/my-listings' onClick={() => setSelected('jobs')} className={clsx('flex flex-col text-xl items-center justify-center w-full h-full', pathName == '/my-listings' ? 'text-primaryblue font-semibold' : 'text-slate-500', userRole != USER_ROLE.ADMIN && 'order-3')}>
          <RiSuitcaseLine />
          <p className='text-xs'>My Jobs</p>
        </Link>}

        {userType == USER_TYPE.EMPLOYER && <button className={clsx('flex flex-col pt-5 text-xl items-center rounded-b-md justify-center w-full h-full', selected == 'post' ? 'text-primaryblue font-semibold' : 'text-slate-500',  userRole != USER_ROLE.ADMIN && 'order-2')}>
          <p className='text-xs'>Post</p>
        </button>}

        {userType == USER_TYPE.JOBSEEKER && <Link href='/jobs/full-time' className={clsx('flex flex-col text-xl items-center justify-center w-full h-full', (pathName == '/jobs/full-time' || pathName == '/jobs/internship') ? 'text-primaryblue font-semibold' : 'text-slate-500')}>
          <RiSuitcaseLine />
          <p className='text-xs'>Jobs</p>
        </Link>}

        {userRole == USER_ROLE.ADMIN && <div onClick={() => dispatch(setOpenAdminModal(true))} className={clsx('flex flex-col text-xl items-center justify-center w-full h-full text-slate-500')}>
          <RiAdminLine />
          <p className='text-xs'>Admin</p>
        </div>}

        {userRole == USER_ROLE.ADMIN && <Link href={`/pending-jobs?userId=${userState?.id}`} className={clsx('flex flex-col text-xl items-center justify-center w-full h-full', pathName == '/pending-jobs' ? 'text-primaryblue font-semibold' : 'text-slate-500')}>
          <MdPendingActions />
          <p className='text-xs'>Pending</p>
        </Link>}
        {/* {options.map((option, index) => (
        <button
          key={index}
          className={clsx(
            'flex flex-col text-xl items-center justify-center w-full h-full',
            selected === option.id
              ? 'text-primaryblue font-semibold'
              : 'text-slate-500'
          )}
          onClick={() => setSelected(option.id)}
        >
          {option.id === selected ? option.iconFilled : option.iconOutlined}
          <p className='text-xs'>{option.title}</p>
        </button>
      ))} */}
      </div>
    </> 

  );
};

export default Drawer;
