import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff5f7] text-zinc-800 p-4">
      <h2 className="text-2xl font-bold text-pink-600 mb-2">Page Not Found</h2>
      <p className="text-zinc-600 mb-4">Could not find the requested resource.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-pink-600 text-white rounded-full text-sm font-medium hover:bg-pink-700 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
