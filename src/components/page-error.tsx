import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  message?: string;
}

const PageError = ({ message = "Semthing went wrong" }: PageErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 text-muted-foreground mb-6" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default PageError;