import { z } from 'zod';

import { INTERNSHIP_TYPE } from '@/utils/enums/InternshipType';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
// import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { JOBSEEKER_TYPE } from '@/utils/enums/JobseekerType';
import { JOB_TYPE } from '@/utils/enums/JobType';
// import { JOB_TYPE } from '@/utils/enums/JobType';
import { USER_TYPE } from '@/utils/enums/UserType';

export const signupFormSchema = z.object({
  fullName: z.string().min(1, 'Full Name cannot be empty'),
  email: z.string().email('Invalid Email Address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
  mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
  userType: z.nativeEnum(USER_TYPE, { required_error: 'User Type is required' }),
  companyName: z.string().optional(),
  designation: z.string().optional()
}).refine((data) => data.password == data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.userType == USER_TYPE.EMPLOYER && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: 'Company Name is required',
  path: ['companyName'],
}).refine((data) => {
  if (data.userType == USER_TYPE.EMPLOYER && !data.designation) {
    return false;
  }
  return true;
}, {
  message: 'Designation is required',
  path: ['designation'],
});


export const signinFormSchema = z.object({
  email: z.string().email('Invalid Email Address'),
  password: z.string().min(1, 'Password is required')
});

export const onBoardingFormSchema = z
  .object({
    jobseekerType: z.nativeEnum(JOBSEEKER_TYPE).optional(),
    userType: z.nativeEnum(USER_TYPE),
    yearOfGraduation: z.string().optional(),
    instituteName: z.string().optional(),
    hometownState: z.string().optional(),
    currentCompany: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    currentOfficeLocation: z.string().optional(),
    linkedInProfile: z.string().min(1, 'Linked Profile is required'),
    twitterProfile: z.string().optional(),
    githubProfile: z.string().optional(),
    numberOfEmployees: z.string().optional(),
    companyType: z.string().optional(),
    industryType: z.string().optional(),
    profileImage: z.string().optional(),
    companyAbout: z.string().optional(),
    companyWebsite: z.string().optional(),
    headquarterLocation: z.string().optional(),
  })

  // ✅ Validate FRESHER jobseeker fields
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.FRESHER) {
      return !!data.yearOfGraduation;
    }
    return true;
  }, {
    message: 'Year of graduation is required for Freshers.',
    path: ['yearOfGraduation'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.FRESHER) {
      return !!data.instituteName;
    }
    return true;
  }, {
    message: 'Institute name is required for Freshers.',
    path: ['instituteName'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.FRESHER) {
      return !!data.hometownState;
    }
    return true;
  }, {
    message: 'Hometown state is required for Freshers.',
    path: ['hometownState'],
  })

  // ✅ Validate EXPERIENCED jobseeker fields
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.EXPERIENCED) {
      return !!data.currentCompany;
    }
    return true;
  }, {
    message: 'Current company is required for Experienced jobseekers.',
    path: ['currentCompany'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.EXPERIENCED) {
      return !!data.yearsOfExperience;
    }
    return true;
  }, {
    message: 'Years of experience is required for Experienced jobseekers.',
    path: ['yearsOfExperience'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.JOBSEEKER && data.jobseekerType === JOBSEEKER_TYPE.EXPERIENCED) {
      return !!data.currentOfficeLocation;
    }
    return true;
  }, {
    message: 'Current office location is required for Experienced jobseekers.',
    path: ['currentOfficeLocation'],
  })

  // ✅ Validate EMPLOYER fields
  .refine((data) => {
    if (data.userType === USER_TYPE.EMPLOYER) {
      return !!data.numberOfEmployees;
    }
    return true;
  }, {
    message: 'Number of employees is required for Employers.',
    path: ['numberOfEmployees'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.EMPLOYER) {
      return !!data.companyType;
    }
    return true;
  }, {
    message: 'Company type is required for Employers.',
    path: ['companyType'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.EMPLOYER) {
      return !!data.companyAbout;
    }
    return true;
  }, {
    message: 'Company about section is required for Employers.',
    path: ['companyAbout'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.EMPLOYER) {
      return !!data.companyWebsite;
    }
    return true;
  }, {
    message: 'Company website is required for Employers.',
    path: ['companyWebsite'],
  })
  .refine((data) => {
    if (data.userType === USER_TYPE.EMPLOYER) {
      return !!data.headquarterLocation;
    }
    return true;
  }, {
    message: 'Headquarter location is required for Employers.',
    path: ['headquarterLocation'],
  })
  .refine((data) => {
    if(data.userType == USER_TYPE.EMPLOYER) {
      return !!data.industryType;
    }
    return true;
  }, {
    message: 'Industry Type is required for Employers,',
    path: ['industryType']
  });


