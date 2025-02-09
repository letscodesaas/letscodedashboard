'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import('@/components/ui/editor'));

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
    requirements: string;
    applyLink: string;
  }

  useEffect(() => {
    async function fetchJob() {
      try {
        const data = await trpc.job.getJob.query({ id: id[0] });
        setJobData(data.message);
      } catch (error) {
        console.log(error);
      }
    }
    fetchJob();
  }, [id]);

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
    requirements: '',
    applyLink: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    try {
      let formattedRequirements = jobData.requirements.trim();

      // Ensure a trailing comma so split() always works
      if (!formattedRequirements.endsWith(',')) {
        formattedRequirements += ',';
      }

      const updatedJobs = {
        ...jobData,
        id: id[0],
        requirements: formattedRequirements
          .split(',')
          .map((req) => req.trim()) // Trim spaces
          .filter((req) => req.length > 0), // Remove empty strings
      };

      const data = await trpc.job.updateJobPost.mutate(updatedJobs);
      setDisabled(true);
      if (data.message == 'updated') {
        toast('Job Updated');
        Router.push('/dashboard/jobs/show');
      }
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
            <div>
              <Label>Job Type</Label>
              <Input
                name="type"
                value={jobData.type}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Experience</Label>
              <Input
                name="experience"
                value={jobData.experience}
                onChange={handleChange}
                required
              />
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
                value={jobData.requirements}
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
              {disabled ? 'Loading...' : 'Update Job'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
