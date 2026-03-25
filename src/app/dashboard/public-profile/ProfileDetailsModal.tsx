import React from 'react';
import { UserProfileType } from '@/types/UserProfileType';

export default function ProfileDetailsModal({
  user,
  onClose,
}: {
  user: UserProfileType;
  onClose: () => void;
}) {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-8 relative overflow-y-auto"
        style={{
          maxHeight: '90vh',
          minHeight: 'auto',
          width: '100%',
        }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex items-center gap-4 mb-4">
          {user.profilePic && (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold mb-1">
              {user.firstname && user.lastname
                ? `${user.firstname} ${user.lastname}`
                : user.username || 'No Name'}
            </h2>
            {user.username && <p className="text-gray-500">@{user.username}</p>}
            {user.email && (
              <p className="text-xs text-gray-400">{user.email}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <span className="text-gray-600">Role:</span>
            <span className="ml-1 font-medium">{user.role || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-600">Points:</span>
            <span className="ml-1 font-medium">{user.points}</span>
          </div>
          <div>
            <span className="text-gray-600">Views:</span>
            <span className="ml-1 font-medium">{user.views}</span>
          </div>
          <div>
            <span className="text-gray-600">Profile:</span>
            <span
              className={`ml-1 px-2 py-1 rounded text-xs ${user.publicProfile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
              {user.publicProfile ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
        <div className="border-t pt-3 text-xs text-gray-500">
          Joined:{' '}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString()
            : 'N/A'}
        </div>
        {/* Detailed Profile Sections */}
        <div className="mt-4">
          {user.headline && (
            <div className="mb-2">
              <span className="font-semibold">Headline:</span> {user.headline}
            </div>
          )}
          {user.bio && (
            <div className="mb-2">
              <span className="font-semibold">Bio:</span> {user.bio}
            </div>
          )}
          {user.phone && (
            <div className="mb-2">
              <span className="font-semibold">Phone:</span> {user.phone}
            </div>
          )}
          {user.location && (
            <div className="mb-2">
              <span className="font-semibold">Location:</span> {user.location}
            </div>
          )}
          {user.portfolio && (
            <div className="mb-2">
              <span className="font-semibold">Portfolio:</span>{' '}
              <a
                href={user.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {user.portfolio}
              </a>
            </div>
          )}
          {user.linkedin && (
            <div className="mb-2">
              <span className="font-semibold">LinkedIn:</span>{' '}
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {user.linkedin}
              </a>
            </div>
          )}
          {user.github && (
            <div className="mb-2">
              <span className="font-semibold">GitHub:</span>{' '}
              <a
                href={user.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {user.github}
              </a>
            </div>
          )}
          {user.twitter && (
            <div className="mb-2">
              <span className="font-semibold">Twitter:</span>{' '}
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {user.twitter}
              </a>
            </div>
          )}
          {user.resumeURL && (
            <div className="mb-2">
              <span className="font-semibold">Resume:</span>{' '}
              <a
                href={user.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {user.resumeURL}
              </a>
            </div>
          )}
          {/* Education */}
          {user.education?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Education:</span>
              <ul className="list-disc ml-6">
                {user.education.map((edu, idx) => (
                  <li key={idx}>
                    {edu.degree} at {edu.institution} ({edu.startYear} -{' '}
                    {edu.endYear})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Experience */}
          {user.experience?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Experience:</span>
              <ul className="list-disc ml-6">
                {user.experience.map((exp, idx) => (
                  <li key={idx}>
                    {exp.title} at {exp.company} ({exp.startDate} -{' '}
                    {exp.endDate})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Skills:</span>{' '}
              {user.skills.join(', ')}
            </div>
          )}
          {/* Projects */}
          {user.projects?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Projects:</span>
              <ul className="list-disc ml-6">
                {user.projects.map((proj, idx) => (
                  <li key={idx}>
                    {proj.name} - {proj.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Certifications */}
          {user.certifications?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Certifications:</span>
              <ul className="list-disc ml-6">
                {user.certifications.map((cert, idx) => (
                  <li key={idx}>
                    {cert.title} by {cert.issuer} ({cert.issueDate})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Achievements */}
          {user.achievements?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Achievements:</span>{' '}
              {user.achievements.join(', ')}
            </div>
          )}
          {/* Blogs */}
          {user.blogs?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Blogs:</span>
              <ul className="list-disc ml-6">
                {user.blogs.map((blog, idx) => (
                  <li key={idx}>
                    <a
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {blog.title}
                    </a>{' '}
                    on {blog.platform}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Interests */}
          {user.interests?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Interests:</span>{' '}
              {user.interests.join(', ')}
            </div>
          )}
          {/* Languages */}
          {user.languages?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Languages:</span>{' '}
              {user.languages.join(', ')}
            </div>
          )}
          {/* Badges */}
          {user.badges?.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Badges:</span>{' '}
              {user.badges.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
