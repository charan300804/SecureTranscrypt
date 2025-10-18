"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processFile } from "@/lib/actions";
import { AlertCircle, ArrowRight, CheckCircle, Download, FileText, KeyRound, Loader2, RotateCcw, FileType, FileQuestion, Image as ImageIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialState = { success: false, message: "", fileUrl: "", fileName: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
      ) : (
        <><ArrowRight className="mr-2 h-4 w-4" /> Generate Secure File</>
      )}
    </Button>
  );
}

export default function SenderPanel() {
  const { toast } = useToast();
  const [formState, formAction] = useActionState(processFile, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const isSubmitted = formState.message !== "";

  useEffect(() => {
    if (formState.message && !formState.success) {
      toast({
          variant: "destructive",
          title: "Processing Failed",
          description: formState.message,
      });
    }
  }, [formState, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };

  const resetFlow = () => {
    formRef.current?.reset();
    setImagePreview(null);
    formAction(initialState as any);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-md">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Secure Document Generator</CardTitle>
            <CardDescription>Create a two-layer encrypted document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Step 1: Upload Image */}
            <div className="space-y-2">
              <Label htmlFor="image"><ImageIcon className="inline-block mr-2"/>1. Upload Cover Image</Label>
              <Input id="image" name="image" type="file" required disabled={formState.success} onChange={handleImageChange} accept="image/png, image/jpeg"/>
              {imagePreview && (
                <div className="mt-4 rounded-md border p-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Image Preview:</p>
                    <Image src={imagePreview} alt="Image preview" width={400} height={300} className="rounded-md object-contain w-full" />
                </div>
              )}
            </div>

             {/* Step 2: Image Key */}
            <div className="space-y-2">
              <Label htmlFor="imageKey"><KeyRound className="inline-block mr-2"/>2. Image Encryption Key</Label>
              <Input id="imageKey" name="imageKey" type="password" placeholder="Enter key to encrypt the image" required disabled={formState.success} />
            </div>

            {/* Step 3: Data to Embed */}
            <div className="space-y-2">
              <Label htmlFor="dataToEmbed"><FileText className="inline-block mr-2"/>3. Data to Embed</Label>
              <Textarea id="dataToEmbed" name="dataToEmbed" placeholder="Enter your secret message here..." required disabled={formState.success} />
            </div>
            
            {/* Step 4: Data Key */}
            <div className="space-y-2">
              <Label htmlFor="dataKey"><KeyRound className="inline-block mr-2"/>4. Data Encryption Key</Label>
              <Input id="dataKey" name="dataKey" type="password" placeholder="Enter a separate key for the data" required disabled={formState.success} />
            </div>

            {/* Step 5: Format */}
            <div className="space-y-2">
                <Label htmlFor="format"><FileType className="inline-block mr-2"/>5. Output Format</Label>
                <Select name="format" defaultValue="pdf" required disabled={formState.success}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select document format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="docx">Word Document (.docx)</SelectItem>
                  </SelectContent>
                </Select>
            </div>

          </CardContent>
          <CardFooter className="flex-col gap-2 items-stretch">
            {formState.success ? (
               <Button onClick={resetFlow} variant="outline" className="w-full" type="button">
                <RotateCcw className="mr-2 h-4 w-4"/>
                Create Another File
              </Button>
            ) : (
              <SubmitButton />
            )}
          </CardFooter>
        </form>
      </Card>
      
      <Card className="shadow-md sticky top-24">
        <CardHeader>
          <CardTitle>Generated File</CardTitle>
          <CardDescription>Your secure file will be available for download here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted && formState.success ? (
              <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                      {formState.message}
                      <Button size="sm" asChild className="mt-4 w-full">
                      <a href={formState.fileUrl} download={formState.fileName}>
                          <Download className="mr-2 h-4 w-4" />
                          Download {formState.fileName}
                      </a>
                      </Button>
                  </AlertDescription>
              </Alert>
          ) : isSubmitted && !formState.success ? (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Processing Failed</AlertTitle>
                <AlertDescription>
                    {formState.message || "An unknown error occurred. Please try again."}
                </AlertDescription>
            </Alert>
          ) : (
             <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                <FileQuestion className="mx-auto h-12 w-12" />
                <p className="mt-4">Your generated file will appear here once you submit the form.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
