'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  jobsPolicy,
  newslettersPolicy,
  productsPolicy,
  teamsPolicy,
} from '@/utils/policy';

export default function LoginForm() {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '',
    role: '',
    verified: false,
    policy: [],
  });

  async function createUser() {
    try {
      console.log(userInfo);
      const info = await trpc.auth.signup.mutate(userInfo);
      if (info?.statusCode == 201) {
        toast('User created');
      }
      setUserInfo({
        email: '',
        password: '',
        role: '',
        verified: false,
        policy: [],
      });
    } catch (error) {
      console.log(error);
      toast('Something went wrong');
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 w-full p-10')}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Member</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={userInfo.password}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="role">Role</Label>
                </div>
                <Select
                  value={userInfo.role}
                  onValueChange={(value) =>
                    setUserInfo({ ...userInfo, role: value })
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select a Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Job Policy</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() => {
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, jobsPolicy('0')],
                        });
                      }}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      No Job
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, jobsPolicy('1')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage Jobs
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, jobsPolicy('2')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage and Create Jobs
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Product Policy</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() => {
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, productsPolicy('0')],
                        });
                      }}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      No Product
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, productsPolicy('1')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage Products
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, productsPolicy('2')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage and Create Products
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Team Policy</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() => {
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, teamsPolicy('0')],
                        });
                      }}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      No Teams
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, teamsPolicy('1')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage Teams
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, teamsPolicy('2')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage and Create Teams
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Newsletter Policy</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() => {
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, newslettersPolicy('0')],
                        });
                      }}
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      No Newsletters
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, newslettersPolicy('1')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage Newsletters
                    </Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      onChange={() =>
                        setUserInfo({
                          ...userInfo,
                          policy: [...userInfo.policy, newslettersPolicy('2')],
                        })
                      }
                      type="radio"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      Manage and Create Newsletters
                    </Label>
                  </div>
                </div>
              </div>

              <Button onClick={createUser} className="w-full">
                Create
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
