const Lock = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold mt-10">
        This page is locked. Please login to access.
      </h1>
      <div className="flex justify-center mt-5">
        <img
          src="/ShopIphoneByReactJs/img/lock.png"
          alt="Lock Icon"
          className="w-32 h-32"
        />
      </div>
    </div>
  );
};

export default Lock;
