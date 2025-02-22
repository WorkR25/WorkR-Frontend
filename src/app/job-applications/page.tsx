'use client';

// import Image from 'next/image';
// import { useRouter, useSearchParams } from 'next/navigation';
import { FC, Suspense } from 'react';

import JobApplicationContent from '@/components/JobApplicationContent/JobApplicationContant';
import Loader from '@/components/Loader/Loader';
// import { getAllApplicants } from '@/lib/features/applications/applicationSlice';
// import { getJobWithId } from '@/lib/features/jobs/jobSlice';
// import { clearToken } from '@/lib/features/users/authSlice';
// import { logout } from '@/lib/features/users/userSlice';
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { GetApplicantRequest } from '@/types';
// import { getDateOfPost } from '@/utils';
// import { USER_TYPE } from '@/utils/enums/UserType';

const JobApplication: FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <JobApplicationContent />
    </Suspense>
  );
};

export default JobApplication;