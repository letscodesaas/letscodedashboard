'use client';
import React, { useState, useEffect } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const info = await fetch(`/api/submissions`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const datas = await info.json();
      setData(datas.data);
      setLoading(false);
    })();
  }, []);

  const handleDateChange = async (date: string) => {
    try {
      setLoading(true);
      const info = await fetch(`/api/submissions?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      const datas = await info.json();
      setData(datas.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="mb-4">
        <div className="flex flex-row  w-full items-center justify-between">
          <div>Total Submission : {data.length}</div>
          <div>
            <input
              type="date"
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      {loading ? 'Loading..' : <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default Page;
