"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { processFile } from "@/lib/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, ArrowRight, CheckCircle, Download, FileText, KeyRound, Loader2, UploadCloud, RotateCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const senderImage = PlaceHolderImages.find(img => img.id === 'sender-image-placeholder');

export default function SenderPanel() {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(senderImage?.imageUrl ?? null);
  const [formState, formAction] = useFormState(processFile, { success: false, message: "", fileUrl: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if(isSubmitted) {
      if (formState.success) {
        toast({
            title: "Success!",
            description: formState.message,
            className: "bg-green-100 border-green-300"
        });
      } else if (formState.message) {
        toast({
            variant: "destructive",
            title: "Processing Failed",
            description: formState.message,
        });
      }
      setIsProcessing(false);
    }
  }, [formState, isSubmitted]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setUploadedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid image file.",
        });
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uploadedFile && !senderImage) {
        toast({
            variant: "destructive",
            title: "No Image Provided",
            description: "Please upload an image before processing.",
        });
        return;
    }
    setIsProcessing(true);
    setIsSubmitted(true);
    const formData = new FormData(e.currentTarget);
    if (uploadedFile) {
      formData.set('image', uploadedFile);
    } else if (senderImage) {
       formData.set('imageUrl', senderImage.imageUrl);
    }
    
    formAction(formData);
  }

  const resetFlow = () => {
    setIsSubmitted(false);
    setIsProcessing(false);
    setUploadedFile(null);
    setPreviewUrl(senderImage?.imageUrl ?? null);
    // Reset form fields if inside a <form> element
    const form = document.querySelector('form');
    form?.reset();
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Image Preview</CardTitle>
          <CardDescription>This is the image you are securing.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-dashed flex items-center justify-center bg-muted/50">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Uploaded preview"
                width={1200}
                height={800}
                className="object-cover w-full h-full"
                data-ai-hint="landscape"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <UploadCloud className="mx-auto h-12 w-12" />
                <p>Upload an image to see a preview</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
            <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="file:text-primary file:font-semibold"/>
        </CardFooter>
      </Card>

      <Card className="shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Encryption & Embedding</CardTitle>
            <CardDescription>Secure your image and embed your secret data.</CardDescription>
          </CardHeader>
          <CardContent>
             <Accordion type="multiple" defaultValue={['image-encryption', 'data-embedding']} className="w-full">
              <AccordionItem value="image-encryption">
                <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <KeyRound className="size-5 text-primary"/>
                        Image Encryption Key
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <p className="text-sm text-muted-foreground mb-4">This key is required to view the image itself. Keep it safe.</p>
                  <div className="space-y-2">
                    <Label htmlFor="imageKey">Image Key</Label>
                    <Input id="imageKey" name="imageKey" type="password" placeholder="e.g., image-key-123" required />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="data-embedding">
                <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                        <FileText className="size-5 text-primary"/>
                        Data Embedding
                    </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                  <p className="text-sm text-muted-foreground">The data below will be hidden inside the image and encrypted with its own key.</p>
                  <div className="space-y-2">
                    <Label htmlFor="dataToEmbed">Data to Embed</Label>
                    <Textarea id="dataToEmbed" name="dataToEmbed" placeholder="Enter your secret message here..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataKey">Data Encryption Key</Label>
                    <Input id="dataKey" name="dataKey" type="password" placeholder="e.g., data-key-123" required />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {isSubmitted && !isProcessing && (
                <div className="mt-6">
                    {formState.success ? (
                        <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle>Success!</AlertTitle>
                            <AlertDescription>
                                {formState.message} Your secure file is ready for download.
                                <Button size="sm" asChild className="mt-4 w-full md:w-auto">
                                <a href={formState.fileUrl} download="secured-file.png">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Secured File
                                </a>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Processing Failed</AlertTitle>
                            <AlertDescription>
                                {formState.message || "An unknown error occurred. Please try again."}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 items-stretch">
            <Button type="submit" className="w-full" disabled={isProcessing || formState.success}>
              {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : formState.success ? (
                <><CheckCircle className="mr-2 h-4 w-4" /> Done</>
              ) : (
                <><ArrowRight className="mr-2 h-4 w-4" /> Process & Generate File</>
              )}
            </Button>
            {formState.success && (
              <Button onClick={resetFlow} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4"/>
                Start Over
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
