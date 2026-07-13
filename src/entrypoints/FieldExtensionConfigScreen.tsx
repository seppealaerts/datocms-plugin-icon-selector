import type { RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, TextField } from "datocms-react-ui";
import { useState, useCallback, useEffect } from "react";
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

const ICONS_PER_PAGE = 100;

// Exact config screen dimensions derived from CSS
const CONFIG_TITLE_HEIGHT = 21; // heading text + margin-bottom
const CONFIG_SEARCH_HEIGHT = 68.5; // TextField (label + input)
const CONFIG_GAP = 12;
const CONFIG_ACTIONS_HEIGHT = 33.5; // action buttons
const CONFIG_GRID_MAX_HEIGHT = 155; // reduced from 176 to accommodate title
const CONFIG_GRID_PADDING = 8; // 4px top + 4px bottom
const CONFIG_PAGINATION_HEIGHT = 43.5;

const CONFIG_HEIGHT = Math.ceil(
  CONFIG_TITLE_HEIGHT +
    CONFIG_SEARCH_HEIGHT +
    CONFIG_GAP +
    CONFIG_ACTIONS_HEIGHT +
    CONFIG_GAP +
    (CONFIG_GRID_MAX_HEIGHT + CONFIG_GRID_PADDING) +
    CONFIG_PAGINATION_HEIGHT
);

export default function FieldExtensionConfigScreen({ ctx }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIcons, setSelectedIcons] = useState<string[]>(
    (ctx.parameters.allowedIcons as string[] | undefined) || []
  );

  const allFilteredIcons = lucideIconNames.filter((name) => {
    if (!searchTerm) return true;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate pagination
  const totalPages = Math.ceil(allFilteredIcons.length / ICONS_PER_PAGE);
  const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const filteredIcons = allFilteredIcons.slice(startIndex, endIndex);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  useEffect(() => {
    ctx.setHeight(CONFIG_HEIGHT);
  }, [ctx]);

  const handleSelectAllFiltered = useCallback(() => {
    const newSelection = Array.from(
      new Set([...selectedIcons, ...allFilteredIcons])
    );
    setSelectedIcons(newSelection);
    ctx.setParameters({ allowedIcons: newSelection });
  }, [selectedIcons, allFilteredIcons, ctx]);

  const handleClearAll = useCallback(() => {
    setSelectedIcons([]);
    ctx.setParameters({ allowedIcons: [] });
  }, [ctx]);

  return (
    <Canvas ctx={ctx} noAutoResizer>
      <div className={s.configScreen}>
        <div className={s.configSearch}>
          <h2 className={s.configTitle}>
            Pick which icons are available. Leave empty to allow all icons.
          </h2>
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
        {allFilteredIcons.length === 0 ? (
          <div className={s.configEmpty}>No icons found</div>
        ) : (
          <>
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
            {totalPages > 1 && (
              <div className={s.pagination}>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className={s.paginationButton}
                >
                  Previous
                </button>
                <span className={s.paginationInfo}>
                  Page {currentPage} of {totalPages} ({allFilteredIcons.length}{" "}
                  icons)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={s.paginationButton}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Canvas>
  );
}
