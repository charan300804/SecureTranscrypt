"use client";

import { useFormState } from "react-dom";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { unlockImage, decryptData } from "@/lib/actions";
import { CheckCircle, Eye, FileLock, KeyRound, Loader2, Lock, Unlock, UploadCloud } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Step = 'upload' | 'unlock-image' | 'decrypt-data' | 'done';
const secureImage = PlaceHolderImages.find(img => img.id === 'sender-image-placeholder');

export default function ReceiverPanel() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [imageUnlockState, imageUnlockAction] = useFormState(unlockImage, { success: false, message: "" });
  const [dataDecryptState, dataDecryptAction] = useFormState(decryptData, { success: false, message: "", data: "" });

  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isImageUnlocked, setIsImageUnlocked] = useState(false);
  const [isDataDecrypted, setIsDataDecrypted] = useState(false);

  useEffect(() => {
    if (isUnlocking) {
      if (imageUnlockState.success) {
        setIsImageUnlocked(true);
        setCurrentStep('decrypt-data');
        toast({
          title: "Success",
          description: "Image successfully unlocked!",
          variant: "default",
          className: "bg-green-100 border-green-300"
        });
      } else if (imageUnlockState.message) {
        toast({
          variant: "destructive",
          title: "Image Unlock Failed",
          description: imageUnlockState.message,
        });
      }
      setIsUnlocking(false);
    }
  }, [imageUnlockState, toast, isUnlocking]);

  useEffect(() => {
    if (isDecrypting) {
        if (dataDecryptState.success) {
            setIsDataDecrypted(true);
            setCurrentStep('done');
        } else if (dataDecryptState.message) {
            toast({
                variant: "destructive",
                title: "Data Decryption Failed",
                description: dataDecryptState.message,
            });
        }
        setIsDecrypting(false);
    }
  }, [dataDecryptState, toast, isDecrypting]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep('unlock-image');
      toast({
        title: "File Uploaded",
        description: `"${file.name}" is ready for decryption.`,
      });
    }
  };

  const handleImageUnlock = (formData: FormData) => {
    setIsUnlocking(true);
    imageUnlockAction(formData);
  };

  const handleDataDecrypt = (formData: FormData) => {
    setIsDecrypting(true);
    dataDecryptAction(formData);
  };

  const resetFlow = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setIsImageUnlocked(false);
    setIsDataDecrypted(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left Panel: Steps */}
      <div className="space-y-6">
        {/* Step 1: Upload */}
        <Card className={`shadow-md transition-opacity duration-500 ${currentStep !== 'upload' ? 'opacity-50' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UploadCloud className="text-primary"/> 1. Upload Secured File</CardTitle>
            <CardDescription>Select the file you received from the sender.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input id="file-upload" type="file" onChange={handleFileChange} disabled={currentStep !== 'upload'} />
            {uploadedFile && <p className="mt-4 text-sm font-medium text-muted-foreground">File ready: {uploadedFile.name}</p>}
          </CardContent>
        </Card>

        {/* Step 2: Unlock Image */}
        <Card className={`shadow-md transition-opacity duration-500 ${currentStep === 'upload' ? 'opacity-50' : ''}`}>
          <form action={handleImageUnlock}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isImageUnlocked ? <Unlock className="text-green-500"/> : <Lock className="text-primary"/>}
                    2. Unlock Image {isImageUnlocked ? "(Completed)" : ""}
                </CardTitle>
              <CardDescription>Enter the first key to reveal the image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageKey">Image Decryption Key</Label>
                <Input id="imageKey" name="imageKey" type="password" placeholder="Enter image key" required disabled={currentStep === 'upload' || isUnlocking || isImageUnlocked} />
              </div>
            </CardContent>
             {!isImageUnlocked && (
              <CardFooter>
                  <Button type="submit" className="w-full" disabled={currentStep === 'upload' || isUnlocking}>
                    {isUnlocking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Unlocking...</> : 
                    <><KeyRound className="mr-2 h-4 w-4" /> Unlock Image</>}
                  </Button>
              </CardFooter>
            )}
          </form>
        </Card>

        {/* Step 3: Decrypt Data */}
        <Card className={`shadow-md transition-opacity duration-500 ${currentStep !== 'decrypt-data' || isDataDecrypted ? 'opacity-50' : ''}`}>
          <form action={handleDataDecrypt}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 {isDataDecrypted ? <CheckCircle className="text-green-500"/> : <FileLock className="text-primary"/>}
                 3. Decrypt Embedded Data {isDataDecrypted ? "(Completed)" : ""}
              </CardTitle>
              <CardDescription>Enter the second key to reveal the secret message.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="dataKey">Data Decryption Key</Label>
                <Input id="dataKey" name="dataKey" type="password" placeholder="Enter data key" required disabled={currentStep !== 'decrypt-data' || isDataDecrypted || isDecrypting} />
              </div>
            </CardContent>
            {!isDataDecrypted && (
              <CardFooter>
                <Button type="submit" className="w-full" disabled={currentStep !== 'decrypt-data' || isDecrypting}>
                  {isDecrypting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Decrypting...</> :
                   <><Eye className="mr-2 h-4 w-4" /> Decrypt Data</>
                   }
                </Button>
              </CardFooter>
            )}
          </form>
        </Card>

      </div>

      {/* Right Panel: Results */}
      <Card className="shadow-md sticky top-24">
        <CardHeader>
          <CardTitle>Decryption Results</CardTitle>
          <CardDescription>The contents of the secure package will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Decrypted Image</h3>
            <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
              {isImageUnlocked ? (
                <Image src={secureImage?.imageUrl || ""} alt="Decrypted Image" width={1200} height={800} className="object-cover w-full h-full" data-ai-hint="landscape" />
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <Lock className="mx-auto h-12 w-12" />
                  <p>Image is locked. Enter the correct image key to view.</p>
                </div>
              )}
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Embedded Data</h3>
            <div className="w-full min-h-[100px] rounded-lg border bg-muted p-4 flex items-center justify-center">
              {isDataDecrypted && dataDecryptState?.data ? (
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 text-foreground">
                  {dataDecryptState.data}
                </blockquote>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <FileLock className="mx-auto h-12 w-12" />
                  <p>Data is encrypted. Enter the correct data key to view.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {currentStep === 'done' && (
            <CardFooter>
                <div className="w-full space-y-4">
                     <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Process Complete</AlertTitle>
                        <AlertDescription>
                            You have successfully decrypted the image and the embedded data.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={resetFlow} variant="outline" className="w-full">Start Over</Button>
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
