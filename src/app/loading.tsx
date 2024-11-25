"use client";
import { Loader } from "lucide-react";

const LoadingPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-3 items-center justify-center">
      <Loader className="size-14 mb-5 text-muted-foreground animate-spin" />
      <p className="text-xl text-muted-foreground">Loading...</p>
    </div>
  );
};

export default LoadingPage;
