import type { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, TextField } from "datocms-react-ui";
import { ChevronDown, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { lucideIconNames } from "../utils/lucideIcons";
import s from "./styles.module.css";

type Props = {
  ctx: RenderFieldExtensionCtx;
};

// Helper function to get the icon component by name
const getIconComponent = (iconName: string) => {
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as
    | React.ComponentType<{ size?: number; className?: string }>
    | undefined;
  return IconComponent;
};

// Helper function to get nested form value by path (e.g., "icon.icon")
const getNestedFormValue = (
  formValues: Record<string, unknown>,
  path: string
): string => {
  const parts = path.split(".");
  let value: unknown = formValues;
  for (const part of parts) {
    if (value && typeof value === "object" && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return "";
    }
  }
  return (value as string) || "";
};

export default function IconSelectField({ ctx }: Props) {
  // Get the current form value (handling nested paths like "icon.icon")
  const formValue = getNestedFormValue(ctx.formValues, ctx.fieldPath);

  const [selectedValue, setSelectedValue] = useState<string>(formValue);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSettingValueRef = useRef(false);
  const lastFormValueRef = useRef<string>(formValue);

  const ICONS_PER_PAGE = 100;

  // Sync with form values - always update when formValue changes (unless we're setting it)
  useEffect(() => {
    // Skip if we're the ones setting the value
    if (isSettingValueRef.current) {
      isSettingValueRef.current = false;
      lastFormValueRef.current = formValue;
      return;
    }

    // Update if the form value changed
    if (formValue !== lastFormValueRef.current) {
      setSelectedValue(formValue);
      lastFormValueRef.current = formValue;
    }
  }, [formValue]);

  // Filter icons based on search term
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

  const handleSelect = async (iconName: string) => {
    setSelectedValue(iconName);
    setIsOpen(false);
    setSearchTerm("");
    setCurrentPage(1);
    isSettingValueRef.current = true;
    lastFormValueRef.current = iconName;
    await ctx.setFieldValue(ctx.fieldPath, iconName);
  };

  const handleClear = async () => {
    setSelectedValue("");
    setIsOpen(false);
    setSearchTerm("");
    setCurrentPage(1);
    isSettingValueRef.current = true;
    lastFormValueRef.current = "";
    await ctx.setFieldValue(ctx.fieldPath, "");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
        setCurrentPage(1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Update iframe height when dropdown opens/closes
  useEffect(() => {
    if (isOpen) {
      ctx.stopAutoResizer();
      // Use setTimeout to measure after dropdown is rendered
      const timer = setTimeout(() => {
        if (inputContainerRef.current && dropdownRef.current) {
          const inputHeight =
            inputContainerRef.current.getBoundingClientRect().height;
          const dropdownHeight = Math.min(
            490,
            dropdownRef.current.scrollHeight
          );
          ctx.setHeight(inputHeight + dropdownHeight + 10);
        }
      }, 0);
      return () => clearTimeout(timer);
    } else {
      // When closed, just show the input field
      if (inputContainerRef.current) {
        const height = inputContainerRef.current.getBoundingClientRect().height;
        ctx.setHeight(Math.max(height + 10, 50));
      }
      ctx.startAutoResizer();
    }
  }, [isOpen, ctx, filteredIcons.length]);

  // Get the selected icon component once
  const SelectedIcon = selectedValue ? getIconComponent(selectedValue) : null;

  return (
    <Canvas ctx={ctx}>
      <div ref={containerRef} className={s.container}>
        <div ref={inputContainerRef} className={s.inputContainer}>
          {SelectedIcon && (
            <div className={s.selectedIconWrapper}>
              <SelectedIcon size={18} />
            </div>
          )}
          <TextField
            id={ctx.field.id}
            name={ctx.field.attributes.api_key}
            label=""
            value={selectedValue}
            placeholder="Select an icon..."
            onChange={() => {}}
            textInputProps={{
              disabled: ctx.disabled,
              readOnly: true,
              onClick: () => !ctx.disabled && setIsOpen(!isOpen),
              className: `${SelectedIcon ? s.textInputWithIcon : s.textInput} ${
                ctx.disabled ? s.textInputDisabled : s.textInputEnabled
              }`,
            }}
          />
          <div className={s.actionsContainer}>
            {selectedValue && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={ctx.disabled}
                className={`${s.clearButton} ${
                  ctx.disabled ? s.clearButtonDisabled : ""
                }`}
              >
                <X size={16} />
              </button>
            )}
            <div className={s.actionsContainerInteractive}>
              <button
                type="button"
                onClick={() => !ctx.disabled && setIsOpen(!isOpen)}
                disabled={ctx.disabled}
                className={`${s.chevronButton} ${
                  isOpen ? s.chevronButtonOpen : ""
                } ${ctx.disabled ? s.chevronButtonDisabled : ""}`}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div ref={dropdownRef} className={s.dropdown}>
            <div className={s.dropdownSearch}>
              <TextField
                id="icon-search"
                name="icon-search"
                label=""
                value={searchTerm}
                placeholder="Search icons..."
                onChange={setSearchTerm}
                textInputProps={{
                  autoFocus: true,
                }}
              />
            </div>
            <div className={s.listContainer}>
              {allFilteredIcons.length === 0 ? (
                <div className={s.listEmpty}>No icons found</div>
              ) : (
                filteredIcons.map((iconName) => {
                  const Icon = getIconComponent(iconName);
                  return (
                    <div
                      key={iconName}
                      onClick={() => handleSelect(iconName)}
                      className={`${s.listItem} ${
                        selectedValue === iconName ? s.listItemActive : ""
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                      {iconName}
                    </div>
                  );
                })
              )}
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
          </div>
        )}
      </div>
    </Canvas>
  );
}
