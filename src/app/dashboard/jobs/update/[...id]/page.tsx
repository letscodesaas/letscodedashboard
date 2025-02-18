'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const QuillEditor = dynamic(() => import('@/components/ui/editor'), {
  ssr: false,
});

export default function UpdateJob() {
  const { id } = useParams();
  const Router = useRouter();

  interface JobData {
    id: string;
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

  const [disabled, setDisabled] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    id: '',
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

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await trpc.job.getJob.mutate({ id: id[0] });
        if (data) {
          setJobData({
            ...data.message,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchJob();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async () => {
    try {
      setDisabled(true);

      const updatedJobs = {
        ...jobData,
        id: id[0],
      };

      const data = await trpc.job.updateJobPost.mutate(updatedJobs);
      if (data.message === 'updated') {
        toast('Job Updated');
        Router.push('/dashboard/jobs/show');
      }
    } catch (error) {
      toast('Server Error');
      console.log(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Job</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                name="company"
                value={jobData.company}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Job Type Dropdown */}
            <div>
              <Label>Job Type</Label>
              <Select
                value={jobData.type}
                onValueChange={(value) =>
                  setJobData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status of job */}

            <div>
              <Label>Job Status</Label>
              <Select
                value={jobData.status.toString()} // Convert boolean to string
                onValueChange={
                  (value) =>
                    setJobData((prev) => ({
                      ...prev,
                      status: value === 'true',
                    })) // Convert string back to boolean
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Job Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">UnActive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience Level Dropdown */}
            <div>
              <Label>Experience</Label>
              <Select
                value={jobData.experience}
                onValueChange={(value) =>
                  setJobData((prev) => ({ ...prev, experience: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0+ years">0+ years</SelectItem>
                  <SelectItem value="1+ years">1+ years</SelectItem>
                  <SelectItem value="2+ years">2+ years</SelectItem>
                  <SelectItem value="3+ years">3+ years</SelectItem>
                  <SelectItem value="5+ years">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                required
              />
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
              <Input
                name="applyLink"
                value={jobData.applyLink}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              disabled={disabled}
              onClick={submitHandler}
              className="w-full"
            >
              {disabled ? 'Updating...' : 'Update Job'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
