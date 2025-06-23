const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-163 bg-gray-100 max-w-1280 m-auto">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
      <p className="mt-2 text-gray-500">
        The page you are looking for does not exist.
      </p>
    </div>
  );
};
export default PageNotFound;
