'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

function NewsletterPage() {
  const [info, setInfo] = useState({
    title: '',
    typeofPublish: '',
    to: '',
    content: '',
    createdAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchNewsletter() {
      try {
        setLoading(true);
        const { data } = await axios.post(
          '/api/mangepublishnewsletter/getpublish',
          { id }
        );

        // Make sure we handle potential null or undefined values
        if (data && data.message) {
          setInfo({
            title: data.message.title || '',
            typeofPublish: data.message.typeofPublish || '',
            to: data.message.to || '',
            content: data.message.content || '',
            createdAt: data.message.createdAt || '',
          });
        } else {
          throw new Error('Invalid response data');
        }

        setError(null);
      } catch (error) {
        console.error('Error fetching newsletter:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchNewsletter();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 w-full">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 w-full">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!info.title && !info.content) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 w-full">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Newsletter Not Found
          </h2>
          <p className="text-gray-700">
            The newsletter youre looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = info.createdAt
    ? new Date(info.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Date not available';

  return (
    <div className="h-screen bg-gray-50 py-8 w-full overflow-auto">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
        {/* Email Header */}
        <div className="mb-6 border-b pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-gray-800">{info.title}</h1>
            {info.typeofPublish && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {info.typeofPublish}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-col text-sm text-gray-600">
            {info.to && <span>To: {info.to}</span>}
            <span>Date: {formattedDate}</span>
          </div>
        </div>

        {/* Email Content */}
        <div className="newsletter-content">
          {info.content ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: info.content }}
            />
          ) : (
            <p className="text-gray-500 italic">No content available</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
          <p>This newsletter was sent to you by Let&apos;s Code</p>
          <p className="mt-1">
            © {new Date().getFullYear()} Let&apos;s Code. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewsletterPage;
