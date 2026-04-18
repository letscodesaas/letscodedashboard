'use client';
import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2 } from 'lucide-react';
import { generate_ai_email_template } from '../_handlers/handler';
import { toast } from 'sonner';

function HtmlEditor() {
  const { setEmail, emailTemplate } = useEditor();
  const [emailcode, setEmailCode] = useState('');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await generate_ai_email_template(template);
      setEmail(data);
      setEmailCode(data);
      setLoading(false);
    } catch (error) {
      toast(String(error));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-5">
      <div className="flex items-center justify-end">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline">
              Generate with AI <Edit2 />{' '}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate the content using AI</DialogTitle>
            </DialogHeader>
            <Textarea
              className="h-[10rem]"
              placeholder="generate a welcome email template"
              onChange={(e) => setTemplate(e.target.value)}
            />
            <DialogFooter>
              <DialogClose>
                <Button variant="destructive">close</Button>
              </DialogClose>
              <Button variant="link" disabled={loading} onClick={handleSubmit}>
                {loading ? 'Genrating....' : 'Generate'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="editor">
          <Textarea
            placeholder="Add email html template"
            className="w-full h-[40rem]"
            onChange={(e) => {
              setEmailCode(e.target.value);
              setEmail(e.target.value);
            }}
            value={emailcode}
          />
        </TabsContent>

        <TabsContent value="preview">
          <div
            dangerouslySetInnerHTML={{
              __html: emailTemplate,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default HtmlEditor;
