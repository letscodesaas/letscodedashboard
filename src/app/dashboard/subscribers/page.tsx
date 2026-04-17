import React from 'react';
import Statusbar from './_components/Statusbar';
import Upload from './_components/Upload';
import Topics from './_components/Topics';

function Page() {
  return (
    <div>
      <div className="flex items-center justify-end">
        <Statusbar />
      </div>
      <div className="flex items-center mt-5 justify-end">
        <Upload />
      </div>

      <div>
        <Topics />
      </div>
    </div>
  );
}

export default Page;
