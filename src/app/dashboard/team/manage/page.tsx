'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define the User interface
interface User {
  _id: string;
  email: string;
  verified: boolean;
  role: string;
}

export default function TableDemo() {
  const [users, setUsers] = useState<User[]>([]);

  const handleUpdate = async (userId: string) => {
    try {
      await trpc.auth.verify.mutate({ id: userId });
      toast('User verification updated');
      // Refresh user list after update
      fetchUsers();
    } catch (error) {
      console.log(error);
      toast('Failed to update user verification');
    }
  };

  async function fetchUsers() {
    try {
      const data = await trpc.auth.users.query();
      setUsers(data.message);
    } catch (error) {
      console.log(error);
      toast('Failed to fetch users');
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-10 w-full">
      <Table>
        <TableCaption>User Management System</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Verification Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={user.verified ? 'text-green-600' : 'text-red-600'}
                >
                  {user.verified ? 'Verified' : 'Not Verified'}
                </span>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdate(user._id)}
                >
                  {user.verified ? 'Unverify' : 'Verify'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Users</TableCell>
            <TableCell className="text-right">{users.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
