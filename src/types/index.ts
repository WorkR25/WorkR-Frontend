import { JwtPayload } from 'jwt-decode';
import { z } from 'zod';

import { createAdminZodSchema, createJobSchema, onBoardingFormSchema, signinFormSchema, signupFormSchema, updateJobSchema } from '@/schemas/FormSchemas';
import { APPLICATION_STATUS } from '@/utils/enums/ApplicationStatus';
import { INTERNSHIP_TYPE } from '@/utils/enums/InternshipType';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { JOBSEEKER_TYPE } from '@/utils/enums/JobseekerType';
import { JOB_STATE } from '@/utils/enums/JobState';
import { JOB_TYPE } from '@/utils/enums/JobType';
import { USER_ROLE } from '@/utils/enums/UserRole';
import { USER_STATUS } from '@/utils/enums/UserStatus';
import { USER_TYPE } from '@/utils/enums/UserType';

export type SignupFormData = z.infer<typeof signupFormSchema>

export type SigninFormData = z.infer<typeof signinFormSchema>

export type OnboardingFormData = z.infer<typeof onBoardingFormSchema>

export type JobFormData = z.infer<typeof createJobSchema>

export type UpdateJobFormData = z.infer<typeof updateJobSchema>

export type CreateAdminData = z.infer<typeof createAdminZodSchema>

export type LoginResponse = {
    token: string
}

export interface SignupDetails {
    fullName: string
    email: string
    password: string
    mobileNumber: string
    userType: USER_TYPE
    companyName?: string
    designation?: string
}

export interface SigninDetails {
    email: string,
    password: string
}

export interface ApiError {
    success: false
    message: string
    data?: unknown
    error?: unknown
}

export interface SigninResponse {
    success: false
    message: string
    data: string
    error: unknown
}

export interface UserPayload extends JwtPayload {
    id: number
    email: string
}

export interface UserResponseObject {
    id: number
    fullName: string
    email: string
    password: string
    mobileNumber: string
    userType: USER_TYPE
    userStatus: USER_STATUS
    role: USER_ROLE
    companyName: string | null
    designation: string | null
    curreantCompany: string | undefined
    yearsOfExperience: string | null
    interestedDomain: string[] | null
    instituteName: string | undefined
    yearOfGarduation: string | null
    hometownState: string | undefined
    resumeLink: string | null
    profileImage: string |  undefined
    companyLogo: string | null
    companyWebsite: string | null
    githubProfile: string | null
    linkedInProfile: string | undefined
    twitterProfile: string | undefined
    numberOfEmployees: string | null
    industryType: string | null
    companyType: string | null
    companyAbout: string | null
    headquarterLocation: string | null
}

export interface UserResponse {
    data: UserResponseObject
}

export interface UserRequest {
    id: number
    token: string
}

export interface UserState {
    user: UserResponseObject | null
    openAdminModal: boolean,
    resumeLink: string
}

export interface JobseekerRequest {
    id: number
    jobseekerType: JOBSEEKER_TYPE,
    userStatus: USER_STATUS
    interestedDomain: string[] | undefined
    instituteName: string | undefined
    yearOfGraduation: number | undefined
    linkedInProfile: string | undefined
    currentCompany: string | undefined
    currentOfficeLocation: string | undefined
    yearsOfExperience: number | null
    twitterProfile: string | undefined
    hometownState: string | undefined
}

export interface EmployerRequest {
    id: number
    userStatus: USER_STATUS
    numberOfEmployees: string
    companyType: string
    companyAbout: string
    companyWebsite: string
    profileImage: string
    linkedInProfile: string
    headquarterLocation: string
    industryType: string,
    twitterProfile: string | undefined
}

export interface EmployerResponseObject {
    id: number
    fullName: string
    email: string
    numberOfEmployees: string
    companyType: string
    companyAbout: string
    companyWebsite: string
    linkedInProfile: string
    headquarterLocation: string
    twitterProfile: string | null
}

