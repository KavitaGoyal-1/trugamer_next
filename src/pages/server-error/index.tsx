const ServerError = () => {
  return (
    <div className="h-screen w-full grid place-content-center">
      <h1 className="text-2xl font-semibold">Sorry, something went wrong</h1>
      <p>
        Please, contact with our{" "}
        <span className="underline cursor-pointer">support team</span> to fix
        this issue asap.
      </p>
    </div>
  );
};

export default ServerError;
