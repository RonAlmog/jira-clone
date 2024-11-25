"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="h-screen flex flex-col gap-y-3 items-center justify-center">
      <AlertTriangle className="size-20 mb-5" />
      <p className="text-2xl text-muted-foreground">Oops!</p>
      <p className="text-lg text-muted-foreground">
        Something went terribly wrong.
      </p>
      <Button variant="secondary" className="mt-5">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default ErrorPage;
