import SenderPanel from "@/components/dashboard/sender-panel";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sender Dashboard | SecureTranscrypt",
};

export default function SenderPage() {
  return (
    <div className="space-y-6">
       <Card className="border-l-4 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Sender Dashboard</CardTitle>
          <CardDescription>
            Create your secure package. Upload an image, embed your data, and set encryption keys before sending it to the receiver.
          </CardDescription>
        </CardHeader>
      </Card>
      <SenderPanel />
    </div>
  );
}
