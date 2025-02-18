'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
});

export default function CreateJob() {
  interface JobData {
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    description: string;
    applyLink: string;
    status: boolean;
  }

  const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  const experienceLevels = [
    '0+ years',
    '1+ years',
    '2+ years',
    '3+ years',
    '5+ years',
  ];

  const [disabled, setDisabled] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    applyLink: '',
    status: true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setJobData((prev) => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value, // Convert status to boolean
    }));
  };

  const submitHandler = async () => {
    try {
      const data = await trpc.job.createJobPost.mutate(jobData);
      setDisabled(true);
      if (data.message == 'created') {
        toast('Job Posted');
      }
      setJobData({
        title: '',
        company: '',
        location: '',
        type: '',
        experience: '',
        salary: '',
        description: '',
        applyLink: '',
        status: true,
      });
      setDisabled(false);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast('Server Error');
      console.log(error);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input name="title" onChange={handleChange} required />
            </div>
            <div>
              <Label>Company</Label>
              <Input name="company" onChange={handleChange} required />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" onChange={handleChange} required />
            </div>
            <div>
              <Label>Job Type</Label>
              <select
                name="type"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Job Type</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Job Status</Label>
              <select
                name="status"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Job Type</option>
                <option value="true">Active</option>
                <option value="false">UnActive</option>
              </select>
            </div>

            <div>
              <Label>Experience</Label>
              <select
                name="experience"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Experience Level</option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Salary</Label>
              <Input name="salary" onChange={handleChange} required />
            </div>
            <div className="pb-10">
              <Label>Description</Label>
              <QuillEditor
                value={jobData.description}
                onChange={(content: string) =>
                  setJobData((prev) => ({ ...prev, description: content }))
                }
              />
            </div>
            <div>
              <Label>Apply Link</Label>
              <Input name="applyLink" onChange={handleChange} required />
            </div>
            <Button
              disabled={disabled}
              onClick={submitHandler}
              className="w-full"
            >
              {disabled ? 'Loading...' : 'Create Job'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
