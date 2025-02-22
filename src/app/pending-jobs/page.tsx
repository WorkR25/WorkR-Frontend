'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
import { FC, Suspense } from 'react';

// import DashboardWrapper from '@/components/DashboardWrapper/DashboardWrapper';
// import JobCard from '@/components/JobCard/JobCard';
import Loader from '@/components/Loader/Loader';
import PendingJobsPageContent from '@/components/PendingJobsPageContent/PendingJobsPageContent';
// import { getAllPendingJobs } from '@/lib/features/jobs/jobSlice';
// import { clearToken } from '@/lib/features/users/authSlice';
// import { logout } from '@/lib/features/users/userSlice';
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { USER_ROLE } from '@/utils/enums/UserRole';

const PendingJobs: FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PendingJobsPageContent />
    </Suspense>
  );
};

export default PendingJobs;