# DatoCMS Icon Selector Plugin

A custom field extension for DatoCMS that provides a searchable icon selector using [Lucide Icons](https://lucide.dev/).

## Features

- 🎨 **Visual Icon Selection**: Browse and select from hundreds of Lucide icons with visual previews
- 🔍 **Search Functionality**: Quickly find icons by typing their name
- 💾 **Simple Storage**: Icons are stored as string values (icon names) that you can use with the Lucide React library
- 🎯 **Easy Integration**: Automatically activates for fields with the API key `icon` or hint `lucide-icon`
- ✨ **Modern UI**: Clean, intuitive interface that matches DatoCMS design system

## Installation

1. Install the plugin in your DatoCMS project:

   - Go to your DatoCMS project settings
   - Navigate to Plugins
   - Click "Add plugin" and select this plugin

2. Or install via npm (for development):
   ```bash
   npm install
   ```

## Usage

### Setting up a field

1. Create a **String** field in your DatoCMS model
2. Set the field API key to `icon`
3. The field will automatically use the Lucide icon selector dropdown

### Example

```typescript
// In your DatoCMS model
{
  "api_key": "icon",
  "field_type": "string"
}
```

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
  │   ├── ConfigScreen.tsx      # Plugin configuration screen
  │   ├── IconSelectField.tsx    # Main icon selector field component
  │   └── styles.module.css      # Component styles
  ├── utils/
  │   ├── lucideIcons.ts         # Lucide icon names utility
  │   └── render.tsx             # React rendering utility
  └── main.tsx                   # Plugin entry point
```

## How It Works

The plugin works by:

1. **Field Detection**: Automatically detects string fields with API key `icon`
2. **Custom Editor**: Replaces the default text input with a custom icon selector
3. **Icon Loading**: Dynamically loads and displays all available Lucide icons
4. **Search & Filter**: Provides real-time search to filter through hundreds of icons
5. **Value Storage**: Stores the selected icon name as a string value in DatoCMS

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.
