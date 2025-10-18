"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processFile } from "@/lib/actions";
import { AlertCircle, ArrowRight, CheckCircle, Download, FileText, KeyRound, Loader2, RotateCcw, FileType, FileQuestion } from "lucide-react";
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

  const resetFlow = () => {
    formRef.current?.reset();
    formAction(initialState as any);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card className="shadow-md">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Secure Document Generator</CardTitle>
            <CardDescription>Embed your secret data into an encrypted PDF or Word document.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataToEmbed"><FileText className="inline-block mr-2"/>Data to Embed</Label>
                <Textarea id="dataToEmbed" name="dataToEmbed" placeholder="Enter your secret message here..." required disabled={formState.success} />
              </div>
            </div>
            <div className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="format"><FileType className="inline-block mr-2"/>Document Format</Label>
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
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="encryptionKey"><KeyRound className="inline-block mr-2"/>Encryption Key</Label>
                <Input id="encryptionKey" name="encryptionKey" type="password" placeholder="Enter a secret key for encryption" required disabled={formState.success} />
                 <p className="text-sm text-muted-foreground">This key will be required by the receiver to decrypt the data.</p>
              </div>
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
