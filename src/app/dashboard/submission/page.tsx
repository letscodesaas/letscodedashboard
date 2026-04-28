'use client';
import React, { useState, useEffect } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   (async function () {
  //     const id = setInterval(async () => {
  //       const info = await fetch(`/api/submissions`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-type': 'application/json',
  //         },
  //       });
  //       const datas = await info.json();
  //       setData(datas.data);
  //       setLoading(false);
  //     }, 20000);
  //     return () => {
  //       return clearInterval(id);
  //     };
  //   })();
  // }, []);

  useEffect(() => {
    (async function () {
      const info = await fetch(`/api/submissions`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const datas = await info.json();
      console.log(datas)
      setData(datas.data);
      setLoading(false);
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
