export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
}

export interface PhoneInputOptions {
  defaultCountry?: string;
  defaultValue?: string;
  placeholder?: string;
  flagUrlTemplate?: string;
  disabled?: boolean;
  onCountryChange?: (country: Country) => void;
  onInputChange?: (value: string, parsedValue: string) => void;
  onToggleDropdown?: (isOpen: boolean) => void;
}

export interface PhoneInputProps {
  id?: string;
  className?: string;
  defaultCountry?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  flagUrlTemplate?: string;
  disabled?: boolean;
  onCountryChange?: (country: Country) => void;
  onToggleDropdown?: (isOpen: boolean) => void;
}
