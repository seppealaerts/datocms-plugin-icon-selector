import { connect } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import IconSelectField from "./entrypoints/IconSelectField";
import { render } from "./utils/render";

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  overrideFieldExtensions(field, _ctx) {
    // Only apply to string fields with the API key "icon" or fields that have a hint
    if (
      field.attributes.field_type === "string" &&
      (field.attributes.api_key === "icon" ||
        field.attributes.hint?.includes("lucide-icon"))
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
});
