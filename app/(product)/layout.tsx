import { AppShell } from "@/components/app-shell";
import { requireChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";
export default async function ProductLayout({children}:{children:React.ReactNode}){const user=await requireChatGPTUser("/dashboard");return <AppShell user={{name:user.displayName,email:user.email}}>{children}</AppShell>}
