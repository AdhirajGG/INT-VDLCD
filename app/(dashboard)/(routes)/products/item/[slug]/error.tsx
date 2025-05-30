"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Error Loading Product</h1>
      <p className="text-red-500">{error.message}</p>
    </div>
  );
}