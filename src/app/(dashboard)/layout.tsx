import Header from "@/components/dashboard/header";
import { cookies } from "next/headers";
import { type SessionPayload } from "@/lib/definitions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = cookies().get("secure-transcrypt-session");
  const session: SessionPayload | null = sessionCookie ? JSON.parse(sessionCookie.value) : null;
  
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <Header user={session} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
