// src/app/not-found.js
export default function NotFound() {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600">The page you are looking for does not exist.</p>
      </div>
    );
  }