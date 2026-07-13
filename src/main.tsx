import { connect, OnBootCtx, FieldAppearanceChange } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import FieldExtensionConfigScreen from "./entrypoints/FieldExtensionConfigScreen";
import IconSelectField from "./entrypoints/IconSelectField";
import { render } from "./utils/render";
import { lucideIconNames } from "./utils/lucideIcons";

connect({
  async onBoot(ctx: OnBootCtx) {
    if (ctx.plugin.attributes.parameters?.migratedFromLegacyPlugin) {
      return;
    }

    if (!ctx.currentRole.meta.final_permissions.can_edit_schema) {
      return;
    }

    const fields = await ctx.loadFieldsUsingPlugin();

    for (const field of fields) {
      await ctx.updateFieldAppearance(field.id, [
        {
          operation: "updateEditor",
          newFieldExtensionId: "lucide-icon-select",
        } satisfies FieldAppearanceChange,
      ]);
    }

    await ctx.updatePluginParameters({
      ...ctx.plugin.attributes.parameters,
      migratedFromLegacyPlugin: true,
    });
  },
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  renderFieldExtension(fieldExtensionId, ctx) {
    if (fieldExtensionId === "lucide-icon-select") {
      return render(<IconSelectField ctx={ctx} />);
    }
  },
  manualFieldExtensions(_ctx) {
    return [
      {
        id: "lucide-icon-select",
        name: "Lucide Icon Selector",
        type: "editor" as const,
        fieldTypes: ["string"],
        configurable: { initialHeight: 400 },
        initialHeight: 60,
      },
    ];
  },
  renderManualFieldExtensionConfigScreen(fieldExtensionId, ctx) {
    if (fieldExtensionId === "lucide-icon-select") {
      return render(<FieldExtensionConfigScreen ctx={ctx} />);
    }
  },
  validateManualFieldExtensionParameters(fieldExtensionId, parameters) {
    if (fieldExtensionId !== "lucide-icon-select") {
      return {};
    }

    const allowedIcons = parameters?.allowedIcons;
    if (allowedIcons === undefined || allowedIcons === null) {
      return {};
    }

    if (!Array.isArray(allowedIcons)) {
      return { allowedIcons: "Invalid icon names detected" };
    }

    const hasInvalid = allowedIcons.some(
      (name) => typeof name !== "string" || !lucideIconNames.includes(name)
    );

    if (hasInvalid) {
      return { allowedIcons: "Invalid icon names detected" };
    }

    return {};
  },
});
