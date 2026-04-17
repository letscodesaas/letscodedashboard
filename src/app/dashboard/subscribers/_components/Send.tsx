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
import { String } from 'aws-sdk/clients/acm';

function SendBulkMail({topic}:{topic:String}) {
  const {emailTemplate} = useEditor()
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
              <Input placeholder="Add Subject" name="subject" />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <Label>Category</Label>
              <Input placeholder="Add Category" type="text" name="category" />
            </FieldGroup>
          </Field>
          <DialogFooter>
            <DialogClose>
              <Button variant="destructive">close</Button>
            </DialogClose>
            <Button variant="default">Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SendBulkMail;
