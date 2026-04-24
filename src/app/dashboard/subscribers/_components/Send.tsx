'use client';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useEditor } from '@/context/EditorContext';
import { send_Bulk_mail, managesemails } from '../_handlers/handler';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

function SendBulkMail({ topic }: { topic: string }) {
  const router = useRouter();
  const { emailTemplate } = useEditor();
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const datas = {
        topic,
        html: emailTemplate,
        category,
        subject,
      };

      const response = await send_Bulk_mail(datas);
      await managesemails(datas);
      toast(response.message);
      setLoading(false);
      router.push('/dashboard/subscribers');
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(String(error) || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>Schedule Mails</Button>
        </DialogTrigger>
        <DialogContent>
          <Field>
            <FieldGroup>
              <Label>Subject</Label>
              <Input
                placeholder="Add Subject"
                name="subject"
                onChange={(e) => setSubject(e.target.value)}
              />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <Label>Category</Label>
              <Input
                placeholder="Add Category"
                type="text"
                name="category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </FieldGroup>
          </Field>
          <DialogFooter>
            <DialogClose>
              <Button variant="destructive">close</Button>
            </DialogClose>
            <Button variant="default" onClick={handleSubmit}>
              {loading && <Spinner />}
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SendBulkMail;
