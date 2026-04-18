'use client';
import { createContext, useContext, useState } from 'react';

const EditorContext = createContext({
  emailTemplate: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setEmail: (e: string) => {},
});

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('Editor context required');
  }
  return context;
};

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState('');

  const updateValue = (e) => {
    setValue(e);
  };

  const InitalValue = {
    emailTemplate: value,
    setEmail: updateValue,
  };

  return (
    <>
      <EditorContext.Provider value={InitalValue}>
        {children}
      </EditorContext.Provider>
    </>
  );
};
