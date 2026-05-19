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
  const [rawJobText, setRawJobText] = useState('');
  const [parsing, setParsing] = useState(false);
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

  const parseJobHandler = async () => {
    if (!rawJobText.trim()) {
      toast.error('Please enter job posting text');
      return;
    }

    setParsing(true);
    try {
      const result = await trpc.job.parseJobText.mutate({ text: rawJobText });
      if (result.success && result.data) {
        setJobData((prev) => ({
          ...prev,
          ...result.data,
          status: true,
        }));
        toast.success('Job details auto-filled! Review and adjust if needed.');
        setRawJobText('');
      } else {
        toast.error('Failed to parse job text');
      }
    } catch (error: unknown) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : 'Failed to parse job text. Please fill in manually.';
      toast.error(errorMsg);
      console.error('Parse error:', error);
    } finally {
      setParsing(false);
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
          <div className="space-y-6">
            {/* Quick Add Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">
                Quick Add (Auto-Fill)
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Paste job posting text and we&apos;ll automatically extract the
                details:
              </p>
              <textarea
                value={rawJobText}
                onChange={(e) => setRawJobText(e.target.value)}
                placeholder="Paste job posting text here...&#10;Example: Interview.io is hiring SDE I (Full Stack Developer)&#10;Batch: 2022, 2023, 2024, 2025&#10;Location: Bangalore&#10;Apply: https://..."
                className="w-full p-3 border rounded-md text-sm mb-3 font-mono"
                rows={6}
              />
              <Button
                onClick={parseJobHandler}
                disabled={parsing || !rawJobText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {parsing ? 'Parsing...' : 'Parse & Auto-Fill'}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Manual Form Section */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-700">Manual Entry</h3>
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
                  <select
                    name="type"
                    value={jobData.type}
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
                    value={jobData.status ? 'true' : 'false'}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Job Status</option>
                    <option value="true">Active</option>
                    <option value="false">UnActive</option>
                  </select>
                </div>

                <div>
                  <Label>Experience</Label>
                  <select
                    name="experience"
                    value={jobData.experience}
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
                  {disabled ? 'Loading...' : 'Create Job'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
