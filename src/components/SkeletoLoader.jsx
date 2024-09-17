// SkeletonLoader.js
const SkeletonLoader = () => {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border rounded-md">
            <div className="w-16 h-4 bg-gray-300 animate-pulse rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 animate-pulse rounded"></div>
              <div className="h-4 bg-gray-300 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 animate-pulse rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default SkeletonLoader;
  