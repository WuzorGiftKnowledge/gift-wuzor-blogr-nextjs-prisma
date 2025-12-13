import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface DropdownItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
  isActive?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, items, isActive = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center ${
          isActive
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {label}
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

