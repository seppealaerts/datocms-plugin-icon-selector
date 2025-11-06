import type { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, ContextInspector } from "datocms-react-ui";
import s from "./styles.module.css";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  return (
    <Canvas ctx={ctx}>
      <div>
        <h2>Lucide Icon Select Plugin</h2>
        <p>
          This plugin provides a custom select field with all Lucide icon names.
        </p>
        <h3>How to use:</h3>
        <ol>
          <li>Create a string field in your DatoCMS model</li>
          <li>
            Set the field API key to <code>icon</code> OR add{" "}
            <code>lucide-icon</code> to the field hint
          </li>
          <li>
            The field will automatically use the Lucide icon select dropdown
          </li>
        </ol>
        <p>
          The selected icon name will be stored as a string value that you can
          use in your application with the Lucide React library.
        </p>
      </div>
      <div className={s.inspector}>
        <ContextInspector />
      </div>
    </Canvas>
  );
}
