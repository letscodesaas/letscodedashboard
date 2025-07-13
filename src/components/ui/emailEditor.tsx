'use client';
import React, { useRef } from 'react';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { Button } from './button';

function EmailEdit() {
  const emailEditorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    const unlayer = emailEditorRef.current?.editor;
    unlayer?.exportHtml((data) => {
      const { html } = data;
      navigator.clipboard.writeText(html).then(() => {
        alert('HTML copied to clipboard!');
      }).catch((err) => {
        console.error('Clipboard copy failed', err);
      });
    });
  };

  const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    const templateJson = {
      body: { rows: [] } // optional default empty template
    };
    // @ts-ignore
    unlayer.loadDesign(templateJson);
  };

  return (
    <div className="w-[60vw] h-[90vh]">
      <Button onClick={exportHtml}>Copy HTML</Button>
      <EmailEditor ref={emailEditorRef} minHeight={'80vh'} onReady={onReady} />
    </div>
  );
}

export default EmailEdit;
