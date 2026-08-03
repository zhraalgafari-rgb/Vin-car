import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  vinId?: string;
}

export function UploadZone({ onUpload, vinId }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "text/csv": [".csv"],
    },
  });

  return (
    <Card {...getRootProps()} className="border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
      <CardContent className="flex flex-col items-center justify-center p-8">
        <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-center text-muted-foreground">
          {isDragActive ? "Drop files here..." : "Drag & drop files here, or click to browse"}
        </p>
        <input {...getInputProps()} />
      </CardContent>
    </Card>
  );
}
