'use client'
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
          ['bold', 'italic', 'underline', 'strike'],
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
      ]}
      theme="snow"
    />
  );
};

export default QuillEditor;
