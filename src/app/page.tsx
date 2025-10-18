import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ClientFooter from "@/components/client-footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">SecureTranscrypt</h1>
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login/sender">Sender Login</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login/receiver">Receiver Login</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-32">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary">
            Your Data, Secured and Transmitted with Confidence.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            SecureTranscrypt offers a robust platform for two-layer encryption, ensuring your files and data are protected during transmission.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login/sender">
                Get Started as Sender <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block bg-primary text-primary-foreground p-3 rounded-lg">
                  <h3 className="text-2xl font-bold">How It Works</h3>
                </div>
                <p className="text-muted-foreground text-lg">
                  A simple yet powerful process to secure your data.
                </p>
                <div className="space-y-6 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center font-bold">1</div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg">Sender Encrypts</h4>
                      <p className="text-muted-foreground">Upload an image, embed your data, and protect both with separate encryption keys.</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center font-bold">2</div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg">Secure Transmission</h4>
                      <p className="text-muted-foreground">Download the secured file and send it to your receiver through any channel you trust.</p>
                    </div>
                  </div>
                   <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full size-8 flex items-center justify-center font-bold">3</div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg">Receiver Decrypts</h4>
                      <p className="text-muted-foreground">The receiver uses the two keys to unlock the image and decrypt the hidden data.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex-row items-center gap-4">
                     <Send className="w-8 h-8 text-primary" />
                     <div>
                      <CardTitle>For Senders</CardTitle>
                      <CardDescription>Encrypt and embed your data securely.</CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent>
                    <p>Package your sensitive information within a document, protected by an encryption key. Only your intended recipient with the correct key can access it.</p>
                    <Button variant="secondary" className="mt-4" asChild>
                       <Link href="/login/sender">Login as Sender <ArrowRight /></Link>
                    </Button>
                  </CardContent>
                </Card>
                 <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex-row items-center gap-4">
                     <ShieldCheck className="w-8 h-8 text-primary" />
                     <div>
                      <CardTitle>For Receivers</CardTitle>
                      <CardDescription>Access data with verified keys.</CardDescription>
                     </div>
                  </CardHeader>
                  <CardContent>
                    <p>Receive files and use the provided key to decrypt and view the original embedded data. Our system validates keys to prevent unauthorized access.</p>
                     <Button variant="secondary" className="mt-4" asChild>
                       <Link href="/login/receiver">Login as Receiver <ArrowRight /></Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ClientFooter />
    </div>
  );
}
