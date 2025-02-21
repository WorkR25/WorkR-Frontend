'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent,useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Controller,SubmitHandler,useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '@/components/Input/Input';
import Loader from '@/components/Loader/Loader';
import { companyTypeOption, domainOptions, employeeOptions, industryTypeOption, MAX_FILE_SIZE } from '@/constants/constant';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout, updateJobseeker, updtaeEmployer, uploadProfimeImage } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { onBoardingFormSchema } from '@/schemas/FormSchemas';
import { EmployerRequest, JobseekerRequest, OnboardingFormData, UploadRequest } from '@/types';
import { JOBSEEKER_TYPE } from '@/utils/enums/JobseekerType';
import { USER_STATUS } from '@/utils/enums/UserStatus';
import { USER_TYPE } from '@/utils/enums/UserType';


export default function OnboardingPage() {
  const userState = useAppSelector((state) => state.userState.user);
  const dispatch = useAppDispatch();
  const [jobseekerType, setJobseekerType] = useState(JOBSEEKER_TYPE.FRESHER);
  const [interestedDomain, setInterestedDomain] = useState<string[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    if(!userState) {
      router.push('/signin');
      return;
    }
    if(userState?.userStatus == USER_STATUS.ACTIVE) {
      router.push('/');
      return;
    }
  }, [router, userState]);

  const { register, setValue, getValues, control, formState: { errors }, handleSubmit, reset } = useForm<OnboardingFormData>({
    resolver: zodResolver(onBoardingFormSchema),
    defaultValues: {
      userType: userState?.userType,
      jobseekerType: userState?.userType == USER_TYPE.JOBSEEKER ? jobseekerType : undefined,
      yearOfGraduation: undefined,
      instituteName: undefined,
      hometownState: undefined,
      currentCompany: undefined,
      yearsOfExperience: undefined,
      currentOfficeLocation: undefined,
      linkedInProfile: '',
      twitterProfile: undefined,
      numberOfEmployees: undefined,
      companyType: undefined,
      industryType: '',
      companyAbout: '',
      profileImage: userState?.profileImage ? String(userState.profileImage) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg',
      companyWebsite: undefined,
      headquarterLocation: undefined
    }
  });

  useEffect(() => {
    reset({
      userType: userState?.userType,
      jobseekerType: userState?.userType == USER_TYPE.JOBSEEKER ? jobseekerType : undefined,
      yearOfGraduation: undefined,
      instituteName: undefined,
      hometownState: undefined,
      currentCompany: undefined,
      yearsOfExperience: undefined,
      currentOfficeLocation: undefined,
      linkedInProfile: '',
      twitterProfile: undefined,
      numberOfEmployees: undefined,
      companyType: undefined,
      industryType: '',
      companyAbout: undefined,
      profileImage: userState?.profileImage ? String(userState.profileImage) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg',
      companyWebsite: undefined,
      headquarterLocation: undefined
    });
  }, [jobseekerType, reset, userState?.profileImage, userState?.userType]);

  //   useEffect(() => {
  //     if(!userState) {
  //       router.push('/signin');
  //       return;
  //     }
  
  //     if(userState.userStatus == USER_STATUS.ACTIVE) {
  //       router.push('/');
  //       return;
  //     }

  //   }, [userState, router]);

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList, OrderedList, ListItem, ListKeymap, Placeholder.configure({ placeholder: 'Write About Your Company...' })],
    content: '',
    onUpdate: ({ editor }) => {
      setValue('companyAbout', editor.getHTML(), { shouldValidate: true });
    },
    immediatelyRender: false
  });

  function handleDomain(event: ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value;

    if(selectedValue && !interestedDomain.includes(selectedValue)) {
      setInterestedDomain([...interestedDomain, selectedValue]);
    }
  }
  const handleUserTypeToggle = (type: JOBSEEKER_TYPE) => {
    setJobseekerType(type);
  };

  const onSubmit: SubmitHandler<OnboardingFormData> = async () => {
    if(userState) {
      if(userState.userType == USER_TYPE.JOBSEEKER) {
        const userRequestObject: JobseekerRequest = {
          id: userState.id,
          jobseekerType,
          interestedDomain,
          userStatus: USER_STATUS.ACTIVE,
          instituteName: getValues('instituteName') ? String(getValues('instituteName')) : null,
          yearOfGraduation: Number(getValues('yearOfGraduation')),
          linkedInProfile: getValues('linkedInProfile') ? String(getValues('linkedInProfile')) : null,
          twitterProfile: getValues('twitterProfile') ? String(getValues('twitterProfile')) : null,
          currentCompany: getValues('currentCompany') ? String(getValues('currentCompany')) : null,
          yearsOfExperience: Number(getValues('yearsOfExperience')),
          hometownState: getValues('hometownState') ? String(getValues('hometownState')) : null,
          currentOfficeLocation: getValues('currentOfficeLocation') ? String(getValues('currentOfficeLocation')) : null
        };
      
        const res = await dispatch(updateJobseeker(userRequestObject));
        if(res.payload?.data == 401) {
          router.push('/signin');
          dispatch(clearToken());
          dispatch(logout());
          return;
        }
      } else {
        const userRequestObject: EmployerRequest =  {
          id: userState.id,
          profileImage: String(getValues('profileImage')),
          userStatus: USER_STATUS.ACTIVE,
          numberOfEmployees: String(getValues('numberOfEmployees')),
          companyType: String(getValues('companyType')),
          companyAbout: String(getValues('companyAbout')),
          companyWebsite: String(getValues('companyWebsite')),
          linkedInProfile: String(getValues('linkedInProfile')),
          headquarterLocation: String(getValues('headquarterLocation')),
          industryType: String(getValues('industryType')),
          twitterProfile: getValues('twitterProfile') ? String(getValues('twitterProfile')) : null
        };

        const res = await dispatch(updtaeEmployer(userRequestObject));
        if(res.payload?.data == 401) {
          router.push('/signin');
          dispatch(clearToken());
          dispatch(logout());
          return;
        }
      }
      router.push('/');
    }
  };

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files || event.target.files.length == 0) return;
  
    const file = event.target.files[0];

    const allowedTypes = [ 
      'image/jpeg',    
      'image/png',      
      'image/x-icon'
    ];

    if(!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, JPEG, PNG, and ICO files are allowed');
      return;
    }
  
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
      {!userState ? (<Loader />) : (
        <div className='md:p-16 flex flex-col md:gap-12 overflow-hidden'>
          <div className='bg-background mt-20 flex flex-row p-8 rounded-md justify-between items-center'>
            <div className='flex flex-col'>
              <h1 className='font-bold text-base'>Hi, {userState?.fullName}{userState?.companyName ? `(${userState.companyName})` : ''}</h1>
              <h2 className='text-base font-light'>
                Welcome to WorkR, Let&apos;s get started by setting up your profile
              </h2>
            </div>

            <button type='submit' onClick={handleSubmit(onSubmit)} className='py-2 px-4 text-base bg-primaryblue rounded-md gap-1 hidden md:flex text-white items-center justify-center'>
              <p className='whitespace-nowrap'>Get started</p>
              <ArrowRight size={20} color='#FFF' />
            </button>
          </div>

          {userState?.userType == USER_TYPE.JOBSEEKER && (
            <div>
              <div className='flex flex-row gap-4 items-center justify-center'>
                <button
                  onClick={() => handleUserTypeToggle(JOBSEEKER_TYPE.FRESHER)}
                  className={clsx(
                    'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
                    jobseekerType === JOBSEEKER_TYPE.FRESHER
                      ? 'bg-primaryblue text-white'
                      : 'text-primaryblue bg-white'
                  )}
                >
                  Fresher
                </button>
                <button
                  onClick={() => handleUserTypeToggle(JOBSEEKER_TYPE.EXPERIENCED)}
                  className={clsx(
                    'border-primaryblue border-[0.5px] font-semibold rounded-md py-2 px-5 text-center',
                    jobseekerType === JOBSEEKER_TYPE.EXPERIENCED
                      ? 'bg-primaryblue text-white'
                      : 'text-primaryblue bg-white'
                  )}
                >
                  Experienced
                </button>
              </div>
            </div>
          )}
          <div className='md:border-[1px] grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-md justify-between items-center'>
            {userState?.userType == USER_TYPE.EMPLOYER && (
              <>
                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='numberOfEmployees' className='font-semibold text-neutral-500 text-base'>Number of Employees</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='numberOfEmployees' defaultValue='' {...register('numberOfEmployees')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Number</option>
                      {employeeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors && <p className='text-red-500 text-sm'>{errors.numberOfEmployees?.message}</p>}
                </div>

                <Input<OnboardingFormData> 
                  label='Location of Headquaters'
                  field='headquarterLocation'
                  type='text'
                  register={register}
                  placeholder='Type Location (City, State, Country)'
                  error={errors.headquarterLocation}
                />

                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='companyType' className='font-semibold text-neutral-500 text-base'>Company Type</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='companyType' defaultValue='' {...register('companyType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Type</option>
                      {companyTypeOption.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors && <p className='text-red-500 text-sm'>{errors.companyType?.message}</p>}
                </div>

                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='industryType' className='font-semibold text-neutral-500 text-base'>Industry Type</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='industryType' defaultValue='' {...register('industryType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Type</option>
                      {industryTypeOption.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {errors && <p className='text-red-500 text-sm'>{errors.companyType?.message}</p>}
                </div>

                <Input<OnboardingFormData> 
                  label='Website Link'
                  type='text'
                  field='companyWebsite'
                  register={register}
                  placeholder='www.yourcompanyname.com/in'
                  error={errors.companyWebsite}
                />

                <Input<OnboardingFormData> 
                  label='Linkedin'
                  type='text'
                  field='linkedInProfile'
                  register={register}
                  placeholder='www.linkedin.com/company/WorkR'
                  error={errors.linkedInProfile}
                />

                <div className='w-full mt-5 flex flex-col gap-8 p-8 rounded-md border h-fit items-center justify-center order-8'>
                  <Image
                    width={52}
                    height={52}
                    src={userState.profileImage ? userState.profileImage : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
                    alt='profile'
                    className='rounded-full w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
                  />
                  <div className='flex flex-col gap-2 justify-center items-center'>
                    <p className='text-lg font-bold'>Add Company Logo</p>
                    <p className='text-gray-500'>( Should be less than 3MB )</p>
                  </div>
                  <div>
                    <input type='file' id='company-logo-upload' className='hidden' onChange={handleFileChange} />
                    <label htmlFor='file-upload' className='flex cursor-pointer flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-1 w-fit bg-white border-[1px] border-primaryblue rounded-md text-primaryblue hover:bg-subtleblue'>
                      <p className='font-semibold text-sm'>{userState.companyLogo ? 'Edit Logo' : 'Upload Logo'}</p>
                    </label>
                  </div>
                </div>


                <div className='flex flex-col gap-y-5 order-7'>
                  <div className='border-b flex gap-8 justify-center items-center pb-2 mb-2 space-x-2'>
                    <button type='button' onClick={() => editor?.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'is-active px-2 py-1 border rounded bg-gray-200' : ''}>
                      Bold
                    </button>
                    <button type='button' onClick={() => editor?.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'is-active px-2 py-1 border rounded bg-gray-200' : ''}>
                      Italic
                    </button>
                    <button type='button' onClick={() => editor?.chain().focus().toggleUnderline().run()} className={editor?.isActive('underline') ? 'is-active px-2 py-1 border rounded bg-gray-200' : ''}>
                      Underline
                    </button>

                    <button type='button' onClick={() => editor?.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'is-active px-2 py-1 border rounded bg-gray-200' : ''}>
                      Bullet List
                    </button>

                    <button type='button' onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active px-2 py-1 border rounded bg-gray-200' : ''}>
                      Ordered List
                    </button>
                  </div>

                  <div className='border p-2 h-[300px] cursor-text'>
                    <Controller
                      name='companyAbout'
                      control={control}
                      render={({ field }) => (
                        <EditorContent 
                          onChange={field.onChange} 
                          value={field.value}
                          className='outline-none focus:outline-none h-full prose' 
                          editor={editor} 
                        />
                      )}
                    />
                  </div>

                  {errors && <p className='text-red-500 text-sm mt-4'>{errors.companyAbout?.message}</p>}
                </div>

                <div className='order-9'>
                  <Input<OnboardingFormData> 
                    label='Twitter (Optional)'
                    type='text'
                    field='twitterProfile'
                    register={register}
                    placeholder='www.twitter.com/company/WorkR'
                  />
                </div>
              </>
            )}

            {userState?.userType == USER_TYPE.JOBSEEKER && jobseekerType == JOBSEEKER_TYPE.FRESHER && (
              <>
                <Input<OnboardingFormData>
                  label='Q. College / University name ?'
                  type='text'
                  field='instituteName'
                  register={register}
                  placeholder='Type College Name'
                  error={errors.instituteName}
                />

                <Input<OnboardingFormData>
                  label='Q. Year of graduation ?'
                  type='text'
                  field='yearOfGraduation'
                  register={register}
                  placeholder='Type Graduation Year(YYYY)'
                  error={errors.yearOfGraduation}
                />

                <Input<OnboardingFormData>
                  label='Q. Select your hometown state ?'
                  type='text'
                  field='hometownState'
                  register={register}
                  placeholder='Type Your Hometown State'
                  error={errors.hometownState}
                />

                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='interestedDomain' className='font-semibold text-neutral-500 text-base'>Q. Which domain are you interested in working? (Optional)</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='interestedDomain' defaultValue='' onChange={handleDomain} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Domain</option>
                      {domainOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {interestedDomain.length > 0 && (
                    <div className='flex gap-3'>
                      {interestedDomain.map((domain, index) => (
                        <p key={index} className='flex text-sm justify-center items-center w-fit p-2 rounded-full border bg-slate-100 text-black'>
                          {domain}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <Input<OnboardingFormData> 
                  label='Linkedin Profile'
                  type='text'
                  field='linkedInProfile'
                  register={register}
                  placeholder='www.yourlinkedinprofile.com'
                  error={errors.linkedInProfile}
                />

                <Input<OnboardingFormData> 
                  label='Twitter Profile (Optional)'
                  type='text'
                  field='twitterProfile'
                  register={register}
                  placeholder='www.yourtwitterprofile.com'
                />

                <div className='w-full mt-5 flex flex-col gap-8 p-8 rounded-md border h-fit items-center justify-center relative md:left-1/2'>
                  <Image
                    width={52}
                    height={52}
                    src={userState.profileImage ? userState.profileImage : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
                    alt='profile'
                    className='rounded-full w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
                  />
                  <div className='flex flex-col gap-2 justify-center items-center'>
                    <p className='text-lg font-bold'>Add Profile Image</p>
                    <p className='text-gray-500'>( Should be less than 3MB )</p>
                  </div>
                  <div>
                    <input type='file' id='profile-image-fresher-upload' className='hidden' onChange={handleFileChange} />
                    <label htmlFor='profile-image-fresher-upload' className='flex cursor-pointer flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-1 w-fit bg-white border-[1px] border-primaryblue rounded-md text-primaryblue hover:bg-subtleblue'>
                      <p className='font-semibold text-sm'>{userState.companyLogo ? 'Edit Image' : 'Upload Image'}</p>
                    </label>
                  </div>
                </div>
              </>
            )}

            {userState?.userType == USER_TYPE.JOBSEEKER && jobseekerType == JOBSEEKER_TYPE.EXPERIENCED && (
              <>
                <Input<OnboardingFormData>
                  label='Q. Current Company ?'
                  type='text'
                  field='currentCompany'
                  register={register}
                  placeholder='Type Current Company Name'
                  error={errors.currentCompany}
                />

                <Input<OnboardingFormData>
                  label='Q. Years Of Experience ?'
                  type='text'
                  field='yearsOfExperience'
                  register={register}
                  placeholder='Type Your Years Of Experience'
                  error={errors.yearsOfExperience}
                />

                <Input<OnboardingFormData>
                  label='Q. Current Office Location ?'
                  type='text'
                  field='currentOfficeLocation'
                  register={register}
                  placeholder='Type Your Current Office Location(City)'
                  error={errors.currentOfficeLocation}
                />

                <Input<OnboardingFormData> 
                  label='Linkedin Profile'
                  type='text'
                  field='linkedInProfile'
                  register={register}
                  placeholder='www.yourlinkedinprofile.com'
                  error={errors.linkedInProfile}
                />

                <Input<OnboardingFormData> 
                  label='Github Profile (Optional)'
                  type='text'
                  field='githubProfile'
                  register={register}
                  placeholder='www.yourgithubprofile.com'
                />

                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='interestedDomain' className='font-semibold text-neutral-500 text-base'>Q. Which domain are you interested in working? (Optional)</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='interestedDomain' defaultValue='' onChange={handleDomain} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Domain</option>
                      {domainOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {interestedDomain.length > 0 && (
                    <div className='flex gap-3'>
                      {interestedDomain.map((domain, index) => (
                        <p key={index} className='flex justify-center items-center w-fit p-2 rounded-full border bg-slate-100 text-black'>
                          {domain}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className='w-full mt-5 flex flex-col gap-8 p-8 rounded-md border h-fit items-center justify-center relative md:left-1/2'>
                  <Image
                    width={52}
                    height={52}
                    src={userState.profileImage ? userState.profileImage : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
                    alt='profile'
                    className='rounded-full w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
                  />
                  <div className='flex flex-col gap-2 justify-center items-center'>
                    <p className='text-lg font-bold'>Add Profile Image</p>
                    <p className='text-gray-500'>( Should be less than 3MB )</p>
                  </div>
                  <div>
                    <input type='file' id='profile-image-experience-upload' className='hidden' onChange={handleFileChange} />
                    <label htmlFor='profile-image-experience-upload' className='flex cursor-pointer flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-1 w-fit bg-white border-[1px] border-primaryblue rounded-md text-primaryblue hover:bg-subtleblue'>
                      <p className='font-semibold text-sm'>{userState.companyLogo ? 'Edit Image' : 'Upload Image'}</p>
                    </label>
                  </div>
                </div>
              </>
            )}
        
          </div>
      
          <div className='p-8 bg-white w-full border-t md:hidden sticky bottom-0'>
            <button onClick={handleSubmit(onSubmit)} className='py-3 text-base px-4 bg-primaryblue rounded-md gap-1 flex text-white items-center justify-center w-full h-full'>
              <p className='whitespace-nowrap'>Get started</p>
              <ArrowRight size={20} color='#FFF' />
            </button>
          </div>
        </div>
      )}
    </>
  );
}


