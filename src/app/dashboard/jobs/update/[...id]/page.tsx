'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    requirements: string[];
    applyLink: string;
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
    requirements: [],
    applyLink: '',
  });

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await trpc.job.getJob.query({ id: id[0] });
        setJobData({
          ...data.message,
          requirements: Array.isArray(data.message.requirements)
            ? data.message.requirements
            : data.message.requirements
                .split(',')
                .map((req: string) => req.trim()), // Ensure array format
        });
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
    if (name === 'requirements') {
      setJobData((prev) => ({
        ...prev,
        requirements: value.split(',').map((req) => req.trim()),
      }));
    } else {
      setJobData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitHandler = async () => {
    try {
      setDisabled(true);

      const updatedJobs = {
        ...jobData,
        id: id[0],
        requirements: jobData.requirements.filter((req) => req.length > 0), // Remove empty entries
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
                  <SelectItem value="0+ year">0+ years</SelectItem>
                  <SelectItem value="1+ year">1+ years</SelectItem>
                  <SelectItem value="2+ year">2+ years</SelectItem>
                  <SelectItem value="3+ year">3+ years</SelectItem>
                  <SelectItem value="5+ year">5+ years</SelectItem>
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
              <Label>Requirements (comma-separated)</Label>
              <Textarea
                name="requirements"
                value={jobData.requirements.join(', ')}
                onChange={handleChange}
                required
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
