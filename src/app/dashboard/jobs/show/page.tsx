'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  applyLink: string;
  createdAt: Date;
}

function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const Router = useRouter();
  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await trpc.job.getAllJobs.query();
        setJobs(data.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, []);

  const shareLink = () => {
    const links: string[] = [];

    for (let i = 0; i < jobs.length; i++) {
      const createdAt = new Date(jobs[i]?.createdAt).getTime();
      const today = new Date().setHours(0, 0, 0, 0);

      if (createdAt >= today && jobs[i]?.applyLink) {
        links.push(jobs[i].applyLink);
      }
    }

    // Format links for clipboard copying
    let linkInfo = JSON.stringify(links);
    linkInfo = linkInfo.replace(/\[|\]/g, '');
    linkInfo = linkInfo.replace(/,/g, '\n');

    // Copy to clipboard
    window.navigator.clipboard.writeText(linkInfo);
    toast('Copied');
  };

  const handleUpdate = (id: string) => {
    console.log('Update job:', id);
    Router.push(`/dashboard/jobs/update/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await trpc.job.deleteJobPost.mutate({ id });
      toast('Deleted');
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log(error);
      toast('Server Error');
    }
  };

  return (
    <div className="p-6 w-full">
      <Button onClick={shareLink} className="mb-10">
        Get Share Link
      </Button>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table className="w-full border border-gray-200">
          <TableCaption className="text-lg font-semibold py-2">
            List of Available Jobs
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[200px] p-3">Title</TableHead>
              <TableHead className="p-3">Company</TableHead>
              <TableHead className="p-3">Location</TableHead>
              <TableHead className="p-3 text-center">Experience</TableHead>
              <TableHead className="p-3 text-center">Salary</TableHead>
              <TableHead className="p-3 text-center">Type</TableHead>
              <TableHead className="p-3 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <TableRow
                key={job._id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <TableCell className="p-3 font-medium">{job.title}</TableCell>
                <TableCell className="p-3">{job.company}</TableCell>
                <TableCell className="p-3">{job.location}</TableCell>
                <TableCell className="p-3 text-center">
                  {job.experience}
                </TableCell>
                <TableCell className="p-3 text-center">{job.salary}</TableCell>
                <TableCell className="p-3 text-center">{job.type}</TableCell>
                <TableCell className="p-3 flex justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(job._id)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Page;
