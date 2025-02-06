'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";

export default function CreateJob() {
  //   const router = useRouter();

  interface JobData {
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
    description: string;
    requirements: string;
  }

  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    type: '',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await fetch("/api/jobs", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           ...jobData,
  //           requirements: jobData.requirements
  //             .split(",")
  //             .map((req) => req.trim()),
  //         }),
  //       });
  //       if (response.ok) {
  //         toast.success("Job posted successfully!");
  //         router.push("/jobs");
  //       } else {
  //         toast.error("Failed to post job.");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("An error occurred. Please try again.");
  //     }
  //   };

  return (
    <div className="w-full mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
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
            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                required
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
            <Button type="submit" className="w-full">
              Post Job
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
