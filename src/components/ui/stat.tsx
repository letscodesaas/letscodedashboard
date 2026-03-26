import React from 'react';

function StatCard({
  title,
  value,
  loading = false,
  sub,
}: {
  title: string;
  value: string | number;
  loading?: boolean;
  sub?: string;
}) {
  return (
    <div>
      <article className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-6">
        <div>
          <strong className="block text-sm font-medium text-gray-500">
            {title}
          </strong>
          {loading ? (
            <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-200" />
          ) : (
            <p>
              <span className="text-2xl font-medium text-gray-900">
                {value}
              </span>
              {sub && (
                <span className="ml-2 text-sm text-gray-400">{sub}</span>
              )}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}

export default StatCard;
