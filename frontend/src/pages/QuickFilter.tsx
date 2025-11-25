import React from "react";

interface QuickFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function QuickFilter({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: QuickFilterProps) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border px-4 py-2 rounded w-64 ${className}`}
    />
  );
}
