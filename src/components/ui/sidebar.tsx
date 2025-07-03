'use client';
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { JobLink, NewsletterLink, ProductLink, TeamsLink } from './links';

function Sidebar() {
  const auth = useAuth();
  const handleLogout = () => {
    window.sessionStorage.removeItem('token');
    window.location.replace('/');
  };
  return (
    <div>
      <div className="flex w-[16rem] h-screen flex-col justify-between border-e bg-white relative overflow-y-scroll">
        <div className="px-4 py-6">
          <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            LET&apos;s CODE
          </span>

          <ul className="mt-6 space-y-1">
            <li>
              <a
                href="/dashboard"
                className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
              >
                General
              </a>
            </li>

            <li>
              <a
                href="/dashboard/taskmanager"
                className="block rounded-lg  px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Task Manager
              </a>
            </li>
            {/* @ts-ignore */}
            <TeamsLink data={auth?.policy[2]} role={auth?.role} />
            {/* @ts-ignore */}
            <JobLink data={auth?.policy[0]} role={auth?.role} />
            {/* @ts-ignore */}
            <ProductLink data={auth?.policy[1]} role={auth?.role} />
            {/* @ts-ignore */}
            <NewsletterLink data={auth?.policy[3]} role={auth?.role} />

            <li>
              <details className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                  <span className="text-sm font-medium"> Account </span>

                  <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </summary>

                <ul className="mt-2 space-y-1 px-4">
                  <li>
                    <a
                      href="#"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      Details
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      Security
                    </a>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <a
            href="#"
            className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
          >
            <div>
              <p className="text-xs">
                <span>
                  {/* @ts-ignore */}
                  {auth?.email}
                </span>
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
