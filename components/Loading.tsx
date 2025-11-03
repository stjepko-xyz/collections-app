import { Spinner } from "./ui/spinner";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Spinner className="size-10 text-primary" />
    </div>
  );
};

export default LoadingSpinner;
