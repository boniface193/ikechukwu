import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The project you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Back to Portfolio
        </Link>
      </div>
    </div>
  );
}