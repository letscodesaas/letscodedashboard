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
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

interface ContentData {
  _id: string;
  name: string;
  content: string;
  category: string;
  isPublised: boolean;
  updatedAt: string;
}

function Page() {
  const [contents, setContents] = useState<ContentData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchContents() {
      try {
        const data = await axios.get('/api/managecontent/contents');
        if (!data) {
          toast.error('Error while fetch content');
        }
        setContents(data.data.message);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchContents();
  }, []);

  const handleCreate = () => {
    router.push('/dashboard/content/create');
  };

  const handleUpdate = (id: string) => {
    router.push(`/dashboard/content/update/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        // In a real application, call your API
        // await trpc.content.deleteContent.mutate({ id });

        // Update local state
        setContents((prevContents) =>
          prevContents.filter((content) => content._id !== id)
        );
        toast.success('Content deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete content');
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contents.length / itemsPerPage);

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus size={16} />
          Create New
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Manage your MDX content</TableCaption>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No content found. Create your first piece of content.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((content, index) => (
                <TableRow
                  key={content._id}
                  className={
                    index % 2 === 0
                      ? 'bg-white'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }
                >
                  <TableCell className="font-medium">{content.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-gray-100">
                      {content.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {content.content.slice(0, 20)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        content.isPublised === true
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }
                    >
                      {content.isPublised === true ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2"
                        onClick={() => handleUpdate(content._id)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-2 text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(content._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {contents.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstItem + 1} to{' '}
            {Math.min(indexOfLastItem, contents.length)} of {contents.length}{' '}
            results
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
