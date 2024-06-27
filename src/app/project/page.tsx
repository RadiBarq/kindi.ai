import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/project");
  }

  console.log(`User id is ${session.user.id}`);
  return (
    <div className="flex h-screen items-center justify-center gap-10">
      Dashboard page
      <Link href="/api/auth/signout">Logout</Link>
    </div>
  );
}
