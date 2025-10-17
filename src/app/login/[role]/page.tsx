import AuthForm from "@/components/auth/auth-form";
import { UserRole } from "@/lib/definitions";
import { notFound } from "next/navigation";

type LoginPageProps = {
  params: {
    role: UserRole;
  };
};

export default function LoginPage({ params }: LoginPageProps) {
  const { role } = params;

  if (role !== "sender" && role !== "receiver") {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <AuthForm type="login" role={role} />
    </div>
  );
}
