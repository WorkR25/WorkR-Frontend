

import clsx from 'clsx';
import React from 'react';

import Drawer from '@/components/Drawer/Drawer';
import Navbar from '@/components/Navbar/Navbar';
import { useAppSelector } from '@/lib/hooks';

import CreateAdminModal from '../CreateAdminModal/CreateAdminModal';
import JobFormModal from '../JobFormModal/JobFormModal';
import PostTab from '../PostTab/PostTab';

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  const openJobForm = useAppSelector((state) => state.jobState.openJobForm);
  const editJobForm = useAppSelector((state) => state.jobState.editJobForm);
  const openAdminModal = useAppSelector((state) => state.userState.openAdminModal);
  return (
    <div className={clsx(openJobForm && 'overflow-hidden', editJobForm && 'overflow-hidden', openAdminModal && 'overflow-hidden')}>
      {openJobForm && <JobFormModal />}
      {openAdminModal && <CreateAdminModal />}
      <div className='flex w-full pt-24 overflow-x-hidden'>
        {/* {openJobForm && <EditProfile handleCancel={() => {}} />} */}
        <Navbar />
        <div>{children}</div>
        <Drawer />
      </div>
      <PostTab />
    </div>
  );
};

export default DashboardWrapper;
