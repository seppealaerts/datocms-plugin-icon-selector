import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import FieldExtensionConfigScreen from "./entrypoints/FieldExtensionConfigScreen";
import IconSelectField from "./entrypoints/IconSelectField";
import { render } from "./utils/render";
import { lucideIconNames } from "./utils/lucideIcons";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  overrideFieldExtensions(field, _ctx) {
    // Only apply to string fields with the API key "icon"
    if (
      field.attributes.field_type === "string" &&
      field.attributes.api_key === "icon"
    ) {
      return {
        editor: {
          id: "lucide-icon-select",
          initialHeight: 60,
        },
      };
    }
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
        configurable: true,
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
