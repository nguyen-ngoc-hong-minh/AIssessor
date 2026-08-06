"use client";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
export function SignOut(){const clerk=useClerk();useEffect(()=>{clerk.signOut({redirectUrl:"/"})},[clerk]);return <p>Signing out…</p>}
