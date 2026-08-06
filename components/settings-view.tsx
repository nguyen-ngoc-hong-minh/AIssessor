"use client";
import { UserProfile } from "@clerk/nextjs";
import { IntegrationNotice } from "./integration-notice";
import { integrationsConfigured } from "./providers";
export function SettingsView(){return integrationsConfigured?<UserProfile routing="hash"/>:<IntegrationNotice/>}
