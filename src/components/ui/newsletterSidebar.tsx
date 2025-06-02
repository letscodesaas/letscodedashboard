import Link from 'next/link';
import { Button } from './button';

interface Newsletter {
  _id: string;
  title: string;
  createdAt?: string; 
  to?: string;
  content?: string;
  typeofPublish?: string;
}

// Define interface for API response
interface NewsletterApiResponse {
  message: Newsletter[];
  // Add other properties in the API response if needed
  success?: boolean;
}

async function NewsLetterSidebar() {
  try {
    // Use relative URL with proper environment variable
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(
      `${apiUrl}/api/mangepublishnewsletter/getpublishnewletter`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch newsletters');
    }

    const data = (await response.json()) as NewsletterApiResponse;

    // Format date function to make dates more readable
    const formatDate = (dateString?: string) => {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch (error) {
        console.log(error)
        return dateString; // Return original string if parsing fails
      }
    };

    return (
      <div>
        <div className="flex w-[20rem] h-screen flex-col justify-between border-e bg-white overflow-y-auto">
          <div className="px-4 py-6">
            <Link href="/dashboard/newsletter">
              <Button className="mb-7">Go back</Button>
            </Link>
            <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              Newsletter
            </span>

            <ul className="mt-6 space-y-1">
              {data &&
              data.message &&
              Array.isArray(data.message) &&
              data.message.length > 0 ? (
                data.message.map((ele: Newsletter) => (
                  <li key={ele._id || `newsletter-${Math.random()}`}>
                    <Link
                      href={`/published/${ele._id || ''}`}
                      className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      {ele.title || 'Untitled'}
                      {ele.createdAt && (
                        <span className="block text-xs text-gray-500 mt-1">
                          {formatDate(ele.createdAt)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-500">
                  No newsletters found
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    return (
      <div className="flex w-[20rem] h-screen flex-col justify-between border-e bg-white">
        <div className="px-4 py-6">
          <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            Newsletter
          </span>
          <p className="mt-6 px-4 py-2 text-sm text-red-500">
            Failed to load newsletters. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export default NewsLetterSidebar;
