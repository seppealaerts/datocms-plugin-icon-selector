import type { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, TextField } from "datocms-react-ui";
import { useState, useCallback } from "react";
import * as LucideIcons from "lucide-react";
import { lucideIconNames } from "../utils/lucideIcons";
import s from "./styles.module.css";

type Props = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

const getIconComponent = (iconName: string) => {
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as
    | React.ComponentType<{ size?: number; className?: string }>
    | undefined;
  return IconComponent;
};

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIcons, setSelectedIcons] = useState<string[]>(
    (ctx.parameters.allowedIcons as string[] | undefined) || []
  );

  const filteredIcons = lucideIconNames.filter((name) => {
    if (!searchTerm) return true;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleToggle = useCallback(
    (iconName: string) => {
      const newSelection = selectedIcons.includes(iconName)
        ? selectedIcons.filter((n) => n !== iconName)
        : [...selectedIcons, iconName];
      setSelectedIcons(newSelection);
      ctx.setParameters({ allowedIcons: newSelection });
    },
    [selectedIcons, ctx]
  );

  const handleSelectAllFiltered = useCallback(() => {
    const newSelection = Array.from(
      new Set([...selectedIcons, ...filteredIcons])
    );
    setSelectedIcons(newSelection);
    ctx.setParameters({ allowedIcons: newSelection });
  }, [selectedIcons, filteredIcons, ctx]);

  const handleClearAll = useCallback(() => {
    setSelectedIcons([]);
    ctx.setParameters({ allowedIcons: [] });
  }, [ctx]);

  return (
    <Canvas ctx={ctx}>
      <div className={s.configScreen}>
        <div className={s.configSearch}>
          <TextField
            id="icon-config-search"
            name="icon-config-search"
            label="Search icons"
            value={searchTerm}
            placeholder="Type to filter icons..."
            onChange={setSearchTerm}
          />
        </div>
        <div className={s.configActions}>
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className={s.configButton}
          >
            Select all filtered
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className={s.configButton}
          >
            Clear all
          </button>
        </div>
        <div className={s.configGrid}>
          {filteredIcons.map((iconName) => {
            const Icon = getIconComponent(iconName);
            const isChecked = selectedIcons.includes(iconName);
            return (
              <label
                key={iconName}
                className={`${s.configGridItem} ${
                  isChecked ? s.configGridItemChecked : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(iconName)}
                  className={s.configCheckbox}
                />
                {Icon && <Icon size={20} className={s.configIconPreview} />}
                <span className={s.configIconName}>{iconName}</span>
              </label>
            );
          })}
        </div>
        {filteredIcons.length === 0 && (
          <div className={s.configEmpty}>No icons found</div>
        )}
      </div>
    </Canvas>
  );
}
