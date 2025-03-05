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
import Link from 'next/link';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const Router = useRouter();

  useEffect(() => {
    const savedPage = window.sessionStorage.getItem('page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
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

  useEffect(() => {
    window.sessionStorage.setItem('page', currentPage.toString());
  }, [currentPage]);

  const shareLink = () => {
    const links: string[] = [];

    for (let i = 0; i < jobs.length; i++) {
      const createdAt = new Date(jobs[i]?.createdAt).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      if (createdAt >= today && jobs[i]?.applyLink) {
        links.push(`https://www.lets-code.co.in/job/${jobs[i]._id}`);
      }
    }

    let linkInfo = JSON.stringify(links);
    linkInfo = linkInfo.replace(/\[|\]/g, '').replace(/,/g, '\n');
    window.navigator.clipboard.writeText(linkInfo);
    if (links.length > 0) {
      toast('Copied');
      return;
    }
    toast('No latest Jobs Posted');
  };

  const handleUpdate = (id: string) => {
    Router.push(`/dashboard/jobs/update/${id}`);
  };

  const handleDeactivate = async (id: string) => {
    try {
      const result = await trpc.job.deactivateJob.mutate({ id });
      console.log(result);
      toast('Deactivated');
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log(error);
    }
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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

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
            {currentJobs.map((job, index) => (
              <TableRow
                key={job._id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <TableCell className="p-3 font-medium">
                  <Link href={job.applyLink}>{job.title}</Link>
                </TableCell>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeactivate(job._id)}
                  >
                    Deactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center mt-4 gap-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Page;
