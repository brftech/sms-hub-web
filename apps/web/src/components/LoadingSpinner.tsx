

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
