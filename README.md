# DatoCMS Icon Selector Plugin

A custom field extension for DatoCMS that provides a searchable icon selector using [Lucide Icons](https://lucide.dev/).

## Features

- 🎨 **Visual Icon Selection**: Browse and select from hundreds of Lucide icons with visual previews
- 🔍 **Search Functionality**: Quickly find icons by typing their name
- 💾 **Simple Storage**: Icons are stored as string values (icon names) that you can use with the Lucide React library
- 🎯 **Manual Assignment**: Can be assigned to any string field in the DatoCMS schema editor
- ✨ **Modern UI**: Clean, intuitive interface that adapts to DatoCMS light and dark mode
- 🎛️ **Per-field Icon Filtering**: Restrict which icons are available per field via the field configuration screen

## Installation

### From the DatoCMS Marketplace

1. Go to your DatoCMS project settings
2. Navigate to **Plugins**
3. Click **Add plugin** and select **Lucide Icon Selector** from the Marketplace

### For development

```bash
npm install
```

## Setting up a field

Assign the **Lucide Icon Selector** editor to any string field via the DatoCMS schema editor:

1. Create a **String** field in your DatoCMS model
2. In the field's **Presentation** settings, look for the **Editor** dropdown
3. Select **Lucide Icon Selector** from the list of available editors
4. Optionally click the gear icon ⚙ to configure which icons are pickable

### Per-field Icon Filtering

When you manually assign the Lucide Icon Selector to a string field, you can configure exactly which icons are available for selection:

1. In the field's **Presentation** settings, select **Lucide Icon Selector** as the editor
2. Click the gear icon ⚙ next to the editor name
3. The configuration screen opens showing all available Lucide icons
4. **Search** for specific icons by name
5. **Toggle** individual icons to whitelist them
6. Use **Select all filtered** to bulk-select visible icons, or **Clear all** to reset the selection
7. Save your changes

When icons are whitelisted, content editors can only pick from the configured set. If no icons are whitelisted, all Lucide icons are available.

To reset the whitelist back to "all icons", clear the configuration settings for that field.

### Using the selected icon in your application

The plugin stores the icon name as a string. Use it with the Lucide React library:

```tsx
import { Heart, Star, User } from "lucide-react";

// Get the icon name from DatoCMS
const iconName = record.icon; // e.g., "Heart"

// Use it in your component
const IconComponent = { Heart, Star, User }[iconName];
return <IconComponent size={24} />;
```

Or dynamically:

```tsx
import * as LucideIcons from "lucide-react";

const iconName = record.icon;
const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];
return IconComponent ? <IconComponent size={24} /> : null;
```

## How It Works

The plugin works by:

1. **Custom Editor**: Replaces the default text input with a custom icon selector when manually assigned to a string field
2. **Icon Loading**: Dynamically loads and displays all available Lucide icons
3. **Search & Filter**: Provides real-time search to filter through hundreds of icons
4. **Per-field Configuration**: The field-level configuration screen lets you whitelist specific icons per field
5. **Theme Adaptation**: The plugin automatically adapts to DatoCMS light and dark mode via the built-in `Canvas` component and native CSS custom properties
6. **Value Storage**: Stores the selected icon name as a string value in DatoCMS

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
src/
  ├── entrypoints/
  │   ├── ConfigScreen.tsx                # Plugin configuration screen
  │   ├── FieldExtensionConfigScreen.tsx   # Per-field icon filtering config screen
  │   ├── IconSelectField.tsx             # Main icon selector field component
  │   └── styles.module.css               # Component styles
  ├── utils/
  │   ├── lucideIcons.ts                  # Lucide icon names utility
  │   └── render.tsx                      # React rendering utility
  └── main.tsx                            # Plugin entry point
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.
