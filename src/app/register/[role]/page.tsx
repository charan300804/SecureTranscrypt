import AuthForm from "@/components/auth/auth-form";
import { UserRole } from "@/lib/definitions";
import { notFound } from "next/navigation";

type RegisterPageProps = {
  params: {
    role: UserRole;
  };
};

export default function RegisterPage({ params }: RegisterPageProps) {
  const { role } = params;

  if (role !== "sender" && role !== "receiver") {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      <AuthForm type="register" role={role} />
    </div>
  );
}