export interface EmployerResponse {
    data: EmployerResponseObject
}

export interface JobState {
    openJobForm: boolean
    editJobForm: boolean
    selectPost: boolean
    fulltimeJobs: JobResponseObject[] | null
    internships: JobResponseObject[] | null
    employerJobs: JobResponseObject[] | null
    employerInternships: JobResponseObject[] | null
    pendingJobs:  JobResponseObject[] | null
    jobCategory: JOB_CATEGORY
    job: JobResponseObject | null
    employer: EmployerResponseObject | null
    officeType: JOB_TYPE | string
    internshipType: INTERNSHIP_TYPE | string
    experience: string
    minSalary: string
    minStipend: string
    title: string
    openPostTab: boolean
    editJobDetails: JobResponseObject | null
    jobDrawerCategory: string
    openFilter: boolean
    defaultSalary: number
    defaultStipend: number
    jobIdForApply: string
    externalApplyLink: string
}

export interface JobRequest {
    employerId: number
    jobTitle: string
    requiredSkills: string[]
    minSalary: number
    maxSalary: number
    jobDescription: string
    jobType: JOB_TYPE
    jobCategory: JOB_CATEGORY
    internshipType?: INTERNSHIP_TYPE | string
    numberOfEmployees?: string
    companyAbout?: string,
    workExperience?: string
    companyName: string
    companyLogo: string
    officeLocation?: string
    applyLink?: string
}

export interface JobEditRequest {
    id: string
    employerId: number
    jobTitle: string
    requiredSkills: string[]
    minSalary: number
    maxSalary: number
    jobDescription: string
    jobType: JOB_TYPE
    jobCategory: JOB_CATEGORY
    internshipType?: INTERNSHIP_TYPE | string
    workExperience?: string
    companyName: string
    companyLogo: string
    numberOfEmployees?: string
    companyAbout?: string
    officeLocation?: string
    applyLink?: string
}

export interface JobResponseObject {
    id: string
    employerId: number
    jobState: JOB_STATE
    companyName: string
    companyLogo: string
    numberOfEmployees?: string
    officeLocation?: string
    jobTitle: string
    requiredSkills: string[]
    minSalary: number
    maxSalary: number
    jobDescription: string
    jobType: JOB_TYPE
    jobCategory: JOB_CATEGORY
    internshipType?: INTERNSHIP_TYPE
    workExperience?: string
    companyAbout?: string
    applyLink?: string
    createdAt: Date
    updatedAt: Date
}

export interface JobResponse {
    data: JobResponseObject[]
}

export interface SingleJobRespone {
    data: JobResponseObject
}

export interface JobRequestByFilter {
    jobTitle?: string
    jobType?: JOB_TYPE | string
    minSalary?: number
    workExperience?: string
    internshipType?: INTERNSHIP_TYPE | string
}

export interface ApproveJobRequest {
    jobId: string
    userId: number
}

export interface ResumeResponse {
    data: {
        resumeLink: string
    }
}

export interface UploadRequest {
    userId: number
    file: FormData
}

export interface UploadLogoResponse {
    data: string
}

export interface ApplicationResponseObject {
    id: string
    jobId: string
    applicantId: number
    applicationStatus: APPLICATION_STATUS
    appliedAt: Date
}

export interface ApplicationResponse {
    data: ApplicationResponseObject
}

export interface ApplicantResponseObject {
    profileImage: string
    fullName: string
    email: string
    mobileNumber: string
    resumeLink: string
    linkedInProfile: string
}

export interface ApplicantResponse {
    data: ApplicantResponseObject[]
}

export interface AppicationState {
    applications: ApplicantResponseObject[] | null
    openApplyModal: boolean
    application: ApplicationResponseObject | null
}

export interface ApplicationRequest {
    applicantId: number
    jobId: string
}

export interface GetApplicantRequest {
    userId: number,
    jobId: string
}