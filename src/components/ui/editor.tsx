'use client';

import dynamic from 'next/dynamic';
import 'quill/dist/quill.snow.css';

// Dynamically import Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const QuillEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  return (
    <ReactQuill
      className="h-36"
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['bold', 'italic', 'underline', 'strike', 'link'],
          [{ align: [] }],
          ['clean'],
        ],
      }}
      formats={[
        'header',
        'font',
        'list',
        'bold',
        'italic',
        'underline',
        'strike',
        'align',
        'link',
      ]}
      theme="snow"
    />
  );
};

export default QuillEditor;
