// Server-side safe theme registry, only contains IDs
export const themeIds = ["swiftui", "compose", "meme"] as const;

export function isValidThemeId(id: string): boolean {
  return themeIds.includes(id as any);
}

