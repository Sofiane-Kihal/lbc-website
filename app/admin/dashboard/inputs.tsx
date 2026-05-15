'use client';

import { useEffect, useState } from 'react';
import { slugify } from '@/lib/utils';

export function SlugInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(value);
  useEffect(() => {
    setRaw(value);
  }, [value]);
  return (
    <input
      className="input-base"
      placeholder={placeholder}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(e.target.value);
      }}
      onBlur={() => {
        const s = slugify(raw);
        if (s !== raw) {
          setRaw(s);
          onChange(s);
        }
      }}
    />
  );
}

export function ListInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(() => value.join(', '));
  return (
    <input
      className="input-base"
      placeholder={placeholder}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(
          e.target.value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }}
    />
  );
}

export function MultilineListInput({
  value,
  onChange,
  rows = 4,
  className = '',
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  rows?: number;
  className?: string;
  placeholder?: string;
}) {
  const [raw, setRaw] = useState(() => value.join('\n'));
  return (
    <textarea
      className={`input-base resize-y ${className}`}
      rows={rows}
      placeholder={placeholder}
      value={raw}
      onChange={(e) => {
        setRaw(e.target.value);
        onChange(
          e.target.value
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        );
      }}
    />
  );
}
