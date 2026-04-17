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
import { upload_topic_subscriber } from '../_handlers/handler';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

function Upload() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const formdata = new FormData();
      formdata.append('topic', topic);
      if (csvFile) {
        formdata.append('csv_file', csvFile);
      }
      const data = await upload_topic_subscriber(formdata);
      toast.success(data.message || 'Uploaded successfully');
    } catch (error) {
      toast.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild >
          <Button variant="default" >Add Topics</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Upload subscribers emails</DialogTitle>
              <DialogDescription>
                Add new subscribers in new topics to send notification
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label htmlFor="topic">Topic Name</Label>
                <Input
                  id="topic"
                  name="topic"
                  required
                  onChange={(e) => setTopic(e.target.value)}
                />
              </Field>

              <Field>
                <Label htmlFor="subscribers">Emails Lists</Label>
                <Input
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  id="subscribers"
                  name="csv_file"
                  type="file"
                  accept=".csv"
                  required
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit" disabled={loading}>
                {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                Upload
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Upload;
