'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Users, Send } from 'lucide-react';
import axios from 'axios';

const SendSingleMail = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  async function sendMail() {
    try {
      const data = await axios.post('/api/newsletter/singlemail', {
        destination: email,
        body: message,
        subject,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <span>Send Single Email</span>
        </CardTitle>
        <CardDescription>Send an email to a single recipient</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Recipient Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="recipient@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-32"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2" onClick={sendMail}>
          <Send className="h-4 w-4" /> Send Email
        </Button>
      </CardFooter>
    </Card>
  );
};

const SendBulkMail = () => {
  const [subject, setSubject] = useState('');
  const [template, setTemplate] = useState('');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Send Bulk Emails</span>
        </CardTitle>
        <CardDescription>
          Send emails to multiple recipients using a template
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bulkSubject">Subject</Label>
          <Input
            id="bulkSubject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template">Email Template</Label>
          <div className="text-sm text-gray-500 mb-1">
            {/* Use {{name}} to personalize the email */}
          </div>
          <Textarea
            id="template"
            placeholder="Hello {{name}},&#10;&#10;Your message here..."
            className="min-h-32"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2">
          <Send className="h-4 w-4" /> Send Bulk Emails
        </Button>
      </CardFooter>
    </Card>
  );
};

function Page() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Email Sender</h1>
          <p className="text-gray-500">Easily send single or bulk emails</p>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Single Email
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Bulk Emails
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single">
            <SendSingleMail />
          </TabsContent>
          <TabsContent value="bulk">
            <SendBulkMail />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Page;
