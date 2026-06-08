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
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

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

interface DeadLinkJob {
  _id: string;
  title: string;
  company: string;
  applyLink: string;
  linkStatus: string;
  httpStatus: number;
}

function Page() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [checking, setChecking] = useState(false);
  const [deadLinkJobs, setDeadLinkJobs] = useState<DeadLinkJob[] | null>(null);
  const [confirmJob, setConfirmJob] = useState<DeadLinkJob | null>(null);
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

  const handleCheckDeadLinks = async () => {
    setChecking(true);
    setDeadLinkJobs(null);
    try {
      const results = await trpc.job.checkJobLinks.mutate();
      const dead = results.filter((r) => r.linkStatus !== 'alive');
      setDeadLinkJobs(dead);
      if (dead.length === 0) {
        toast('All job links are active!');
      } else {
        toast(`Found ${dead.length} dead or unreachable link(s)`);
      }
    } catch (error) {
      console.error(error);
      toast('Failed to check links');
    } finally {
      setChecking(false);
    }
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
      setDeadLinkJobs((prev) => prev?.filter((j) => j._id !== id) ?? null);
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

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q)
    );
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="p-6 w-full">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Total Active Jobs</p>
          <p className="text-3xl font-bold text-gray-800">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Filtered Results</p>
          <p className="text-3xl font-bold text-blue-600">{filteredJobs.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Posted Today</p>
          <p className="text-3xl font-bold text-green-600">
            {jobs.filter((j) => new Date(j.createdAt).getTime() >= new Date().setHours(0, 0, 0, 0)).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <p className="text-xs text-gray-500">Dead Links Found</p>
          <p className="text-3xl font-bold text-red-500">
            {deadLinkJobs === null ? '—' : deadLinkJobs.length}
          </p>
        </div>
      </div>

      {/* Top bar */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Button onClick={shareLink}>Get Share Link</Button>
        <Button
          variant="outline"
          onClick={handleCheckDeadLinks}
          disabled={checking}
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking links...
            </>
          ) : (
            'Check Dead Links'
          )}
        </Button>
        <Input
          placeholder="Search by title, company or location..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* Dead link results */}
      {deadLinkJobs !== null && (
        <div className="mb-6 border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <h2 className="font-semibold text-gray-800">
              Dead Link Check Results
            </h2>
            <span className="text-xs text-gray-500 ml-auto">
              {jobs.length} jobs checked
            </span>
          </div>

          {deadLinkJobs.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 text-sm py-2">
              <CheckCircle2 className="w-4 h-4" />
              All apply links are active. No action needed.
            </div>
          ) : (
            <div className="space-y-2">
              {deadLinkJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between gap-4 p-3 rounded-md bg-red-50 border border-red-100"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {job.title} — {job.company}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {job.applyLink}
                      </p>
                      <p className="text-xs mt-0.5">
                        {job.linkStatus === 'dead' ? (
                          <span className="text-red-600 font-medium">
                            HTTP {job.httpStatus} (Dead link)
                          </span>
                        ) : (
                          <span className="text-orange-600 font-medium">
                            Unreachable / Timed out
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="shrink-0"
                    onClick={() => setConfirmJob(job)}
                  >
                    Deactivate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jobs table */}
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

      {/* Pagination */}
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

      {/* Confirmation dialog */}
      <AlertDialog open={!!confirmJob} onOpenChange={() => setConfirmJob(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this job?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-gray-800">
                {confirmJob?.title} — {confirmJob?.company}
              </span>
              <br />
              <span className="text-sm mt-1 block">
                {confirmJob?.linkStatus === 'dead'
                  ? `The apply link returned HTTP ${confirmJob?.httpStatus}. This job appears to be expired.`
                  : 'The apply link is unreachable or timed out.'}
              </span>
              <br />
              This will hide the job from the public listing. This action can be
              reversed by updating the job status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (confirmJob) {
                  handleDeactivate(confirmJob._id);
                  setConfirmJob(null);
                }
              }}
            >
              Yes, Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Page;
