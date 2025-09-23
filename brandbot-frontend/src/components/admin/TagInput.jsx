import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const TagInput = ({
    tags = [],
    onTagsChange,
    placeholder = "Add tags...",
    maxTags = 10,
    className = ""
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    const addTag = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !tags.includes(trimmedValue) && tags.length < maxTags) {
            onTagsChange([...tags, trimmedValue]);
            setInputValue("");
        }
    };

    const removeTag = (index) => {
        const newTags = tags.filter((_, i) => i !== index);
        onTagsChange(newTags);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (inputValue.trim()) {
            addTag();
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className={`min-h-[42px] p-2 border rounded-lg cursor-text transition-colors ${isFocused
                        ? "border-violet-500 ring-2 ring-violet-200"
                        : "border-gray-300 hover:border-violet-400"
                    }`}
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Tags */}
                    <AnimatePresence>
                        {tags.map((tag, index) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="inline-flex items-center px-3 py-1 bg-violet-100 text-violet-800 text-sm rounded-full"
                            >
                                {tag}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTag(index);
                                    }}
                                    className="ml-2 hover:bg-violet-200 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={tags.length === 0 ? placeholder : ""}
                        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
                        disabled={tags.length >= maxTags}
                    />

                    {/* Add button */}
                    {inputValue.trim() && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                addTag();
                            }}
                            className="p-1 hover:bg-violet-200 rounded-full transition-colors"
                        >
                            <Plus className="w-4 h-4 text-violet-600" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Helper text */}
            <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                    Press Enter or comma to add tags
                </span>
                <span className="text-xs text-gray-500">
                    {tags.length}/{maxTags}
                </span>
            </div>
        </div>
    );
};

export default TagInput;
