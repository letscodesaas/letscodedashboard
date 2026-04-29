'use client';
import React, { useState, useEffect } from 'react';
import { columns } from './_components/columns';
import { DataTable } from './_components/data-table';
import { logs } from './_handlers/handler';

function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      const id = setInterval(async () => {
        const datas = await logs();
        console.log(datas);
        setData(datas.data);
        setLoading(false);
      }, 5000);
      return () => {
        clearInterval(id);
      };
    })();
  }, []);

  return (
    <div>
      {loading ? 'Loading..' : <DataTable columns={columns} data={data} />}
    </div>
  );
}

export default Page;