export const createJobSchema = z.object({
  employerId: z.number(),
  jobTitle: z.string().min(1, 'Job Title cannot be empty'),
  requiredSkills: z.array(z.string()).min(1, 'Atleast 1 skill is required for a job').refine((skills) => new Set(skills).size == skills.length, 'This skill is already present'),
  minSalary: z.string().min(1, 'Minimum Salary is required'),
  maxSalary: z.string().min(1, 'Maximum Salary is required'),
  jobDescription: z.string().min(1, 'Job Description is required'),
  jobType: z.nativeEnum(JOB_TYPE).refine((value) => value != undefined, {
    message: 'Office Type is required'
  }),
  jobCategory: z.nativeEnum(JOB_CATEGORY).refine((value) => value != undefined, {
    message: 'Job Category is required'
  }),
  internshipType: z.nativeEnum(INTERNSHIP_TYPE).optional(),
  workExperience: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  companyAbout: z.string().optional(),
  officeLocation: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  applyLink: z.string().optional()
})
  .refine((data) => {
    if(data.jobType == JOB_TYPE.IN_OFFICE && !data.officeLocation) {
      return false;
    }
    return true;
  }, {
    message: 'Office Location is required for In-Office Jobs',
    path: ['officeLocation']
  })
  .refine((data) => {
    if(data.jobCategory == JOB_CATEGORY.FULLTIME && !data.workExperience) {
      return false;
    }
    return true;
  }, {
    message: 'Work Experience is required for fulltime jobs',
    path: ['workExperience']
  });

export const updateJobSchema = z.object({
  id: z.string(),
  employerId: z.number(),
  jobTitle: z.string().min(1, 'Job Title cannot be empty'),
  requiredSkills: z.array(z.string()).min(1, 'Atleast 1 skill is required for a job').refine((skills) => new Set(skills).size == skills.length, 'This skill is already present'),
  minSalary: z.string().min(1, 'Minimum Salary is required'),
  maxSalary: z.string().min(1, 'Maximum Salary is required'),
  jobDescription: z.string().min(1, 'Job Description is required'),
  jobType: z.nativeEnum(JOB_TYPE).refine((value) => value != undefined, {
    message: 'Office Type is required'
  }),
  jobCategory: z.nativeEnum(JOB_CATEGORY).refine((value) => value != undefined, {
    message: 'Job Category is required'
  }),
  internshipType: z.nativeEnum(INTERNSHIP_TYPE).optional(),
  workExperience: z.string().optional(),
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  companyAbout: z.string().optional(),
  numberOfEmployees: z.string().optional(),
  officeLocation: z.string().optional(),
  applyLink: z.string().optional()
})
  .refine((data) => {
    if(data.jobType == JOB_TYPE.IN_OFFICE && !data.officeLocation) {
      return false;
    }
    return true;
  }, {
    message: 'Office Location is required for In-Office Jobs',
    path: ['officeLocation']
  })
  .refine((data) => {
    if(data.jobCategory == JOB_CATEGORY.FULLTIME && !data.workExperience) {
      return false;
    }
    return true;
  }, {
    message: 'Work Experience is required for fullName jobs',
    path: ['workExperience']
  });

export const createAdminZodSchema = z.object({
  adminEmail: z.string().min(1, 'Admin Email is required').email('Invalid Email Address'),
  employerEmail: z.string().min(1, 'Employer Email is required').email('Invalid Email Address')
});