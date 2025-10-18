import ReceiverPanel from "@/components/dashboard/receiver-panel";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Receiver Dashboard | SecureTranscrypt",
};

export default function ReceiverPage() {
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl">Receiver Dashboard</CardTitle>
          <CardDescription>
            Unlock your secure document. Upload the file from the sender and use the provided key to access the hidden data.
          </CardDescription>
        </CardHeader>
      </Card>
      <ReceiverPanel />
    </div>
  );
}
