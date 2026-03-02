import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";
import { getOnboarding } from "@/hooks/get-onboarding";

export const dynamic = "force-dynamic";

export default async function OnboardingRedirectPage() {
  const session = await getSession();

  if (!session) redirect("/login");

  const user = await getOnboarding(session.user.id);

  if (user?.onboarded) {
    if (user.role === "seller") redirect("/seller");
    else if (user.role === "admin") redirect("/admin");
    else redirect("/");
  } else {
    redirect("/onboarding");
  }

  return null;
}
