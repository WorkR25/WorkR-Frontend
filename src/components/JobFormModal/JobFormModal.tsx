 
import { zodResolver } from '@hookform/resolvers/zod';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import OrderedList from '@tiptap/extension-ordered-list';
import Underline from '@tiptap/extension-underline';
import { EditorContent,useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AxiosError, AxiosResponse } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RxCrossCircled } from 'react-icons/rx';

import Input from '@/components/Input/Input';
import { defaultDescription, employeeOptions, MAX_FILE_SIZE } from '@/constants/constant';
import { createJob, setOpenJobForm, setSelectPost } from '@/lib/features/jobs/jobSlice';
import { clearToken } from '@/lib/features/users/authSlice';
import { logout } from '@/lib/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createJobSchema } from '@/schemas/FormSchemas';
import { ApiError, JobFormData, JobRequest, UploadLogoResponse } from '@/types';
import axiosUserInstance from '@/utils/axiosInstances/axiosUserInstance';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';
import { JOB_TYPE } from '@/utils/enums/JobType';
import { USER_ROLE } from '@/utils/enums/UserRole';

const JobFormModal = () => {
  const userState = useAppSelector((state) => state.userState.user);
  const jobState = useAppSelector((state) => state.jobState);
  const selectPost = useAppSelector((state) => state.jobState.selectPost);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [skill, setSkill] = useState('');
  const { register, getValues, watch, setValue, formState: { errors }, handleSubmit, reset } = useForm<JobFormData>({
    defaultValues: {
      employerId: userState?.id,
      jobTitle: '',
      requiredSkills: requiredSkills,
      minSalary: '',
      maxSalary: '',
      jobDescription: defaultDescription,
      jobCategory: jobState.jobCategory,
      internshipType: undefined,
      workExperience: '',
      companyName: '',
      companyLogo: undefined,
      officeLocation: '',
      companyAbout: undefined,
      numberOfEmployees: undefined,
      applyLink: ''
    },
    resolver: zodResolver(createJobSchema)
  });

  const { 
    register: registerMobile, 
    getValues: getValuesMobile, 
    watch: watchMobile, 
    setValue: setValueMobile, 
    formState: { errors: errorsMobile }, 
    handleSubmit: handleSubmitMobile, 
    reset: resetMobile 
  } = useForm<JobFormData>({
    defaultValues: {
      employerId: userState?.id,
      jobTitle: '',
      requiredSkills: requiredSkills,
      minSalary: '',
      maxSalary: '',
      jobDescription: defaultDescription,
      jobCategory: jobState.jobCategory,
      internshipType: undefined,
      workExperience: '',
      companyName: '',
      companyLogo: undefined,
      officeLocation: '',
      companyAbout: undefined,
      numberOfEmployees: undefined,
      applyLink: ''
    },
    resolver: zodResolver(createJobSchema)
  });

  function addSkill(skill: string) {
    if(!skill.trim()) return;
    if(requiredSkills.includes(skill.trim())) {
      setSkillError('This skill is already added');
      return;
    }

    setRequiredSkills([...requiredSkills, skill.trim().toUpperCase()]);
    setValue('requiredSkills', [...requiredSkills, skill.trim().toUpperCase()], { shouldValidate: true });
    setSkill('');
    if(skillError) setSkillError(null);
  }

  function removeSkill(index: number) {
    const updatedSkills = requiredSkills.filter((_, i) => i != index);
    setRequiredSkills(updatedSkills);
    setValue('requiredSkills', updatedSkills, { shouldValidate: true });
  }

  const jobType = watch('jobType');
  const jobTypeMobile = watchMobile('jobType');
  const companyLogo = watch('companyLogo');
  const companyLogoMobile = watchMobile('companyLogo');

  const officeTypeOption = [
    'Remote',
    'In-Office',
    'Hybrid'
  ];

  const experienceOption = [
    '0-2',
    '2+',
    '3-4',
    '5+'
  ];

  const internshipTypeOption = [
    'tech',
    'non-tech'
  ];

  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList, OrderedList, ListItem, ListKeymap],
    content: defaultDescription,
    onUpdate: ({ editor }) => {
      setValue('jobDescription', editor.getHTML(), { shouldValidate: true });
    },
    immediatelyRender: false
  });

  const editor2 = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, BulletList, OrderedList, ListItem, ListKeymap],
    content: defaultDescription,
    onUpdate: ({ editor }) => {
      setValueMobile('jobDescription', editor.getHTML(), { shouldValidate: true });
    },
    immediatelyRender: false
  });

  const onSubmit: SubmitHandler<JobFormData> = async () => {
    const jobRequest: JobRequest = {
      employerId: Number(userState?.id),
      jobTitle: getValues('jobTitle'),
      requiredSkills: getValues('requiredSkills'),
      minSalary: Number(getValues('minSalary')),
      maxSalary: Number(getValues('maxSalary')),
      jobDescription: getValues('jobDescription'),
      jobType: getValues('jobType'),
      jobCategory: jobState.jobCategory,
      internshipType: getValues('internshipType') ? String(getValues('internshipType')) : undefined,
      workExperience: getValues('workExperience') ? String(getValues('workExperience')) : undefined,
      companyName: getValues('companyName') ? String(getValues('companyName')) : String(userState?.companyName),
      companyLogo: getValues('companyLogo') ? String(getValues('companyLogo')) : userState?.profileImage ? String(userState.profileImage) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg',
      officeLocation: getValues('officeLocation') ? String(getValues('officeLocation')) : undefined,
      companyAbout: getValues('companyAbout') ? String(getValues('companyAbout')) : undefined,
      numberOfEmployees: getValues('numberOfEmployees') ? String(getValues('numberOfEmployees')) : undefined,
      applyLink: getValues('applyLink') ? String(getValues('applyLink')) : undefined
    };

    const res = await dispatch(createJob(jobRequest));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
    reset();
    editor?.commands.setContent(defaultDescription, false);
    setRequiredSkills([]);
  };

  const onSubmitMobile: SubmitHandler<JobFormData> = async () => {
    const jobRequest: JobRequest = {
      employerId: Number(userState?.id),
      jobTitle: getValuesMobile('jobTitle'),
      requiredSkills: getValuesMobile('requiredSkills'),
      minSalary: Number(getValuesMobile('minSalary')),
      maxSalary: Number(getValuesMobile('maxSalary')),
      jobDescription: getValuesMobile('jobDescription'),
      jobType: getValuesMobile('jobType'),
      jobCategory: jobState.jobCategory,
      internshipType: getValuesMobile('internshipType') ? String(getValuesMobile('internshipType')) : undefined,
      workExperience: getValuesMobile('workExperience') ? String(getValuesMobile('workExperience')) : undefined,
      companyName: getValuesMobile('companyName') ? String(getValuesMobile('companyName')) : String(userState?.companyName),
      companyLogo: getValuesMobile('companyLogo') ? String(getValuesMobile('companyLogo')) : userState?.profileImage ? String(userState.profileImage) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg',
      officeLocation: getValuesMobile('officeLocation') ? String(getValuesMobile('officeLocation')) : undefined,
      companyAbout: getValuesMobile('companyAbout') ? String(getValues('companyAbout')) : undefined,
      numberOfEmployees: getValuesMobile('numberOfEmployees') ? String(getValues('numberOfEmployees')) : undefined,
      applyLink: getValuesMobile('applyLink') ? String(getValuesMobile('applyLink')) : undefined
    };

    const res = await dispatch(createJob(jobRequest));
    if(res.payload?.data == 401) {
      router.push('/signin');
      dispatch(clearToken());
      dispatch(logout());
      return;
    }
    resetMobile();
    editor?.commands.setContent(defaultDescription, false);
    setRequiredSkills([]);
  };

  function handleCancelMobile() {
    dispatch(setSelectPost(!selectPost));
    dispatch(setOpenJobForm(!jobState.openJobForm));
  }

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>, flag?: string) {
    try {
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
  
      const response: Promise<AxiosResponse<UploadLogoResponse>> = axiosUserInstance.post('/upload-company-logo', formData, {
        headers: {
          'x-access-token': localStorage.getItem('token') || ''
        }
      });

      toast.promise(response, {
        loading: 'Uploading...',
        success: 'Successfully uploaded the logo'
      });
      
      if(flag) {
        setValueMobile('companyLogo', (await response).data.data);
      } else {
        setValue('companyLogo', (await response).data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      if(axiosError.response?.data) {
        toast.error(axiosError.response.data.message);
        if(axiosError.status == 401) {
          router.push('/signin');
          dispatch(clearToken());
          dispatch(logout());
          return;
        }
      }
    }
  }
  return (
    <div className='w-full absolute h-screen z-[998] flex items-center justify-center'>
      <div className='flex w-full items-center justify-center absolute top-0 z-[999] md:p-20 py-20 p-1 h-auto bg-black bg-opacity-60 '>
        <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-md p-8 md:flex md:flex-col hidden gap-8 md:w-[97%] w-[100%]'>
          {/* <h4>We accept only Fulltime jobs with a minimum CTC of 3 LPA</h4> */}
          <div className='flex flex-row gap-8'>
            <div className='grid grid-cols-1 gap-8 w-3/5'>
              <Input
                label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Title*' : 'Internship Title*'}
                type='text'
                placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Job Title' : 'Enter Internship Title'}
                register={register}
                field='jobTitle'
                error={errors.jobTitle}
              />
              
              <div className='relative flex flex-col flex-wrap gap-3'>
                <div className='hidden'>
                  <Input
                    label='Required Skills*'
                    type='text'
                    placeholder='Enter Skill'
                    register={register}
                    field='requiredSkills'
                    error={errors.requiredSkills} 
                  />
                </div>
                <label className='font-semibold text-neutral-500 text-base'>Required Skills*</label>
                <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                  <input
                    type='text'
                    placeholder='Enter Skill'
                    className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                    value={skill}
                    onChange={(event) => setSkill(event.target.value)}
                  />
                </div>
                {errors.requiredSkills && <p className='text-red-500 text-sm'>{errors.requiredSkills.message}</p>}
                {skillError && <p className='text-red-500 text-sm'>{skillError}</p>}

                <div onClick={() => addSkill(skill)} className='bg-[#30c972] cursor-pointer text-white text-lg px-7 py-2 rounded-lg absolute right-1 top-[2.43rem]'>ADD</div>

                {requiredSkills.length > 0 && (
                  <div className='flex flex-wrap gap-3'>
                    {requiredSkills.map((skill, index) => (
                      <div key={skill} className='bg-neutral-200 flex gap-2 px-2.5 rounded-full items-center'>
                        <p className=''>{skill}</p>
                        <RxCrossCircled size={20} onClick={() => removeSkill(index)} className='cursor-pointer hover:text-red-600 duration-200' />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className='flex gap-3'>
                <Input
                  label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Minimum Salary* (LPA)' : 'Min Stipend* (Per Month in Indian Rupee)'}
                  type='text'
                  placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Min Salary i.e. 3, 3.5, 4 etc' : 'Enter Min Stipend i.e. 10000, 30000 etc.'}
                  register={register}
                  field='minSalary'
                  error={errors.minSalary}
                />

                <Input
                  label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Maximum Salary* (LPA)' : 'Max Stipend* (Per Month in Indian Rupee)'}
                  type='text'
                  placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Max Salary i.e. 3, 3.5, 4 etc' : 'Enter Max Stipend i.e. 10000, 30000 etc.'}
                  register={register}
                  field='maxSalary'
                  error={errors.maxSalary}
                />
              </div>

              <div className='flex flex-col gap-y-5'>
                <label className='font-semibold text-neutral-500 text-base'>{jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Description*' : 'Internship Description*'}</label>
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

                <div className='border p-2 h-fit cursor-text'>
                  <EditorContent 
                    className='outline-none text-neutral-500 text-base focus:outline-none h-full prose' 
                    editor={editor} 
                  />
                </div>

                {errors && <p className='text-red-500 text-sm mt-4'>{errors.jobDescription?.message}</p>}
              </div>
            </div>

            <div className='flex flex-col gap-5 w-2/5'>
              <div className='flex flex-col gap-3 w-full'>
                <label htmlFor='officeType' className='font-semibold text-neutral-500 text-base'>Office Type*</label>
                <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                  <select id='officeType' defaultValue='' {...register('jobType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                    <option value='' disabled className=''>Choose Office Type</option>
                    {officeTypeOption.map((option) => (
                      <option key={option} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              
                {errors && <p className='text-red-500 text-sm'>{errors.jobType?.message}</p>}
              </div>
                
              {jobType == JOB_TYPE.IN_OFFICE && (
                <Input 
                  type='text'
                  label='Office Location*'
                  placeholder='Type Location(City, State, Country)'
                  register={register}
                  field='officeLocation'
                  error={errors.officeLocation}
                />
              )}

              {jobState.jobCategory == JOB_CATEGORY.INTERNSHIP && (
                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='internshipType' className='font-semibold text-neutral-500 text-base'>Internship Type*</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='internshipType' defaultValue='' {...register('internshipType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Choose Internship Type</option>
                      {internshipTypeOption.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
            
                  {errors && <p className='text-red-500 text-sm'>{errors.workExperience?.message}</p>}
                </div>
              )}

              {jobState.jobCategory == JOB_CATEGORY.FULLTIME && (
                <div className='flex flex-col gap-3 w-full'>
                  <label htmlFor='workExperience' className='font-semibold text-neutral-500 text-base'>Work Experience*</label>
                  <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                    <select id='workExperience' defaultValue='' {...register('workExperience')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                      <option value='' disabled className=''>Select Experience</option>
                      {experienceOption.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
              
                  {errors && <p className='text-red-500 text-sm'>{errors.workExperience?.message}</p>}
                </div>)}

              {userState?.role == USER_ROLE.ADMIN && (
                <Input
                  type='text'
                  label='Company Name'
                  placeholder='Enter Company Name'
                  register={register}
                  field='companyName' 
                />
              )}

              {userState?.role == USER_ROLE.ADMIN && (
                <Input
                  type='text'
                  label='Company About Link'
                  placeholder='Enter Link'
                  register={register}
                  field='companyAbout' 
                />
              )}

              {userState?.role == USER_ROLE.ADMIN && (
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
              )}

              {userState?.role == USER_ROLE.ADMIN && (
                <Input
                  type='text'
                  label='Apply Link'
                  placeholder='Enter Apply Link'
                  register={register}
                  field='applyLink' 
                />
              )}

              {userState?.role == USER_ROLE.ADMIN && <div className='w-full mt-5 flex flex-col gap-8 p-8 rounded-md border h-fit items-center justify-center'>
                <Image
                  width={52}
                  height={52}
                  src={companyLogo ? String(companyLogo) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
                  alt='profile'
                  className='rounded-full w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
                />
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <p className='text-lg font-bold'>Add Company Logo</p>
                  <p className='text-gray-500'>( Should be less than 3MB )</p>
                </div>
                <div>
                  <input type='file' id='logo-upload' className='hidden' onChange={handleLogoChange} />
                  <label htmlFor='logo-upload' className='flex cursor-pointer flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-1 w-fit bg-white border-[1px] border-primaryblue rounded-md text-primaryblue hover:bg-subtleblue'>
                    <p className='font-semibold text-sm'>{companyLogo ? 'Edit Logo' : 'Upload Logo'}</p>
                  </label>
                </div>
              </div>}
            </div>
          </div>
          <div className='flex gap-4 sm:gap-6 ml-auto'>
            <button
              onClick={() => dispatch(setOpenJobForm(!jobState.openJobForm))}
              className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'
            >
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>{jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Create Job' : 'Create Internship'}</p>
            </button>
          </div>
        </form>

        <form onSubmit={handleSubmitMobile(onSubmitMobile)} className='bg-white w-full h-auto md:hidden flex flex-col rounded-lg gap-5 pb-6 px-2'>
          {/* <h4>We accept only Fulltime jobs with a minimum CTC of 3 LPA</h4> */}
          <div className='flex flex-col gap-8'>
            <Input
              label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Title*' : 'Internship Title*'}
              type='text'
              placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Job Title' : 'Enter Internship Title'}
              register={registerMobile}
              field='jobTitle'
              error={errorsMobile.jobTitle}
            />

            <div className='relative flex flex-col flex-wrap gap-3'>
              <div className='hidden'>
                <Input
                  label='Required Skills*'
                  type='text'
                  placeholder='Enter Skill'
                  register={registerMobile}
                  field='requiredSkills'
                  error={errorsMobile.requiredSkills} 
                />
              </div>
              <label className='font-semibold text-neutral-500 text-base'>Required Skills*</label>
              <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <input
                  type='text'
                  placeholder='Enter Skill'
                  className='placeholder:text-neutral-400 focus:outline-none border-none focus:ring-0 w-full p-0'
                  value={skill}
                  onChange={(event) => setSkill(event.target.value)}
                />
              </div>
              {errors.requiredSkills && <p className='text-red-500 text-sm'>{errors.requiredSkills.message}</p>}
              {skillError && <p className='text-red-500 text-sm'>{skillError}</p>}

              <div onClick={() => addSkill(skill)} className='bg-[#30c972] cursor-pointer text-white text-lg px-7 py-2 rounded-lg absolute right-1 top-[2.43rem]'>ADD</div>

              {requiredSkills.length > 0 && (
                <div className='flex flex-wrap gap-3'>
                  {requiredSkills.map((skill, index) => (
                    <div key={skill} className='bg-neutral-200 flex gap-2 px-2.5 rounded-full items-center'>
                      <p className=''>{skill}</p>
                      <RxCrossCircled size={20} onClick={() => removeSkill(index)} className='cursor-pointer hover:text-red-600 duration-200' />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='flex gap-3'>
              <Input
                label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Minimum Salary* (LPA)' : 'Min Stipend* (Per Month in Indian Rupee)'}
                type='text'
                placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Min Salary i.e. 3, 3.5, 4 etc' : 'Enter Min Stipend i.e. 10000, 30000 etc.'}
                register={registerMobile}
                field='minSalary'
                error={errorsMobile.minSalary}
              />

              <Input
                label={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Maximum Salary* (LPA)' : 'Max Stipend* (Per Month in Indian Rupee)'}
                type='text'
                placeholder={jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Enter Max Salary i.e. 3, 3.5, 4 etc' : 'Enter Max Stipend i.e. 10000, 30000 etc.'}
                register={registerMobile}
                field='maxSalary'
                error={errorsMobile.maxSalary}
              />
            </div>

            <div className='flex flex-col gap-y-5'>
              <label className='font-semibold text-neutral-500 text-base'>{jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Job Description*' : 'Internship Description*'}</label>
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

              <div className='border p-2 h-fit cursor-text'>
                <EditorContent 
                  className='outline-none text-neutral-500 text-base focus:outline-none h-full prose' 
                  editor={editor2} 
                />
              </div>

              {errorsMobile && <p className='text-red-500 text-sm mt-4'>{errorsMobile.jobDescription?.message}</p>}
            </div>

            <div className='flex flex-col gap-3 w-full'>
              <label htmlFor='officeType' className='font-semibold text-neutral-500 text-base'>Office Type*</label>
              <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <select id='officeType' defaultValue='' {...registerMobile('jobType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                  <option value='' disabled className=''>Choose Office Type</option>
                  {officeTypeOption.map((option) => (
                    <option key={option} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              
              {errorsMobile && <p className='text-red-500 text-sm'>{errorsMobile.jobType?.message}</p>}
            </div>

            {jobTypeMobile == JOB_TYPE.IN_OFFICE && (
              <Input 
                type='text'
                label='Office Location*'
                placeholder='Type Location(City, State, Country)'
                register={registerMobile}
                field='officeLocation'
                error={errorsMobile.officeLocation}
              />
            )}

            {jobState.jobCategory == JOB_CATEGORY.INTERNSHIP && (
              <div className='flex flex-col gap-3 w-full'>
                <label htmlFor='internshipType' className='font-semibold text-neutral-500 text-base'>Internship Type*</label>
                <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                  <select id='internshipType' defaultValue='' {...registerMobile('internshipType')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                    <option value='' disabled className=''>Choose Internship Type</option>
                    {internshipTypeOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
            
                {errorsMobile && <p className='text-red-500 text-sm'>{errorsMobile.workExperience?.message}</p>}
              </div>
            )}

            {jobState.jobCategory == JOB_CATEGORY.FULLTIME && (
              <div className='flex flex-col gap-3 w-full'>
                <label htmlFor='workExperience' className='font-semibold text-neutral-500 text-base'>Work Experience*</label>
                <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                  <select id='workExperience' defaultValue='' {...registerMobile('workExperience')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                    <option value='' disabled className=''>Select Experience</option>
                    {experienceOption.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              
                {errorsMobile && <p className='text-red-500 text-sm'>{errorsMobile.workExperience?.message}</p>}
              </div>)}

            {userState?.role == USER_ROLE.ADMIN && (
              <Input
                type='text'
                label='Company Name'
                placeholder='Enter Company Name'
                register={registerMobile}
                field='companyName' 
              />
            )}

            {userState?.role == USER_ROLE.ADMIN && (
              <div className='flex flex-col gap-3 w-full'>
                <label htmlFor='numberOfEmployeesMobile' className='font-semibold text-neutral-500 text-base'>Number of Employees</label>
                <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                  <select id='numberOfEmployeesMobile' defaultValue='' {...registerMobile('numberOfEmployees')} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                    <option value='' disabled className=''>Select Number</option>
                    {employeeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {errors && <p className='text-red-500 text-sm'>{errorsMobile.numberOfEmployees?.message}</p>}
              </div>
            )}

            {userState?.role == USER_ROLE.ADMIN && (
              <Input
                type='text'
                label='Company About Link'
                placeholder='Enter Link'
                register={register}
                field='companyAbout' 
              />
            )}

            {userState?.role == USER_ROLE.ADMIN && (
              <Input
                type='text'
                label='Apply Link'
                placeholder='Enter Apply Link'
                register={registerMobile}
                field='applyLink' 
              />
            )}

            {userState?.role == USER_ROLE.ADMIN && <div className='w-full flex flex-col gap-8 p-4 rounded-md border h-fit items-center justify-center'>
              <Image
                width={52}
                height={52}
                src={companyLogoMobile ? String(companyLogoMobile) : 'https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg'}
                alt='profile'
                className='rounded-full w-[52px] h-[52px] object-cover aspect-square flex justify-center items-center'
              />
              <div className='flex flex-col gap-2 justify-center items-center'>
                <p className='text-lg font-bold'>Add Company Logo</p>
                <p className='text-gray-500'>( Should be less than 3MB )</p>
              </div>
              <div>
                <input type='file' id='logo-mobile-upload' className='hidden' onChange={(e) => handleLogoChange(e, 'small')} />
                <label htmlFor='logo-mobile-upload' className='flex cursor-pointer flex-row items-center md:py-3 md:px-4 py-2 px-3 justify-center gap-1 w-fit bg-white border-[1px] border-primaryblue rounded-md text-primaryblue hover:bg-subtleblue'>
                  <p className='font-semibold text-sm'>{companyLogoMobile ? 'Edit Logo' : 'Upload Logo'}</p>
                </label>
              </div>
            </div>}
          </div>

          <div className='flex gap-8 sm:gap-6 mx-auto pt-3'>
            <button
              onClick={handleCancelMobile}
              className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-7 justify-center gap-2 w-fit bg-white border-[1px] rounded-md'
            >
              <p className='font-medium sm:text-base text-sm'>Cancel</p>
            </button>
            <button type='submit' className='flex flex-row items-center sm:py-3 sm:px-4 py-2 px-7 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
              <p className='font-semibold sm:text-base text-sm'>{jobState.jobCategory == JOB_CATEGORY.FULLTIME ? 'Create Job' : 'Create Internship'}</p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
