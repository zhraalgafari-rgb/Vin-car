import { useToast } from "@/components/ui/toast";
import { ToastAction } from "@/components/ui/toast";

export function useToastNotification() {
  const { toast } = useToast();

  const showSuccess = (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    });
  };

  const showError = (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const showWarning = (message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    });
  };

  const showInfo = (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    });
  };

  return { showSuccess, showError, showWarning, showInfo };
}
