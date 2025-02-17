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

interface ProductData {
  _id: string;
  title: string;
  price: number;
  productLink: string;
  imageLink: string;
  description: string;
}

function Page() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const Router = useRouter();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await trpc.product.getAllProduct.query();
        console.log(data.message);
        if (data && Array.isArray(data.message)) {
          setProducts(data.message);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, []);

  const handleUpdate = (id: string) => {
    Router.push(`/dashboard/product/update/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await trpc.product.deleteProduct.mutate({ id });
      toast('Deleted');
      setProducts((prevJobs) => prevJobs.filter((job) => job._id !== id));
    } catch (error) {
      console.log(error);
      toast('Server Error');
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = products.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(products.length / jobsPerPage);

  return (
    <div className="p-6 w-full">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <Table className="w-full border border-gray-200">
          <TableCaption className="text-lg font-semibold py-2">
            List of Available Jobs
          </TableCaption>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-[200px] p-3">Title</TableHead>
              <TableHead className="p-3">Image</TableHead>
              <TableHead className="p-3 text-center">Product Link</TableHead>
              <TableHead className="p-3 text-center">Price</TableHead>
              <TableHead className="p-3 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentJobs.map((product, index) => (
              <TableRow
                key={product._id}
                className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
              >
                <TableCell className="p-3 font-medium">
                  {product.title}
                </TableCell>
                <TableCell className="p-3">
                  <div className="relative w-24 h-24 overflow-hidden rounded-lg group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-150 group-hover:shadow-lg"
                      src={product.imageLink}
                      alt="product image"
                    />
                  </div>
                </TableCell>

                <TableCell className="p-3 text-center">
                  {product.productLink}
                </TableCell>
                <TableCell className="p-3 text-center">
                  {product.price}
                </TableCell>
                <TableCell className="p-3 flex justify-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(product._id)}
                  >
                    Update
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
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
