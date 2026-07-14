import * as LucideIcons from "lucide-react";

function isReactComponentType(
  value: unknown
): value is React.ComponentType<Record<string, unknown>> {
  return (
    typeof value === "function" ||
    (typeof value === "object" && value !== null && "$$typeof" in value)
  );
}

function isIconComponentName(name: string): boolean {
  return (
    /^[A-Z]/.test(name) &&
    !name.includes("Icon") &&
    !name.includes("Lucide")
  );
}

export const lucideIconNames = Object.keys(LucideIcons)
  .filter(
    (iconName) =>
      isIconComponentName(iconName) &&
      isReactComponentType(LucideIcons[iconName as keyof typeof LucideIcons])
  )
  .sort();
