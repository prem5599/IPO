import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 animate-spin text-blue-500" size={64} />
        <p className="text-gray-600">Loading IPO data...</p>
      </div>
    </div>
  );
}