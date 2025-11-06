import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, ContextInspector } from "datocms-react-ui";
import s from "./styles.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <div className={s.content}>
        <h2>🎨 Icon Selector Plugin</h2>
        <p>
          This plugin provides a searchable icon selector field for your DatoCMS
          models using{" "}
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Lucide Icons
          </a>
          . Select from hundreds of icons with visual previews and search
          functionality.
        </p>

        <h3>✨ Features</h3>
        <ul>
          <li>Visual icon previews in the selector</li>
          <li>Real-time search to find icons quickly</li>
          <li>Hundreds of icons from the Lucide library</li>
          <li>Simple string storage for easy integration</li>
        </ul>

        <h3>📖 How to Use</h3>
        <ol>
          <li>
            Create a <strong>String</strong> field in your DatoCMS model
          </li>
          <li>
            Set the field API key to <code>icon</code>
          </li>
          <li>
            The field will automatically use the icon selector dropdown when
            editing content
          </li>
        </ol>

        <h3>💻 Using Icons in Your Application</h3>
        <p>
          The plugin stores icon names as strings. Use them with the Lucide
          React library:
        </p>
        <pre>
          <code>{`import * as LucideIcons from 'lucide-react';

const iconName = record.icon; // e.g., "Heart"
const IconComponent = LucideIcons[iconName];
return IconComponent ? <IconComponent size={24} /> : null;`}</code>
        </pre>

        <h3>📚 Resources</h3>
        <ul>
          <li>
            <a
              href="https://lucide.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lucide Icons Documentation
            </a>
          </li>
          <li>
            <a
              href="https://www.datocms.com/docs"
              target="_blank"
              rel="noopener noreferrer"
            >
              DatoCMS Documentation
            </a>
          </li>
        </ul>
      </div>
      <div className={s.inspector}>
        <ContextInspector />
      </div>
    </Canvas>
  );
}
