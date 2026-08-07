import { ShieldCheck } from "lucide-react";

export function SettingsView({ name, email }: { name: string; email: string }) {
  return <div className="card form-card"><ShieldCheck style={{color:"#2563eb"}}/><h2 style={{margin:"18px 0 6px",fontSize:18}}>ChatGPT identity</h2><p style={{color:"#68748a",fontSize:12,lineHeight:1.6}}>BENCHFLOW uses the verified identity supplied by ChatGPT. It does not store a password.</p><div className="account-facts"><div><span>Name</span><strong>{name}</strong></div><div><span>Email</span><strong>{email}</strong></div></div><a className="button button-secondary" href="/signout-with-chatgpt?return_to=%2F">Sign out</a></div>
}
