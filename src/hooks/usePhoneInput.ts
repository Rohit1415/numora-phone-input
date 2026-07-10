import { useState, useMemo, useCallback } from "react";
import { Country, PhoneInputOptions } from "../types";
import { countries } from "../utils/countries";

export function usePhoneInput(options: PhoneInputOptions = {}) {
  const {
    defaultCountry = "in",
    onCountryChange,
    onInputChange,
    onToggleDropdown
  } = options;

  const initialCountry = useMemo(() => {
    const defaultIso = defaultCountry.toLowerCase();
    return countries.find(c => c.iso2 === defaultIso) || countries[0];
  }, [defaultCountry]);

  const [selectedCountry, setSelectedCountryState] = useState<Country>(initialCountry);
  const [inputValue, setInputValue] = useState<string>("");
  const [isOpen, setIsOpenState] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeItemIndex, setActiveItemIndex] = useState<number>(-1);

  const getFlagUrl = useCallback((iso2: string) => {
    const template = options.flagUrlTemplate || "https://flagcdn.com/24x18/{iso2}.png";
    return template.replace("{iso2}", iso2.toLowerCase());
  }, [options.flagUrlTemplate]);

  const getDialCode = useCallback(() => {
    return `+${selectedCountry.dialCode}`;
  }, [selectedCountry]);

  const getValue = useCallback(() => {
    if (!inputValue) return "";
    return `+${selectedCountry.dialCode}${inputValue}`;
  }, [selectedCountry, inputValue]);

  const triggerCallbacks = useCallback((newVal: string, newCountry: Country) => {
    if (onInputChange) {
      onInputChange(newVal, newVal ? `+${newCountry.dialCode}${newVal}` : "");
    }
  }, [onInputChange]);

  const selectCountry = useCallback((country: Country) => {
    setSelectedCountryState(country);
    setIsOpenState(false);
    setSearchQuery("");
    setActiveItemIndex(-1);
    
    if (onCountryChange) {
      onCountryChange(country);
    }
    triggerCallbacks(inputValue, country);
  }, [inputValue, onCountryChange, triggerCallbacks]);

  const closeDropdown = useCallback(() => {
    setIsOpenState(false);
    setSearchQuery("");
    setActiveItemIndex(-1);
    if (onToggleDropdown) {
      onToggleDropdown(false);
    }
  }, [onToggleDropdown]);

  const toggleDropdown = useCallback(() => {
    if (options.disabled) return;
    setIsOpenState(prev => {
      const next = !prev;
      if (onToggleDropdown) {
        onToggleDropdown(next);
      }
      if (!next) {
        setSearchQuery("");
        setActiveItemIndex(-1);
      }
      return next;
    });
  }, [options.disabled, onToggleDropdown]);

  const handleInputChange = useCallback((value: string) => {
    const sanitized = value.replace(/[^\d]/g, "");
    setInputValue(sanitized);
    triggerCallbacks(sanitized, selectedCountry);
  }, [selectedCountry, triggerCallbacks]);

  const setValue = useCallback((value: string) => {
    if (!value) {
      setInputValue("");
      triggerCallbacks("", selectedCountry);
      return;
    }

    const hasPlus = value.startsWith("+");
    const cleanDigits = value.replace(/[^\d]/g, "");

    if (hasPlus || value.startsWith("00")) {
      const digits = hasPlus ? cleanDigits : cleanDigits.replace(/^00/, "");
      
      const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
      let matchedCountry: Country | undefined;
      for (const c of sortedCountries) {
        if (digits.startsWith(c.dialCode)) {
          matchedCountry = c;
          break;
        }
      }

      if (matchedCountry) {
        setSelectedCountryState(matchedCountry);
        const remainingDigits = digits.slice(matchedCountry.dialCode.length);
        setInputValue(remainingDigits);
        if (onCountryChange) {
          onCountryChange(matchedCountry);
        }
        triggerCallbacks(remainingDigits, matchedCountry);
      } else {
        setInputValue(digits);
        triggerCallbacks(digits, selectedCountry);
      }
    } else {
      setInputValue(cleanDigits);
      triggerCallbacks(cleanDigits, selectedCountry);
    }
  }, [selectedCountry, onCountryChange, triggerCallbacks]);

  const setCountry = useCallback((iso2: string) => {
    const match = countries.find(c => c.iso2 === iso2.toLowerCase());
    if (match) {
      selectCountry(match);
    }
  }, [selectCountry]);

  const filteredCountries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return countries;
    return countries.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.dialCode.includes(query) ||
      c.iso2.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return {
    selectedCountry,
    inputValue,
    isOpen,
    searchQuery,
    filteredCountries,
    activeItemIndex,
    setActiveItemIndex,
    setSearchQuery,
    setInputValue: handleInputChange,
    selectCountry,
    toggleDropdown,
    closeDropdown,
    setValue,
    setCountry,
    getFlagUrl,
    getDialCode,
    getValue
  };
}
