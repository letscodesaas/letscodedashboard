'use client';

import React, { useRef, useState } from 'react';
import MDXEditors from '@/components/ui/mdxeditor';
import Markdown from 'markdown-to-jsx';
import { ChevronDown, Eye, EyeOff, Send } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

function Page() {
  const editor = useRef(null);
  const [preview, setPreview] = useState(false);
  const [contentType, setContentType] = useState('');
  const [fileName, setFileName] = useState('');
  const [markdownContent, setMarkdownContent] = useState(
    '# Hello World\n\nStart typing here...'
  );

  // Responsive styles for Markdown elements
  const markdownStyles = {
    h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6',
    h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mt-8 mb-4',
    h3: 'text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mt-6 mb-3',
    p: 'text-base sm:text-lg text-gray-600 leading-relaxed mb-6',
    strong: 'font-bold text-gray-900',
    li: 'text-base sm:text-lg text-gray-600 mb-2 list-disc ml-6',
    a: 'text-blue-600 hover:text-blue-800 underline',
    img: 'w-full h-auto my-6 rounded-lg shadow-md',
  };

  async function createPost() {
    try {
      const data = await axios.post('/api/managecontent/createcontent', {
        name: fileName,
        content: markdownContent,
        category: contentType,
        isPublised: true,
      });
      if (data.data.message === 'CREATED') {
        setContentType('');
        setFileName('');
        setMarkdownContent('');
        toast('Created');
      }
    } catch (error) {
      console.log(error);
      toast.error('Some went wrong');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 w-full">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Content Creator Studio
          </h1>
          <p className="text-gray-600">
            Create, edit, and publish your MDX content
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header & Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-48">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Content Type
                  </label>
                  <div className="relative">
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="block w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="blog">Blog</option>
                      <option value="pyqs">PYQs</option>
                      <option value="content">Content</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Content Name
                  </label>
                  <input
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="my content"
                    className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPreview(!preview)}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                  border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                >
                  {preview ? (
                    <>
                      <EyeOff size={18} className="mr-2" />
                      Edit
                    </>
                  ) : (
                    <>
                      <Eye size={18} className="mr-2" />
                      Preview
                    </>
                  )}
                </button>
                <button
                  onClick={createPost}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2.5 font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600
                  bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                >
                  <Send size={18} className="mr-2" />
                  Publish
                </button>
              </div>
            </div>
          </div>

          {/* Editor/Preview Area */}
          <div className="p-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden min-h-[500px] transition-all duration-200">
              <div className="h-full">
                {preview ? (
                  <div className="p-8 prose prose-blue max-w-none h-full overflow-auto bg-white">
                    <Markdown
                      options={{
                        overrides: {
                          h1: {
                            component: 'h1',
                            props: { className: markdownStyles.h1 },
                          },
                          h2: {
                            component: 'h2',
                            props: { className: markdownStyles.h2 },
                          },
                          h3: {
                            component: 'h3',
                            props: { className: markdownStyles.h3 },
                          },
                          p: {
                            component: 'p',
                            props: { className: markdownStyles.p },
                          },
                          strong: {
                            component: 'strong',
                            props: { className: markdownStyles.strong },
                          },
                          li: {
                            component: 'li',
                            props: { className: markdownStyles.li },
                          },
                          a: {
                            component: 'a',
                            props: {
                              className: markdownStyles.a,
                              target: '_blank',
                              rel: 'noopener noreferrer',
                            },
                          },
                          img: {
                            component: 'img',
                            props: { className: markdownStyles.img },
                          },
                        },
                      }}
                    >
                      {markdownContent}
                    </Markdown>
                  </div>
                ) : (
                  <div className="h-full bg-gray-50">
                    <MDXEditors
                      editorRef={editor}
                      markdown={markdownContent}
                      onChange={(value) => setMarkdownContent(value || '')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {fileName ? fileName : 'Untitled'} • {markdownContent.length}{' '}
              characters
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
