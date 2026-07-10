# API Reference Documentation

This document describes the public API interfaces exposed by the Numora library.

---

## `<PhoneInput />` Component

The primary component exported by the library.

### Props (`PhoneInputProps`)

| Prop Name          | Type                         | Default                   | Description                                                         |
| :----------------- | :--------------------------- | :------------------------ | :------------------------------------------------------------------ |
| `id`               | `string`                     | _(generated)_             | Unique HTML ID. Defaults to a hydration-safe `useId()` token.       |
| `className`        | `string`                     | `""`                      | Custom CSS class applied to the wrapper element.                    |
| `defaultCountry`   | `string`                     | `"in"`                    | ISO2 country code initially selected (e.g. `"us"`, `"gb"`).         |
| `value`            | `string`                     | `""`                      | Controlled input value. Accepts E.164 phone formats.                |
| `onChange`         | `(value: string) => void`    | `undefined`               | Callback triggered when the phone number digits or country changes. |
| `placeholder`      | `string`                     | `undefined`               | Placeholder text for the number field.                              |
| `flagUrlTemplate`  | `string`                     | `https://flagcdn.com/...` | Custom flag image template. Replaces `{iso2}` token.                |
| `disabled`         | `boolean`                    | `false`                   | Disables the select button and text input box.                      |
| `onCountryChange`  | `(country: Country) => void` | `undefined`               | Triggered when the user selects a new country from the list.        |
| `onToggleDropdown` | `(isOpen: boolean) => void`  | `undefined`               | Triggered when the dropdown toggle triggers.                        |

### Exposed Imperative Methods (`PhoneInputRef`)

Exposed via `forwardRef` to parent components:

- **`getValue()`**: `() => string`  
  Returns the E.164 phone string (e.g., `"+919876543210"`).
- **`getInputValue()`**: `() => string`  
  Returns the raw typed national digits (e.g., `"9876543210"`).
- **`getDialCode()`**: `() => string`  
  Returns the current selected country prefix (e.g., `"+91"`).
- **`getSelectedCountry()`**: `() => Country`  
  Returns the full selected `Country` database object.
- **`setValue(val: string)`**: `(val: string) => void`  
  Smart parses a full E.164 number and adjusts selected country/digits automatically.
- **`setCountry(iso2: string)`**: `(iso2: string) => void`  
  Programmatically sets the selected country.

---

## `usePhoneInput` Custom Hook

Used for building completely custom telephone fields, isolating all logic from markup.

### Arguments

```typescript
function usePhoneInput(options?: PhoneInputOptions): PhoneInputResult;
```

### Return Values (`PhoneInputResult`)

| Attribute            | Type                       | Description                           |
| :------------------- | :------------------------- | :------------------------------------ |
| `selectedCountry`    | `Country`                  | Currently selected country object.    |
| `inputValue`         | `string`                   | Raw number field value.               |
| `isOpen`             | `boolean`                  | Dropdown open/close state.            |
| `searchQuery`        | `string`                   | Target search text.                   |
| `filteredCountries`  | `Country[]`                | Countries matching the search query.  |
| `activeItemIndex`    | `number`                   | Index of focused element in dropdown. |
| `setActiveItemIndex` | `(i: number) => void`      | Changes keyboard item index.          |
| `setSearchQuery`     | `(q: string) => void`      | Updates search filtering.             |
| `setInputValue`      | `(v: string) => void`      | Sanitizes and updates numeric value.  |
| `selectCountry`      | `(c: Country) => void`     | Standard selection callback.          |
| `toggleDropdown`     | `() => void`               | Toggles dropdown state.               |
| `closeDropdown`      | `() => void`               | Closes dropdown list.                 |
| `setValue`           | `(v: string) => void`      | Smart parses complete E.164 strings.  |
| `setCountry`         | `(iso2: string) => void`   | Programmatically selects a country.   |
| `getFlagUrl`         | `(iso2: string) => string` | Returns flag CDN path.                |
| `getDialCode`        | `() => string`             | Returns dial prefix.                  |
| `getValue`           | `() => string`             | Returns combined E.164 value.         |

---

## CSS Variables & Styling Tokens

Customize theme integration using the following tokens:

```css
.pi-wrapper {
  --pi-border-color: #cbd5e1; /* Gray borders */
  --pi-border-color-focus: #3b82f6; /* Blue highlight */
  --pi-bg: #ffffff; /* White background */
  --pi-bg-hover: #f1f5f9; /* Light gray hover */
  --pi-bg-selected: #e2e8f0; /* Gray selection */
  --pi-text-main: #1e293b; /* Dark slate typography */
  --pi-text-muted: #64748b; /* Muted subtext labels */
  --pi-border-radius: 8px; /* Element rounded corners */
  --pi-height: 48px; /* Sizing box height */
}
```
