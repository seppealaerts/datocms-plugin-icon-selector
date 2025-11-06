// Get all Lucide icon names
// This imports all icons from lucide-react and extracts their names
import * as LucideIcons from "lucide-react";

export const lucideIconNames = Object.keys(LucideIcons)
  .filter((iconName) => !iconName.includes("Icon"))
  .sort(); // Sort alphabetically for better UX
