import { NextResponse, type NextRequest } from "next/server";

export default function proxy(_request: NextRequest) { void _request; return NextResponse.next(); }
export const config = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"] };
