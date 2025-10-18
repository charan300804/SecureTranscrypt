"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decryptData } from "@/lib/actions";
import { CheckCircle, Eye, FileLock, KeyRound, Loader2, UploadCloud, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialDataDecryptState = { success: false, message: "", data: "" };

type Step = 'upload' | 'decrypt-data' | 'done';

export default function ReceiverPanel() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dataDecryptState, dataDecryptAction, isDataDecrypting] = useActionState(decryptData, initialDataDecryptState);

  const isDataDecrypted = dataDecryptState.success;

  useEffect(() => {
    if (dataDecryptState.message && !isDataDecrypting) {
      if (dataDecryptState.success) {
        setCurrentStep('done');
      } else {
        toast({
          variant: "destructive",
          title: "Data Decryption Failed",
          description: dataDecryptState.message,
        });
      }
    }
  }, [dataDecryptState, toast, isDataDecrypting]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setUploadedFile(file);
        setCurrentStep('decrypt-data');
        toast({
          title: "File Uploaded",
          description: `"${file.name}" is ready for decryption.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid PDF or Word (.docx) file.",
        });
        e.target.value = "";
      }
    }
  };

  const handleDataDecrypt = (formData: FormData) => {
    if (uploadedFile) {
        formData.append('file', uploadedFile);
    }
    dataDecryptAction(formData);
  }

  const resetFlow = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    formRef.current?.reset();
    // This is a way to reset the action state without another piece of state
    (dataDecryptAction as (payload: any) => void)(initialDataDecryptState);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-md">
        <form ref={formRef} action={handleDataDecrypt}>
          <CardHeader>
            <CardTitle>Document Decryption</CardTitle>
            <CardDescription>Unlock your secure document to view the hidden data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`transition-opacity duration-500 ${currentStep !== 'upload' ? 'opacity-50' : ''}`}>
              <Label htmlFor="file-upload"><UploadCloud className="inline-block mr-2"/>1. Upload Secured File</Label>
              <Input id="file-upload" type="file" onChange={handleFileChange} disabled={currentStep !== 'upload'} accept=".pdf,.docx"/>
              <p className="text-sm text-muted-foreground mt-2">Select the PDF or Word file you received.</p>
              {uploadedFile && currentStep !== 'upload' && <p className="mt-4 text-sm font-medium text-green-600">File ready: {uploadedFile.name}</p>}
            </div>

            <div className={`transition-opacity duration-500 ${currentStep === 'upload' ? 'opacity-50' : ''}`}>
              <Label htmlFor="dataKey"><KeyRound className="inline-block mr-2"/>2. Decryption Key</Label>
              <Input id="dataKey" name="dataKey" type="password" placeholder="Enter data key" required disabled={currentStep !== 'decrypt-data' || isDataDecrypted || isDataDecrypting} />
              <p className="text-sm text-muted-foreground mt-2">Enter the key to reveal the secret message.</p>
            </div>
          </CardContent>
          {!isDataDecrypted && (
            <CardFooter>
              <Button type="submit" className="w-full" disabled={currentStep !== 'decrypt-data' || isDataDecrypting}>
                {isDataDecrypting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Decrypting...</> :
                 <><Eye className="mr-2 h-4 w-4" /> Decrypt Data</>
                 }
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
      
      <Card className="shadow-md sticky top-24">
        <CardHeader>
          <CardTitle>Decryption Results</CardTitle>
          <CardDescription>The secret data from the document will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Embedded Data</h3>
            <div className="w-full min-h-[150px] rounded-lg border-2 border-dashed bg-muted p-4 flex items-center justify-center">
              {isDataDecrypted && dataDecryptState.data ? (
                <blockquote className="text-lg italic border-l-4 border-primary pl-4 text-foreground">
                  {dataDecryptState.data}
                </blockquote>
              ) : (
                <div className="text-center text-muted-foreground p-4">
                  <FileLock className="mx-auto h-12 w-12" />
                  <p className="mt-2">Data is encrypted. Upload a file and enter the correct key to view.</p>
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
                            You have successfully decrypted the data.
                        </AlertDescription>
                    </Alert>
                    <Button onClick={resetFlow} variant="outline" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Start Over
                    </Button>
                </div>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
