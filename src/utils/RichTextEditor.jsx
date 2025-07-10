import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Undo,
  Redo,
  Type,
  Palette,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  Code,
  Minus,
} from "lucide-react";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing your content here...",
  height = "min-h-64",
  className = "",
  showPreview = false,
  disabled = false,
  toolbar = {
    format: true,
    fontSize: true,
    textStyle: true,
    alignment: true,
    lists: true,
    colors: true,
    media: true,
    history: true,
    special: true,
  },
  onImageUpload,
  maxLength,
  error,
  label,
  required = false,
  id,
  name,
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const editorRef = useRef(null);

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || `<p>${placeholder}</p>`;
    }
  }, [value, placeholder]);

  const executeCommand = useCallback(
    (command, commandValue = null) => {
      if (disabled) return;
      document.execCommand(command, false, commandValue);
      editorRef.current?.focus();
    },
    [disabled]
  );

  const handleTextChange = useCallback(() => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;

      // Check max length if specified
      if (maxLength && editorRef.current.textContent.length > maxLength) {
        return;
      }

      onChange(content);
    }
  }, [onChange, maxLength]);

  const insertLink = useCallback(() => {
    if (linkUrl && linkText) {
      const link = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      executeCommand("insertHTML", link);
      setIsLinkModalOpen(false);
      setLinkUrl("");
      setLinkText("");
      handleTextChange();
    }
  }, [linkUrl, linkText, executeCommand, handleTextChange]);

  const insertImage = useCallback(() => {
    if (onImageUpload) {
      // Use custom image upload handler
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          onImageUpload(file, (url) => {
            executeCommand("insertImage", url);
            handleTextChange();
          });
        }
      };
      input.click();
    } else {
      // Fallback to URL input
      const url = prompt("Enter image URL:");
      if (url) {
        executeCommand("insertImage", url);
        handleTextChange();
      }
    }
  }, [executeCommand, onImageUpload, handleTextChange]);

  const formatBlock = useCallback(
    (tag) => {
      executeCommand("formatBlock", tag);
      handleTextChange();
    },
    [executeCommand, handleTextChange]
  );

  const changeFontSize = useCallback(
    (size) => {
      executeCommand("fontSize", size);
      handleTextChange();
    },
    [executeCommand, handleTextChange]
  );

  const changeTextColor = useCallback(
    (color) => {
      executeCommand("foreColor", color);
      handleTextChange();
    },
    [executeCommand, handleTextChange]
  );

  const changeBackgroundColor = useCallback(
    (color) => {
      executeCommand("backColor", color);
      handleTextChange();
    },
    [executeCommand, handleTextChange]
  );

  const handleCommand = useCallback(
    (command, commandValue) => {
      executeCommand(command, commandValue);
      handleTextChange();
    },
    [executeCommand, handleTextChange]
  );

  const toolbarButtons = [
    { icon: Undo, command: "undo", tooltip: "Undo", section: "history" },
    { icon: Redo, command: "redo", tooltip: "Redo", section: "history" },
    { icon: Bold, command: "bold", tooltip: "Bold", section: "textStyle" },
    {
      icon: Italic,
      command: "italic",
      tooltip: "Italic",
      section: "textStyle",
    },
    {
      icon: Underline,
      command: "underline",
      tooltip: "Underline",
      section: "textStyle",
    },
    {
      icon: Strikethrough,
      command: "strikethrough",
      tooltip: "Strikethrough",
      section: "textStyle",
    },
    {
      icon: Subscript,
      command: "subscript",
      tooltip: "Subscript",
      section: "textStyle",
    },
    {
      icon: Superscript,
      command: "superscript",
      tooltip: "Superscript",
      section: "textStyle",
    },
    {
      icon: AlignLeft,
      command: "justifyLeft",
      tooltip: "Align Left",
      section: "alignment",
    },
    {
      icon: AlignCenter,
      command: "justifyCenter",
      tooltip: "Align Center",
      section: "alignment",
    },
    {
      icon: AlignRight,
      command: "justifyRight",
      tooltip: "Align Right",
      section: "alignment",
    },
    {
      icon: AlignJustify,
      command: "justifyFull",
      tooltip: "Justify",
      section: "alignment",
    },
    {
      icon: List,
      command: "insertUnorderedList",
      tooltip: "Bullet List",
      section: "lists",
    },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      tooltip: "Numbered List",
      section: "lists",
    },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      tooltip: "Quote",
      section: "special",
    },
    {
      icon: Code,
      command: "formatBlock",
      value: "pre",
      tooltip: "Code Block",
      section: "special",
    },
    {
      icon: Minus,
      command: "insertHorizontalRule",
      tooltip: "Horizontal Rule",
      section: "special",
    },
  ];

  const filteredButtons = toolbarButtons.filter(
    (button) => toolbar[button.section]
  );

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Toolbar */}
      <div
        className={`border border-gray-300 rounded-t-lg bg-gray-50 p-3 ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {/* Format Dropdown */}
          {toolbar.format && (
            <select
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              onChange={(e) => formatBlock(e.target.value)}
              defaultValue=""
              disabled={disabled}
            >
              <option value="" disabled>
                Format
              </option>
              <option value="p">Paragraph</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
            </select>
          )}

          {/* Font Size */}
          {toolbar.fontSize && (
            <select
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
              onChange={(e) => changeFontSize(e.target.value)}
              defaultValue=""
              disabled={disabled}
            >
              <option value="" disabled>
                Size
              </option>
              <option value="1">8pt</option>
              <option value="2">10pt</option>
              <option value="3">12pt</option>
              <option value="4">14pt</option>
              <option value="5">18pt</option>
              <option value="6">24pt</option>
              <option value="7">36pt</option>
            </select>
          )}

          {/* Divider */}
          {(toolbar.format || toolbar.fontSize) &&
            filteredButtons.length > 0 && (
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
            )}

          {/* Formatting Buttons */}
          {filteredButtons.map((button, index) => (
            <button
              key={index}
              onClick={() => handleCommand(button.command, button.value)}
              className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              title={button.tooltip}
              type="button"
              disabled={disabled}
            >
              <button.icon size={16} />
            </button>
          ))}

          {/* Colors */}
          {toolbar.colors && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <div className="flex items-center gap-1">
                <Type size={16} className="text-gray-700" />
                <input
                  type="color"
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => changeTextColor(e.target.value)}
                  title="Text Color"
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center gap-1">
                <Palette size={16} className="text-gray-700" />
                <input
                  type="color"
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) => changeBackgroundColor(e.target.value)}
                  title="Background Color"
                  disabled={disabled}
                />
              </div>
            </>
          )}

          {/* Media */}
          {toolbar.media && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-1"></div>
              <button
                onClick={() => setIsLinkModalOpen(true)}
                className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Insert Link"
                type="button"
                disabled={disabled}
              >
                <Link size={16} />
              </button>
              <button
                onClick={insertImage}
                className="p-2 text-gray-700 hover:bg-gray-200 rounded transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Insert Image"
                type="button"
                disabled={disabled}
              >
                <Image size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleTextChange}
        onBlur={handleTextChange}
        id={id}
        data-name={name}
        className={`${height} p-4 border-l border-r border-b border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        style={{
          lineHeight: "1.6",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
        suppressContentEditableWarning={true}
      />

      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
          <span>
            {editorRef.current?.textContent?.length || 0} / {maxLength}{" "}
            characters
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={insertLink}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Preview */}
      {showPreview && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">HTML Output:</h3>
          <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-auto max-h-32">
            {value || `<p>${placeholder}</p>`}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
