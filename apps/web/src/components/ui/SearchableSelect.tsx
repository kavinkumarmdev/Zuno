import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Check, X, Plus } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  subtext?: string;
  code?: string;
}

export interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Array<string | SelectOption>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  allowCustom?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  required?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  disabled = false,
  error = false,
  allowCustom = true,
  className = '',
  id,
  name,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options into standardized SelectOption objects
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { label: opt, value: opt };
      }
      return {
        label: opt.label || opt.value,
        value: opt.value,
        subtext: opt.subtext,
        code: opt.code
      };
    });
  }, [options]);

  // Find current selected option or display raw value
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value) || (value ? { label: value, value } : null);
  }, [normalizedOptions, value]);

  // Filter options based on user search term (Select2 behavior)
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const term = searchTerm.toLowerCase().trim();
    return normalizedOptions.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(term);
      const valMatch = opt.value.toLowerCase().includes(term);
      const subMatch = opt.subtext && opt.subtext.toLowerCase().includes(term);
      const codeMatch = opt.code && opt.code.toLowerCase().includes(term);
      return labelMatch || valMatch || subMatch || codeMatch;
    });
  }, [normalizedOptions, searchTerm]);

  // Check if search term exactly matches an existing option
  const exactMatchExists = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return normalizedOptions.some(
      (opt) => opt.label.toLowerCase() === term || opt.value.toLowerCase() === term
    );
  }, [normalizedOptions, searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Handle option selection
  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle clearing value
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0].value);
      } else if (allowCustom && searchTerm.trim()) {
        handleSelect(searchTerm.trim());
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full text-left select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 text-xs border rounded-xl flex items-center justify-between gap-2 transition-all duration-150 cursor-pointer text-left bg-white dark:bg-slate-800 ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900' : 'hover:border-slate-400 dark:hover:border-slate-600'
        } ${
          error
            ? 'border-rose-400 bg-rose-50/20 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-400/20'
            : isOpen
            ? 'border-blue-600 ring-2 ring-blue-500/20 dark:border-blue-500'
            : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
        }`}
      >
        <span className="truncate flex-1">
          {selectedOption ? (
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {selectedOption.label}
              {selectedOption.subtext && (
                <span className="ml-1.5 text-[10px] text-slate-400 font-mono">({selectedOption.subtext})</span>
              )}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && !required && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Select2-Style Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100 min-w-[200px]">
          {/* Search Box Header */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search or type option..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
              <span>
                {filteredOptions.length} {filteredOptions.length === 1 ? 'option' : 'options'} found
              </span>
              {allowCustom && searchTerm.trim() && !exactMatchExists && (
                <span className="text-blue-600 dark:text-blue-400 font-medium">Press Enter to add custom</span>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1 divide-y divide-slate-50 dark:divide-slate-800/40">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={`${opt.value}-${opt.label}`}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full px-2.5 py-2 text-xs rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">
                          {opt.subtext}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 px-3 text-center text-xs text-slate-400">
                No matching options found.
              </div>
            )}

            {/* Allow Custom Value (Select2 Tags / Creatable Select) */}
            {allowCustom && searchTerm.trim() && !exactMatchExists && (
              <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleSelect(searchTerm.trim())}
                  className="w-full px-2.5 py-2 text-xs rounded-lg flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Use &quot;{searchTerm.trim()}&quot; as custom value</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

