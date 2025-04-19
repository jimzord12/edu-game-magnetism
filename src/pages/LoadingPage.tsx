type Props = {
  msg: string;
};

const LoadingPage = ({ msg }: Props) => {
  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen">
      <h2 className="text-4xl">Loading... </h2>
      <h3 className="text-2xl">{msg}</h3>
    </div>
  );
};

export default LoadingPage;
