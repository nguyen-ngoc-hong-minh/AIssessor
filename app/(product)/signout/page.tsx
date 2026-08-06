import { SignOut } from "@/components/signout";
import { IntegrationNotice } from "@/components/integration-notice";
export default function SignoutPage(){return <div className="page-wrap">{process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?<SignOut/>:<IntegrationNotice/>}</div>}
