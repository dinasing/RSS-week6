import { useEffect, useId, useMemo, useRef, useState } from 'react';

interface CountryAutocompleteProps {
  id?: string;
  value: string;
  countries: readonly string[];
  error?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function CountryAutocomplete({
  id,
  value,
  countries,
  error,
  onChange,
  onBlur,
}: CountryAutocompleteProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const errorId = `${inputId}-error`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredCountries = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return countries.slice(0, 10);
    }

    return countries
      .filter((country) => country.toLowerCase().includes(query))
      .slice(0, 10);
  }, [countries, value]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  const selectCountry = (country: string) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="country-autocomplete">
      <input
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        autoComplete="off"
        className="form-input"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
      />
      {isOpen && filteredCountries.length > 0 && (
        <ul id={listboxId} role="listbox" className="country-autocomplete-list">
          {filteredCountries.map((country) => (
            <li key={country}>
              <button
                type="button"
                role="option"
                className="country-autocomplete-option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCountry(country)}
              >
                {country}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
