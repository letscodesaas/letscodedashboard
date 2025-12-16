'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { trpc } from '@/app/_trpc/client';
import { toast } from 'sonner';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function Page() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('**Hello world!!!**');
  const [category, setCategory] = useState('');
  const [contentType, setContentType] = useState<'FREE' | 'PAID' | ''>('');
  const [expectedInputs, setExpectedInputs] = useState('');
  const [expectedOutputs, setExpectedOutputs] = useState('');
  const [testInputs, setTestInputs] = useState('');
  const [testOutputs, setTestOutputs] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await trpc.question.addquestions.mutate({
        title,
        content,
        categories: category,
        contentType,
        exceptedInput: expectedInputs,
        exceptedOutput: expectedOutputs,
        testInput: testInputs,
        testOutput: testOutputs,
      });
      setLoading(false);
      toast(response.message);
      setTitle('');
      setContent('');
      setCategory('');
      setContentType('');
      setExpectedInputs('');
      setExpectedOutputs('');
      setTestInputs('');
      setTestOutputs('');
    } catch (error) {
      toast.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted/40 p-6 flex justify-center">
      <Card className="w-full max-w-7xl shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Add New Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Question name"
                required
              />
            </div>

            {/* Question Content */}
            <div className="md:col-span-2 space-y-2">
              <Label>Question Content</Label>
              <div
                data-color-mode="light"
                className="border rounded-xl overflow-hidden"
              >
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={300}
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Array, Graph, DP"
              />
            </div>

            {/* Content Type */}
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select
                value={contentType}
                onValueChange={(val) => setContentType(val as 'FREE' | 'PAID')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">FREE</SelectItem>
                  <SelectItem value="PAID">PAID</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Expected Inputs */}
            <div className="space-y-2">
              <Label>Expected Inputs</Label>
              <Textarea
                value={expectedInputs}
                onChange={(e) => setExpectedInputs(e.target.value)}
                placeholder="Enter expected inputs"
                className="min-h-[120px]"
              />
            </div>

            {/* Expected Outputs */}
            <div className="space-y-2">
              <Label>Expected Outputs</Label>
              <Textarea
                value={expectedOutputs}
                onChange={(e) => setExpectedOutputs(e.target.value)}
                placeholder="Enter expected outputs"
                className="min-h-[120px]"
              />
            </div>

            {/* Test Inputs */}
            <div className="space-y-2">
              <Label>Test Inputs</Label>
              <Textarea
                value={testInputs}
                onChange={(e) => setTestInputs(e.target.value)}
                placeholder="Enter test inputs"
                className="min-h-[120px]"
              />
            </div>

            {/* Test Outputs */}
            <div className="space-y-2">
              <Label>Test Outputs</Label>
              <Textarea
                value={testOutputs}
                onChange={(e) => setTestOutputs(e.target.value)}
                placeholder="Enter test outputs"
                className="min-h-[120px]"
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end pt-4">
              <Button disabled={loading} type="submit" size="lg" className="rounded-xl px-8">
                {loading ? 'Adding...' : 'Add Question'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
