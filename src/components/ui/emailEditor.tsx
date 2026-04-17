'use client';
import React, { useEffect, useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { useEditor } from '@/context/EditorContext';

function EmailEdit() {
  const emailEditorRef = useRef<EditorRef>(null);
  const { setEmail} = useEditor();

  useEffect(() => {
    const id = setInterval(() => {
      emailEditorRef.current.editor.exportHtml((data) => {
        const { html } = data;
        setEmail(html);
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);





  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    const templateJson = {
      body: { rows: [] }, // optional default empty template
    };
    // @ts-ignore
    unlayer.loadDesign(templateJson);
  };

  return (
    <div className="w-full h-[90vh]">
      <EmailEditor ref={emailEditorRef} minHeight={'80vh'} onReady={onReady} />
    </div>
  );
}

export default EmailEdit;
