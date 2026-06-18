import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-white">Lesson not found</h1>
      <p className="text-gray-400">
        That page isn&apos;t part of the guide (yet).
      </p>
      <Link
        href="/path"
        className="inline-block rounded-md bg-teal-500 px-5 py-2 font-semibold text-black no-underline"
      >
        Go to the Learning Path
      </Link>
    </div>
  );
}
