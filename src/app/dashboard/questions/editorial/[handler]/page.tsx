'use client';
import React from 'react';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { video_system_status, upload_video } from '@/utils/editoral';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/app/_trpc/client';

function Page({ params }: { params: { handler: string } }) {
  const [status, setStatus] = useState(200);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const isOnline = status === 200;

  useEffect(() => {
    const intervalId = setInterval(() => {
      video_system_status()
        .then((e) => {
          setStatus(e);
          console.log(e);
        })
        .catch((e) => {
          setStatus(500);
          console.log(e);
        });
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOnline) {
      setUploadMessage(
        'Video service is offline. Please try again in a moment.'
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    const selectedFile = formData.get('editorialVideo');

    if (!(selectedFile instanceof File) || selectedFile.size === 0) {
      setUploadMessage('Please select a video before uploading.');
      return;
    }

    setIsUploading(true);
    setUploadMessage('Uploading video...');

    try {
      const uploadData = new FormData();
      uploadData.append('video', selectedFile);

      const video_url = await upload_video(uploadData);

      await trpc.question.addVideoLink.mutate({
        id: params.handler,
        link: video_url,
      });

      setUploadMessage('Video uploaded successfully.');
      e.currentTarget.reset();
    } catch (error) {
      setUploadMessage(
        error instanceof Error ? error.message : 'Failed to upload video.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-end w-full justify-end ">
        <div className="max-w-xs rounded-xl  bg-white/80 p-3 shadow-sm backdrop-blur-sm">
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline
                    ? 'bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]'
                    : 'bg-rose-500 shadow-[0_0_0_4px_rgba(244,63,94,0.14)]'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isOnline ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="editoral">Editoral Video</FieldLabel>
          <Input
            disabled={!isOnline || isUploading}
            id="editorialVideo"
            name="editorialVideo"
            type="file"
            accept="video/*"
          />
          <FieldDescription>Select a video to upload.</FieldDescription>
        </Field>
        {uploadMessage && (
          <p className="mt-2 text-sm text-slate-600">{uploadMessage}</p>
        )}
        <Button
          className="w-full"
          type="submit"
          disabled={!isOnline || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </div>
  );
}

export default Page;
