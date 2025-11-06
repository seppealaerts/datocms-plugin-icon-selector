import type { RenderFieldExtensionCtx } from "datocms-plugin-sdk";
import { Canvas, TextField } from "datocms-react-ui";
import { ChevronDown, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { lucideIconNames } from "../utils/lucideIcons";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isSettingValueRef = useRef(false);
  const lastFormValueRef = useRef<string>(formValue);

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
  const filteredIcons = lucideIconNames
    .filter((name) => {
      if (!searchTerm) return true;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice(0, 100); // Limit to first 100 for performance

  const handleSelect = async (iconName: string) => {
    setSelectedValue(iconName);
    setIsOpen(false);
    setSearchTerm("");
    isSettingValueRef.current = true;
    lastFormValueRef.current = iconName;
    await ctx.setFieldValue(ctx.fieldPath, iconName);
  };

  const handleClear = async () => {
    setSelectedValue("");
    setIsOpen(false);
    setSearchTerm("");
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
            300,
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
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "40px",
          overflow: "visible",
          zIndex: 1,
        }}
      >
        <div
          ref={inputContainerRef}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {SelectedIcon && (
            <div
              style={{
                position: "absolute",
                left: "12px",
                zIndex: 1,
                display: "flex",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              <SelectedIcon size={18} />
            </div>
          )}
          <TextField
            id={ctx.field.id}
            name={ctx.field.attributes.api_key}
            label=""
            value={selectedValue}
            placeholder="Select an icon..."
            onChange={() => {}} // Required prop, but field is readOnly so this is a no-op
            textInputProps={{
              disabled: ctx.disabled,
              readOnly: true,
              onClick: () => !ctx.disabled && setIsOpen(!isOpen),
              style: {
                cursor: ctx.disabled ? "not-allowed" : "pointer",
                paddingLeft: SelectedIcon ? "40px" : undefined,
                paddingRight: "40px",
              },
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            {selectedValue && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                disabled={ctx.disabled}
                style={{
                  background: "none",
                  border: "none",
                  cursor: ctx.disabled ? "not-allowed" : "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  pointerEvents: "auto",
                  opacity: ctx.disabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!ctx.disabled) {
                    e.currentTarget.style.opacity = "0.7";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!ctx.disabled) {
                    e.currentTarget.style.opacity = "1";
                  }
                }}
              >
                <X size={16} />
              </button>
            )}
            <div style={{ pointerEvents: "auto" }}>
              <button
                type="button"
                onClick={() => !ctx.disabled && setIsOpen(!isOpen)}
                disabled={ctx.disabled}
                style={{
                  background: "none",
                  border: "none",
                  cursor: ctx.disabled ? "not-allowed" : "pointer",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  opacity: ctx.disabled ? 0.5 : 1,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "-1px",
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderTop: "none",
              borderRadius: "0 0 4px 4px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              zIndex: 1000,
              maxHeight: "300px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              fontFamily: "inherit",
            }}
          >
            <div style={{ padding: "8px", borderBottom: "1px solid #e5e7eb" }}>
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
            <div
              style={{
                overflowY: "auto",
                maxHeight: "250px",
              }}
            >
              {filteredIcons.length === 0 ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    fontFamily: "inherit",
                    color: "#6b7280",
                  }}
                >
                  No icons found
                </div>
              ) : (
                filteredIcons.map((iconName) => {
                  const Icon = getIconComponent(iconName);
                  return (
                    <div
                      key={iconName}
                      onClick={() => handleSelect(iconName)}
                      style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f3f4f6",
                        backgroundColor:
                          selectedValue === iconName ? "#f3f4f6" : "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontFamily: "inherit",
                        fontSize: "14px",
                        transition: "background-color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedValue !== iconName) {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedValue !== iconName) {
                          e.currentTarget.style.backgroundColor = "white";
                        }
                      }}
                    >
                      {Icon && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "24px",
                            height: "24px",
                            flexShrink: 0,
                            color: "#374151",
                          }}
                        >
                          <Icon size={18} />
                        </div>
                      )}
                      <span
                        style={{
                          fontFamily: "inherit",
                          color: "#111827",
                          fontSize: "14px",
                        }}
                      >
                        {iconName}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </Canvas>
  );
}
