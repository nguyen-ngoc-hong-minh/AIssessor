export type CanonicalIdentity = {
  canonicalId: string;
  name: string;
  provider: string;
  aliases: string[];
  mappingConfidence: "exact" | "explicit_alias";
};

const REGISTRY = [
  {
    canonicalId: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    aliases: [
      "openai/gpt-4o",
      "gpt-4o",
      "gpt-4o-2024-11-20",
      "gpt-4o-2024-08-06",
      "gpt-4o-2024-05-13",
      "GPT-4o (2024-05-13)",
    ],
  },
] as const;

function identityKey(value: string) {
  return value.trim().toLowerCase();
}

export function resolveCanonicalIdentity(source: string, sourceModelId: string, sourceName?: string): CanonicalIdentity | null {
  if (source === "openrouter" && sourceModelId.includes("/")) {
    const providerId = sourceModelId.split("/")[0];
    const registered = REGISTRY.find((item) => item.canonicalId === identityKey(sourceModelId));
    return {
      canonicalId: identityKey(sourceModelId),
      name: registered?.name ?? sourceName ?? sourceModelId,
      provider: registered?.provider ?? providerId,
      aliases: registered ? [...registered.aliases] : [sourceModelId],
      mappingConfidence: "exact",
    };
  }

  const candidates = [sourceModelId, sourceName].filter((value): value is string => Boolean(value)).map(identityKey);
  const registered = REGISTRY.find((item) => item.aliases.some((alias) => candidates.includes(identityKey(alias))));
  if (!registered) return null;
  return { ...registered, aliases: [...registered.aliases], mappingConfidence: candidates.includes(identityKey(registered.canonicalId)) ? "exact" : "explicit_alias" };
}

export function registeredModels() {
  return REGISTRY.map((item) => ({ ...item, aliases: [...item.aliases] }));
}
