import { redirect } from "next/navigation";
import { chatGPTSignOutPath } from "@/app/chatgpt-auth";

export default function SignoutPage(){redirect(chatGPTSignOutPath("/"))}
