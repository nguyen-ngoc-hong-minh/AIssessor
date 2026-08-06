/* Generated-compatible fallback. Run `npx convex dev` for schema-specific types. */
import type { AnyDataModel } from "convex/server";
export type DataModel = AnyDataModel;
export type Doc<TableName extends string> = Record<string, unknown> & { _id: string; _creationTime: number; _table?: TableName };
export type Id<TableName extends string> = string & { __tableName?: TableName };
