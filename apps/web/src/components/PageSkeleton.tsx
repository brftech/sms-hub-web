

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="hidden md:flex items-center space-x-6">
              <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
            <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero section skeleton */}
          <div className="text-center mb-16">
            <div className="w-32 h-8 bg-gray-700 rounded animate-pulse mx-auto mb-6"></div>
            <div className="w-96 h-12 bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
            <div className="w-80 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>

          {/* Content blocks skeleton */}
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
