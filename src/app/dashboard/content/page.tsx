'use client';

import React, { useRef, useState } from 'react';
import MDXEditors from '@/components/ui/mdxeditor';
import Markdown from 'markdown-to-jsx';
function Page() {
  const editor = useRef(null);
  const [preview, setPreview] = useState(false);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Content</h1>

      <div className="flex flex-row items-center justify-between py-3">
        <div className="flex flex-row items-center justify-evenly gap-5">
          <div>
            <select name="" id="">
              <option value="">choose</option>
              <option value="">Blog</option>
              <option value="">PYQs</option>
              <option value="">Content</option>
            </select>
          </div>
          <div className="flex flex-col ">
            <label htmlFor="">Enter file Name</label>
            <input type="text" placeholder="Enter file name sample.mdx" />
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <button
            onClick={() => setPreview(!preview)}
            className="bg-blue-600 text-white rounded-md px-10 py-1"
          >
            Preview
          </button>
          <button className="bg-blue-500 text-white rounded-md px-10 py-1">
            Post
          </button>
        </div>
      </div>
      <div className="border rounded p-2 min-h-[300px]">
        {preview ? (
          <MDXEditors
            editorRef={editor}
            markdown={markdownContent}
            onChange={(value) => setMarkdownContent(value || '')}
          />
        ) : (
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
                p: { component: 'p', props: { className: markdownStyles.p } },
                strong: {
                  component: 'strong',
                  props: { className: markdownStyles.strong },
                },
                li: {
                  component: 'li',
                  props: { className: markdownStyles.li },
                },
                a: { component: 'a', props: { className: markdownStyles.a } },
                img: {
                  component: 'img',
                  props: { className: markdownStyles.img },
                },
              },
            }}
          >
            {markdownContent}
          </Markdown>
        )}
      </div>
    </div>
  );
}

export default Page;
