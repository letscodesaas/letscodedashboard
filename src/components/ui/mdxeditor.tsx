'use client';

// InitializedMDXEditor.tsx
import type { ForwardedRef } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

// Only import this to the next file
export default function MDXEditors({
  editorRef,
  markdown = '', // Provide a default value for markdown
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  markdown?: string; // Make markdown optional with a type
} & Omit<MDXEditorProps, 'markdown'>) {
  // Ensure markdown is always a string to prevent trim() errors
  const safeMarkdown = markdown || '';

  return (
    <MDXEditor
      className="w-full min-h-[200px] border rounded p-2"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      markdown={safeMarkdown}
      {...props}
      ref={editorRef}
    />
  );
}
