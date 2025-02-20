import { FiBarChart2 } from 'react-icons/fi';
import { RiSuitcaseLine } from 'react-icons/ri';

export const employeeOptions = [
  '2 - 10',
  '11 - 50',
  '51 - 200',
  '201 - 500',
];

export const companyTypeOption = [
  'Private Limited Company',
  'Government Agency',
  'Limited Partnership',
  'Public Company',
  'Partnership Firm',
  'Business Corporation'
];

export const industryTypeOption = [
  'Healthcare',
  'Retail',
  'Manufacturing',
  'Engineering',
  'Financial Services',
  'Education',
  'Information Technology and Services'
];

export const domainOptions = [
  'Backend Development',
  'Frontend Development',
  'Fullstack Development',
  'Blockchain Development',
  'Machine Learning',
  'Data Science',
  'Cyber Security',
  'Cloud Engineer',
  'DevOps Engineer',
  'Data Analyst',
  'Mobile App Development',
  'Game Development',
  'UI/UX Design',
  'Digital Marketing',
  'Product Management',
  'Network Engineer'
];

export const jobseekerOptions = [
  {
    id: 1,
    title: 'Dashboard',
    href: '/',
    icon: FiBarChart2,
  },
  {
    id: 2,
    title: 'Fulltime Jobs',
    href: '/jobs/full-time',
    icon: RiSuitcaseLine,
  },
  {
    id: 3,
    title: 'Internships',
    href: '/jobs/internship',
    icon: RiSuitcaseLine,
  },
];

export const employerOptions = [
  {
    id: 1,
    title: 'Dashboard',
    href: '/',
    icon: FiBarChart2,
  },
  {
    id: 2,
    title: 'My Jobs',
    href: '/my-listings',
    icon: RiSuitcaseLine,
  },
];

export const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const defaultDescription = `
<h4>Responsibilities</h4>
<ul>
  <li>What will be the responsibilities of the employee?</li>
</ul>

<h4>Requirements</h4>
<ul>
  <li>What are you looking for in an employee? (Skills, Work experience, Open source contributor, etc.)</li>
</ul>

<h4>Hiring Process</h4>
<ul>
  <li>What are the steps of your hiring process?</li>
</ul>
`;