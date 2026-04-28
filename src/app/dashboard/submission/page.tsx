'use client';
import React, { useState, useEffect } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const id = setInterval(async () => {
        const info = await fetch(`/api/submissions`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });
        const datas = await info.json();
        setData(datas.data);
        setLoading(false);
      }, 10000);
      return () => {
        clearInterval(id);
      };
    })();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <div>Total Submission : {data.length}</div>
      </div>
      {loading ? 'Loading..' : <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default Page;
