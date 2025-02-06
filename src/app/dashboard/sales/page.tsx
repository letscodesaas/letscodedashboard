import React from 'react';
import StatCard from '@/components/ui/stat';
import { VistorComponent } from '@/components/ui/vistor-chart';

function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen dark:bg-gray-900 w-full">
      {/* Stats Overview */}
      <h1 className="text-center font-bold text-4xl">Sales DashBoard</h1>
      <h3 className="text-xl text-left font-semibold">Product Activities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Jobs" value="10.2K" />
        <StatCard title="Active Jobs" value="320" />
        <StatCard title="Cron Job Status" value="$12.5K" />
        <StatCard title="Applied Jobs" value="150" />
      </div>
      <h3 className="text-xl text-left font-semibold">Sales Activites</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="10.2K" />
        <StatCard title="New Signups" value="320" />
        <StatCard title="Revenue" value="$12.5K" />
        <StatCard title="Active Sessions" value="150" />
      </div>

      {/* Charts and More Stats */}
      <div className="w-full">
        {/* Visitor Chart */}
        <div className="col-span-2 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Visitor Statistics
          </h2>
          <VistorComponent />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
