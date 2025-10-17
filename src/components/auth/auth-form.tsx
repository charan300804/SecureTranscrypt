"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { signIn, signUp } from "@/lib/actions";
import { UserRole } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AuthFormProps = {
  type: "login" | "register";
  role: UserRole;
};

function SubmitButton({ type }: { type: "login" | "register" }) {
  const { pending } = useFormStatus();
  const text = type === "login" ? "Sign In" : "Create Account";
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Processing..." : text}
    </Button>
  );
}

export default function AuthForm({ type, role }: AuthFormProps) {
  const action = type === "login" ? signIn.bind(null, role) : signUp.bind(null, role);
  const [state, dispatch] = useActionState(action, { message: "" });

  const title = `${role.charAt(0).toUpperCase() + role.slice(1)} ${type === "login" ? "Sign In" : "Registration"}`;
  const description = type === "login" ? `Welcome back, ${role}. Please sign in to your account.` : `Create a new ${role} account to get started.`;
  const footerText = type === "login" ? "Don't have an account?" : "Already have an account?";
  const footerLink = type === "login" ? `/register/${role}` : `/login/${role}`;
  const footerLinkText = type === "login" ? "Register" : "Sign In";

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <Link href="/" className="font-bold text-2xl text-primary mb-2">SecureTranscrypt</Link>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form action={dispatch}>
        <CardContent className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          {state.message && (
             <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <SubmitButton type={type} />
          <div className="text-sm text-muted-foreground">
            {footerText}{" "}
            <Link href={footerLink} className="font-medium text-primary hover:underline">
              {footerLinkText}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
