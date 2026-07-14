import * as LucideIcons from "lucide-react";

function isReactComponentType(
  value: unknown
): value is React.ComponentType<Record<string, unknown>> {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null && "$$typeof" in value)
  );
}

export const lucideIconNames = Object.keys(LucideIcons)
  .filter((iconName) =>
    isReactComponentType(LucideIcons[iconName as keyof typeof LucideIcons])
  )
  .sort();
