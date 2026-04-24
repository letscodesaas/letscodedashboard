'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldGroup } from '@/components/ui/field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircleIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subscribers } from '../_handlers/handler';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

function AddUser({ topics }: { topics: string }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const handleEmailUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const form = new FormData(e.currentTarget);
      form.set('email', email);
      form.set('topic', topics);
      const info = await subscribers(form);
      if (info.message == 'success') {
        toast.success('success');
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(String(error) || 'Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <PlusCircleIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add User Emails in the existing Topic - {topics}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Upload single or bulk to existing topics
          </DialogDescription>

          <Tabs defaultValue="single">
            <TabsList>
              <TabsTrigger value="single">Add email</TabsTrigger>
              <TabsTrigger value="bulk">Bulk upload</TabsTrigger>
            </TabsList>
            <TabsContent value="single">
              <form onSubmit={handleEmailUpload}>
                <FieldGroup>
                  <Field>
                    <Label>Enter email</Label>
                    <Input
                      placeholder="vishal@gmail.com"
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="default">Close</Button>
                  </DialogClose>
                  <Button variant="outline" type="submit">
                    {loading && <Spinner />}Upload
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>

            <TabsContent value="bulk">
              <form>
                <FieldGroup>
                  <Field>
                    <Label>Upload CSV File</Label>
                    <Input type="file" accept=".csv" />
                  </Field>
                </FieldGroup>
              </form>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button variant="default">Close</Button>
                </DialogClose>
                <Button variant="outline" type="submit">
                  {loading && <Spinner />}Upload
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddUser;
