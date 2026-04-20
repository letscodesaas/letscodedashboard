import React from 'react';
import Statusbar from './_components/Statusbar';
import Upload from './_components/Upload';
import Topics from './_components/Topics';
import Stats from './_components/Stats';
import NotificationEvent from './_components/NotiifcationEvent';

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
        <Stats />
      </div>

      <div>
        <h2 className="text-3xl font-semibold  mb-2">Topics</h2>
        <Topics />
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-2 mt-5">Notification Info</h2>
        <NotificationEvent />
      </div>
    </div>
  );
}

export default Page;
