"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { handlePhotoAuthentication } from "@/app/actions/photoActions"; // Server action
import { Loader2, CheckCircle, AlertTriangle, UploadCloud, Camera, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { AuthenticatePhotoOutput } from "@/ai/flows/photo-authentication";

interface PhotoUploadProps {
  onPhotoAuthenticated: (authResult: AuthenticatePhotoOutput | null) => void;
  currentPhotoInfo: AuthenticatePhotoOutput | null;
}

export default function PhotoUpload({ onPhotoAuthenticated, currentPhotoInfo }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "File too large", description: "Please select a file smaller than 5MB.", variant: "destructive"});
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      onPhotoAuthenticated(null); // Clear previous authenticated photo
    }
  };

  const handleAuthenticate = async () => {
    if (!file || !preview) {
      toast({ title: "No file selected", description: "Please select a photo to authenticate.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await handlePhotoAuthentication({ photoDataUri: preview, checkManipulation: true });
      if (result.success && result.data) {
        onPhotoAuthenticated(result.data);
        toast({ title: "Photo Authenticated", description: "Watermark applied. Check results below.", className: "bg-green-500 text-white" });
      } else {
        onPhotoAuthenticated(null);
        toast({ title: "Authentication Failed", description: result.error || "Could not authenticate photo.", variant: "destructive" });
      }
    } catch (error) {
      onPhotoAuthenticated(null);
      toast({ title: "Error", description: "An unexpected error occurred during authentication.", variant: "destructive" });
      console.error("Photo authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    onPhotoAuthenticated(null);
    // Also reset the file input visually if possible
    const fileInput = document.getElementById('photo-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center bg-background overflow-hidden group">
          {preview ? (
            <Image src={preview} alt="Preview" layout="fill" objectFit="cover" />
          ) : (
            <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          )}
           <Input
            id="photo-upload-input"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading || !!currentPhotoInfo}
          />
        </div>
        <div className="flex-1">
            <h4 className="font-medium text-sm">Upload Progress Photo</h4>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP. Max 5MB.</p>
             {!currentPhotoInfo && file && (
                <Button onClick={handleAuthenticate} disabled={isLoading || !file} className="mt-2 w-full sm:w-auto" size="sm">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Authenticate Photo
                </Button>
            )}
        </div>
        {(file || currentPhotoInfo) && (
             <Button onClick={handleReset} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" title="Clear selection">
                <RefreshCw className="h-5 w-5" />
            </Button>
        )}
      </div>


      {currentPhotoInfo && (
        <div className="space-y-3 mt-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
             <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-700">Photo Authenticated & Watermarked!</AlertTitle>
            <AlertDescription className="text-green-600">
              <Image src={currentPhotoInfo.watermarkedPhotoDataUri} alt="Watermarked" width={200} height={200} className="mt-2 rounded-md border" data-ai-hint="watermarked photo" />
            </AlertDescription>
          </Alert>
          {currentPhotoInfo.manipulationDetected !== undefined && (
            <Alert variant={currentPhotoInfo.manipulationDetected ? "destructive" : "default"} 
                   className={currentPhotoInfo.manipulationDetected ? "" : "bg-blue-50 border-blue-200"}>
              {currentPhotoInfo.manipulationDetected ? 
                <AlertTriangle className="h-5 w-5" /> :
                <CheckCircle className="h-5 w-5 text-blue-600" />
              }
              <AlertTitle className={currentPhotoInfo.manipulationDetected ? "" : "text-blue-700"}>
                Manipulation Check: {currentPhotoInfo.manipulationDetected ? "Potential Issues Detected" : "Looks Good!"}
              </AlertTitle>
              <AlertDescription className={currentPhotoInfo.manipulationDetected ? "" : "text-blue-600"}>
                {currentPhotoInfo.detectionDetails || (currentPhotoInfo.manipulationDetected ? "AI analysis suggests potential tampering." : "No obvious signs of manipulation detected.")}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
