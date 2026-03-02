import prisma from "@/lib/prisma";

export async function getOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboarded: true, name: true, role: true },
  });

  return user;
}
