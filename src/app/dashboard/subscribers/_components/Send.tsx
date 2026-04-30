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
import { Slider } from '@/components/ui/slider';

function SendBulkMail({ topic, limits }: { topic: string; limits: number }) {
  const router = useRouter();
  const { emailTemplate } = useEditor();
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [limit, setLimit] = useState([1]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const datas = {
        topic,
        html: emailTemplate,
        category,
        subject,
        limit:limit[0]
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
                required
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
                required
              />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <Label>Number of subscriber {limit}</Label>
              <Slider
                value={limit}
                defaultValue={limit}
                step={1}
                onValueChange={setLimit}
                max={limits}
                min={1}
                className="mx-auto w-full max-w-xs"
                
              />
            </FieldGroup>
          </Field>
          <DialogFooter>
            <DialogClose>
              <Button variant="destructive">close</Button>
            </DialogClose>
            <Button variant="default" disabled={subject.length ===0 ||  limit[0] === 0} onClick={handleSubmit}>
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
