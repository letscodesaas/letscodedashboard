'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/ui/editor'));

export default function CreateJob() {
  interface JobData {
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    description: string;
    requirements: string[];
    applyLink: string;
  }
  const [disabled, setDisabled] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    requirements: [],
    applyLink: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'requirements') {
      setJobData((prev) => ({
        ...prev,
        [name]: value.split(',').map((req) => req.trim()),
      }));
    } else {
      setJobData((prev) => ({ ...prev, [name]: value }));
    }
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
        requirements: [],
        applyLink: '',
      });
      setDisabled(false);
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
              <Input name="type" onChange={handleChange} required />
            </div>
            <div>
              <Label>Experience</Label>
              <Input name="experience" onChange={handleChange} required />
            </div>
            <div>
              <Label>Salary</Label>
              <Input name="salary" onChange={handleChange} required />
            </div>
            <div className='pb-10'>
              <Label>Description</Label>
              <QuillEditor
                value={jobData.description}
                onChange={(content:string) =>
                  setJobData((prev) => ({ ...prev, description: content }))
                  
                }
              />
            </div>
            <div>
              <Label>Requirements (comma-separated)</Label>
              <Textarea name="requirements" onChange={handleChange} required />
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
