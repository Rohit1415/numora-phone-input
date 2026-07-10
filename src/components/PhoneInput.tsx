import {
  forwardRef,
  useImperativeHandle,
  useId,
  useRef,
  useEffect,
  KeyboardEvent as ReactKeyboardEvent
} from "react";
import { Country, PhoneInputProps } from "../types";
import { usePhoneInput } from "../hooks/usePhoneInput";

export interface PhoneInputRef {
  getValue: () => string;
  getInputValue: () => string;
  getDialCode: () => string;
  getSelectedCountry: () => Country;
  setValue: (value: string) => void;
  setCountry: (iso2: string) => void;
}

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>((props, ref) => {
  const {
    id: customId,
    className = "",
    defaultCountry = "in",
    value,
    onChange,
    placeholder = "Enter phone number",
    flagUrlTemplate,
    disabled = false,
    onCountryChange,
    onToggleDropdown
  } = props;

  const reactId = useId();
  const uniqueId = customId || `pi-${reactId.replace(/:/g, "")}`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedCountry,
    inputValue,
    isOpen,
    searchQuery,
    filteredCountries,
    activeItemIndex,
    setActiveItemIndex,
    setSearchQuery,
    setInputValue,
    selectCountry,
    toggleDropdown,
    closeDropdown,
    setValue,
    setCountry,
    getFlagUrl,
    getDialCode,
    getValue
  } = usePhoneInput({
    defaultCountry,
    flagUrlTemplate,
    disabled,
    onCountryChange,
    onToggleDropdown,
    onInputChange: (val, combined) => {
      if (onChange) {
        onChange(combined);
      }
    }
  });

  const handleSelectCountry = (country: Country) => {
    selectCountry(country);
    const selectorButton = wrapperRef.current?.querySelector(".pi-selector") as HTMLButtonElement;
    selectorButton?.focus();
  };

  useImperativeHandle(ref, () => ({
    getValue,
    getInputValue: () => inputValue,
    getDialCode,
    getSelectedCountry: () => selectedCountry,
    setValue,
    setCountry
  }));

  useEffect(() => {
    if (value !== undefined && value !== getValue()) {
      setValue(value);
    }
  }, [value, setValue, getValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    const listContainer = e.currentTarget.querySelector(".pi-country-list");
    if (!listContainer) return;

    const itemButtons = Array.from(
      listContainer.querySelectorAll(".pi-country-item")
    ) as HTMLButtonElement[];

    if (itemButtons.length === 0) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        let nextIndex = 0;
        if (document.activeElement !== searchInputRef.current) {
          nextIndex = (activeItemIndex + 1) % itemButtons.length;
        }
        setActiveItemIndex(nextIndex);
        itemButtons[nextIndex]?.focus();
        break;
      }

      case "ArrowUp": {
        e.preventDefault();
        let prevIndex = itemButtons.length - 1;
        if (document.activeElement !== searchInputRef.current) {
          prevIndex = (activeItemIndex - 1 + itemButtons.length) % itemButtons.length;
        }
        setActiveItemIndex(prevIndex);
        itemButtons[prevIndex]?.focus();
        break;
      }

      case "Escape": {
        e.preventDefault();
        closeDropdown();
        const selectorButton = wrapperRef.current?.querySelector(
          ".pi-selector"
        ) as HTMLButtonElement;
        selectorButton?.focus();
        break;
      }

      case "Tab":
        setTimeout(() => {
          if (wrapperRef.current && !wrapperRef.current.contains(document.activeElement)) {
            closeDropdown();
          }
        }, 0);
        break;
    }
  };

  return (
    <div ref={wrapperRef} className={`pi-wrapper ${className}`} id={uniqueId}>
      <button
        type="button"
        className="pi-selector"
        id={`${uniqueId}-selector`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${uniqueId}-list`}
        aria-label="Select country code"
        disabled={disabled}
        onClick={toggleDropdown}
      >
        <img
          src={getFlagUrl(selectedCountry.iso2)}
          className="pi-flag"
          id={`${uniqueId}-selected-flag`}
          alt={`${selectedCountry.name} flag`}
        />
        <span className="pi-dial-code" id={`${uniqueId}-selected-dial-code`}>
          {getDialCode()}
        </span>
        <svg
          className={`pi-chevron ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <input
        type="tel"
        className="pi-input"
        id={`${uniqueId}-input`}
        placeholder={placeholder}
        aria-label="Phone number"
        value={inputValue}
        disabled={disabled}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <div
        className={`pi-dropdown ${isOpen ? "open" : ""}`}
        id={`${uniqueId}-dropdown`}
        onKeyDown={handleKeyDown}
      >
        <div className="pi-search-container">
          <div className="pi-search-box">
            <svg className="pi-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="pi-search-input"
              id={`${uniqueId}-search-input`}
              placeholder="Search country or code"
              maxLength={10}
              aria-autocomplete="list"
              aria-controls={`${uniqueId}-list`}
              aria-label="Search countries"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveItemIndex(-1);
              }}
            />
          </div>
        </div>

        <div
          className="pi-country-list"
          id={`${uniqueId}-list`}
          role="listbox"
          aria-label="Country list options"
        >
          {filteredCountries.length === 0 ? (
            <div className="pi-no-results">No countries found</div>
          ) : (
            filteredCountries.map((country) => {
              const isSelected = country.iso2 === selectedCountry.iso2;
              return (
                <button
                  key={country.iso2}
                  type="button"
                  className={`pi-country-item ${isSelected ? "selected" : ""}`}
                  id={`${uniqueId}-item-${country.iso2}`}
                  role="option"
                  aria-selected={isSelected}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectCountry(country);
                  }}
                >
                  <img
                    src={getFlagUrl(country.iso2)}
                    className="pi-flag"
                    alt={`${country.name} flag`}
                  />
                  <span className="pi-country-name">{country.name}</span>
                  <span className="pi-country-item-code">+{country.dialCode}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";
