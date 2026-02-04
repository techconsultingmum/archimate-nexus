import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FileText, Search, AlertCircle } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "search" | "error";
  className?: string;
}

const variantIcons = {
  default: FileText,
  search: Search,
  error: AlertCircle,
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
  className,
}: EmptyStateProps) {
  const IconComponent = variantIcons[variant];

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <IconComponent className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground text-sm max-w-md mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
