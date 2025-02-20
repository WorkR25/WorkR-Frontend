'use client';

import 'rc-slider/assets/index.css';

import Slider from 'rc-slider';
import React, { FC } from 'react';

// import Select from '@/components/select/page';
// import Switcher from '@/components/Toggle/Switcher';
import { setExperience, setInternshipType, setMinSalary, setMinStipend, setOfficeType } from '@/lib/features/jobs/jobSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { JOB_CATEGORY } from '@/utils/enums/JobCategory';

const marks: Record<number, string> = {
  25: '5K',
  50: '10K',
  67: '20K',
  84: '30K',
  100: '50K'
};

// const months = {
//   0: '0',
//   25: '3',
//   50: '6',
//   75: '9',
//   100: '12',
// };

const salaryMarks: Record<number, string> = {
  25: '3',
  50: '6',
  67: '8',
  84: '10',
  100: '12',
};

const experienceOption = [
  '0-2',
  '2+',
  '3-4',
  '5+'
];

const officeTypeOption = [
  'remote',
  'in-office',
  'hybrid'
];

const internshipTypeOption = [
  'Tech',
  'Non-Tech'
];

interface JobFilterProps {
  jobCategory: JOB_CATEGORY
  handleMoreFilters: () => void
  clearParams: () => void
}

const JobFilter: FC<JobFilterProps> = ({ jobCategory, handleMoreFilters, clearParams }) => {
  const jobState = useAppSelector((state) => state.jobState);
  const { officeType, experience, internshipType} = jobState;
  const dispatch = useAppDispatch();

  function handleMinSalary(minSalary: string) {
    if(minSalary == '0' || minSalary == '') return;
    dispatch(setMinSalary(minSalary));
  }
  return (
    <div className='hidden lg:flex flex-col gap-4 w-full lg:max-w-[460px] lg:w-[460px]'>
      <div className='py-5 px-8 flex flex-col items-start justify-center w-full bg-white border-[2px] border-background rounded-lg h-fit gap-8'>
        <div className='w-full flex justify-between items-center gap-4'>
          <p className='text-base font-bold'>Apply Filters</p>
          <button onClick={clearParams} className='text-base text-ankerblue '>Clear</button>
        </div>
        {jobCategory === JOB_CATEGORY.FULLTIME ? (
          <>
            <div className='flex flex-col gap-3 w-full'>
              <label htmlFor='officeType' className='font-semibold text-neutral-500 text-base'>Office Type</label>
              <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <select id='officeType' value={officeType} onChange={(e) => dispatch(setOfficeType(e.target.value))} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                  <option value='' disabled className=''>Select Type</option>
                  {officeTypeOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex flex-col gap-3 w-full'>
              <label htmlFor='workExperience' className='font-semibold text-neutral-500 text-base'>Work Experience</label>
              <div id='workExperience' className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <select value={experience} onChange={(e) => dispatch(setExperience(e.target.value))} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                  <option value='' disabled className=''>Select Experience</option>
                  {experienceOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='w-full flex flex-col gap-2'>
              <p className='font-semibold text-neutral-500 text-base'>
                Min Salary (in LPA)
              </p>
              <div>
                <Slider
                  min={0}
                  marks={salaryMarks}
                  step={null}
                  onChange={(key) => handleMinSalary(salaryMarks[key as number])}
                  defaultValue={0}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='flex flex-col gap-3 w-full'>
              <label htmlFor='officeType' className='font-semibold text-neutral-500 text-base'>Office Type</label>
              <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <select id='officeType' value={officeType} onChange={(e) => dispatch(setOfficeType(e.target.value))} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                  <option value='' disabled className=''>Select Type</option>
                  {officeTypeOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='flex flex-col gap-3 w-full'>
              <label htmlFor='internshipType' className='font-semibold text-neutral-500 text-base'>Internship Type</label>
              <div className='px-[10px] py-3 border w-full border-gray-300 rounded-md flex flex-row items-center bg-white'>
                <select id='internshipType' value={internshipType} onChange={(e) => dispatch(setInternshipType(e.target.value))} className='text-neutral-400 bg-white focus:outline-none border-none focus:ring-0 w-full p-0'>
                  <option value='' disabled className=''>Select Tech/Non-Tech</option>
                  {internshipTypeOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className='w-full flex justify-between items-center gap-4'>
              <p className='font-semibold text-neutral-500 text-base'>
                Remote Internship
              </p>
              <Switcher
                background='bg-white'
                foreground='bg-gray-500'
                activeForeground='bg-ankerblue'
                activeBackground='bg-white'
                hasBorder={true}
              />
            </div> */}
            {/* <div className='w-full flex justify-between items-center gap-4'>
              <p className='font-semibold text-neutral-500 text-base'>
                Job Offer Attached
              </p>
              <Switcher
                background='bg-white'
                foreground='bg-gray-500'
                activeForeground='bg-ankerblue'
                activeBackground='bg-white'
                hasBorder={true}
              />
            </div> */}
            <div className='w-full flex flex-col gap-2'>
              <p className='font-semibold text-neutral-500 text-base'>
                Monthly Stipend
              </p>
              <div>
                <Slider
                  min={0}
                  marks={marks}
                  step={null}
                  onChange={(key) => dispatch(setMinStipend(marks[key as number]))}
                  defaultValue={0}
                />
              </div>
            </div>
            {/* <div className='w-full flex flex-col gap-2'>
              <p className='font-semibold text-neutral-500 text-base'>
                Max Duration (in Months)
              </p>
              <div>
                <Slider
                  min={-10}
                  marks={months}
                  step={null}
                  onChange={(v) => console.log('onChange:', v)}
                  defaultValue={20}
                  onChangeComplete={(v) => console.log('AfterChange:', v)}
                />
              </div>
            </div> */}
            <div className='w-full'>
              {/* <Select
                id='mode'
                options={[]}
                value=''
                onChange={(e) => {
                  console.log(e);
                }}
                onDropdownChange={(id) => {
                  console.log(id);
                }}
                placeholder='Select Mode'
                dropdownOpen={false}
                label='Internship Mode'
              /> */}
            </div>
          </>
        )}
        <button className='ml-auto flex flex-row items-center sm:py-3 sm:px-4 py-2 px-3 justify-center gap-2 w-fit bg-primaryblue border-[1px] border-primaryblue rounded-md text-white'>
          <p onClick={handleMoreFilters} className='font-semibold sm:text-base text-sm'>Apply</p>
        </button>
      </div>
    </div>
  );
};

export default JobFilter;
