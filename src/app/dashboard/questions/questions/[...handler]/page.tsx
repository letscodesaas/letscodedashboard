'use client';
import React from 'react';
import Question from '../../_components/Question';

function Page({ params }: { params: { handler: string[] } }) {
  if (params.handler[1] == 'view') {
    return (
      <>
        <Question id={params.handler[0]} type={params.handler[1]} />
      </>
    );
  }
  return (
    <>
      <Question id={params.handler[0]} type={params.handler[1]} />
    </>
  );
}

export default Page;
