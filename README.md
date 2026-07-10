# Numora React Library

An extremely lightweight, production-ready, and fully accessible (WCAG 2.2 AA compliant) React phone input component. Written in TypeScript with strict type definitions, full keyboard accessibility, E.164 smart formatting, and dynamic country search capabilities. Optimized for tree-shaking and fully SSR-compatible / hydration-safe for Next.js.

---

## Features

- **Zero Runtime Dependencies**: Keep your application bundle light and performant.
- **TypeScript-first**: Full type interfaces exported out-of-the-box. See [src/types/index.ts](file:///home/admin/Desktop/apps/phone-input/src/types/index.ts).
- **ESM & CommonJS Support**: Pre-built exports for modern bundlers (`dist/index.mjs`) and Node environments (`dist/index.js`).
- **WCAG 2.2 AA / Accessibility Compliant**: Focus indicators, alt attributes for flag images, structured semantic markup with proper ARIA attributes (`aria-expanded`, `aria-haspopup`, `role="listbox"`, `role="option"`), and keyboard list navigation (Arrow Down, Arrow Up, Esc, and Tab).
- **Smart Parsing**: Feed full E.164 numbers programmatically to `setValue()` (via ref) to automatically detect the country code and separate the national number digits.
- **Easy Custom Styling**: Configured with CSS variables to make custom theme integrations effortless. See [src/styles/index.css](file:///home/admin/Desktop/apps/phone-input/src/styles/index.css).
- **React Custom Hook**: Logic is separated into a custom [usePhoneInput](file:///home/admin/Desktop/apps/phone-input/src/hooks/usePhoneInput.ts) hook, allowing you to build completely custom phone input interfaces if needed.

---

## Installation

Install using Bun (preferred for the project workspace):
```bash
bun add numora
```

Or using another package manager:
```bash
npm install numora
# or
pnpm add numora
# or
yarn add numora
```

Ensure you import the CSS stylesheet in your app entrypoint:
```javascript
import "numora/style.css";
```

---

## Basic Usage

### 1. Controlled Component

```tsx
import React, { useState } from "react";
import { PhoneInput } from "numora";
import "numora/style.css";

export default function App() {
  const [value, setValue] = useState(""); // E.164 output state (e.g. "+919876543210")

  return (
    <div>
      <label htmlFor="phone">Mobile Number</label>
      <PhoneInput
        id="phone"
        defaultCountry="us"
        value={value}
        onChange={setValue}
        placeholder="Enter your mobile number"
      />
      <p>Output value: {value}</p>
    </div>
  );
}
```

### 2. Using Imperative APIs (Refs)

The component exposes public methods via `forwardRef`. See [src/components/PhoneInput.tsx](file:///home/admin/Desktop/apps/phone-input/src/components/PhoneInput.tsx).

```tsx
import React, { useRef } from "react";
import { PhoneInput, PhoneInputRef } from "numora";
import "numora/style.css";

export default function App() {
  const phoneRef = useRef<PhoneInputRef>(null);

  const handleSetNumber = () => {
    // Smart parses and updates country to UK (+44)
    phoneRef.current?.setValue("+447911123456");
  };

  const handleLogDetails = () => {
    console.log("Combined Value:", phoneRef.current?.getValue()); // "+447911123456"
    console.log("Typed Digits:", phoneRef.current?.getInputValue()); // "7911123456"
    console.log("Dial Code:", phoneRef.current?.getDialCode()); // "+44"
    console.log("Country Object:", phoneRef.current?.getSelectedCountry());
  };

  return (
    <div>
      <PhoneInput ref={phoneRef} defaultCountry="us" />
      <button onClick={handleSetNumber}>Set UK Number</button>
      <button onClick={handleLogDetails}>Log Details</button>
    </div>
  );
}
```

---

## Customization

### Styling via CSS Variables

Override the namespaced variables in your local stylesheet to match your app theme:

```css
.pi-wrapper {
  --pi-border-color: #cbd5e1;       /* Border line colors */
  --pi-border-color-focus: #3b82f6; /* Accent color on focus */
  --pi-bg: #ffffff;                 /* Background color of elements */
  --pi-bg-hover: #f1f5f9;           /* Hover items background */
  --pi-bg-selected: #e2e8f0;        /* Selected list item highlights */
  --pi-text-main: #1e293b;          /* Text typography color */
  --pi-text-muted: #64748b;         /* Dial code/placeholder label text */
  --pi-border-radius: 8px;          /* Border radius sizing */
  --pi-height: 48px;                /* Sizing heights of inputs */
}
```

---

## API Reference

### Component Props (`PhoneInputProps`)

*   `id` (`string`): Unique HTML identifier (defaults to a hydration-safe `useId()` token).
*   `className` (`string`): Custom class name to apply on the wrapper container.
*   `defaultCountry` (`string`): ISO2 code of default selected country (e.g. `"us"`). Default is `"in"`.
*   `value` (`string`): Controlled value state (accepts E.164 strings starting with `+` to automatically update the country code).
*   `onChange` (`(value: string) => void`): Callback triggered when the telephone input changes (returns the E.164 string).
*   `placeholder` (`string`): Input text box placeholder.
*   `flagUrlTemplate` (`string`): URL template structure for flag assets. Defaults to `"https://flagcdn.com/24x18/{iso2}.png"`.
*   `disabled` (`boolean`): If set to `true`, elements are styled and marked disabled.
*   `onCountryChange` (`(country: Country) => void`): Triggered when country selection changes.
*   `onToggleDropdown` (`(isOpen: boolean) => void`): Triggered when country selector list toggles.

### Custom Hook (`usePhoneInput`)

If you want to construct a completely customized UI, you can import and use the state-management hook directly:

```typescript
import { usePhoneInput } from "numora";

const {
  selectedCountry,
  inputValue,
  isOpen,
  searchQuery,
  filteredCountries,
  activeItemIndex,
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
} = usePhoneInput(options);
```

---

## Development & Operations

### Build Library
Build the project for production outputs:
```bash
bun run build
```

### Run Tests
Execute the Vitest suite (asserting rendering, user typing, keyboard navigation, and custom hook actions):
```bash
bun run test
```

### Run Storybook
Launch the local Storybook documentation page:
```bash
bun run storybook
```
See stories in [src/components/PhoneInput.stories.tsx](file:///home/admin/Desktop/apps/phone-input/src/components/PhoneInput.stories.tsx).

### CI/CD & NPM Publishing
A single GitHub Actions workflow is configured in **[publish.yml](file:///home/admin/Desktop/apps/phone-input/.github/workflows/publish.yml)** to manage the entire release pipeline with separate chained jobs:
1.  **`lint`**: Validates code syntax via ESLint and runs TypeScript type checking.
2.  **`test`** (needs `lint`): Runs all unit tests with Vitest.
3.  **`build`** (needs `test`): Compiles package bundles and Storybook docs.
4.  **`publish`** (needs `build`): Publishes the library to npm on pushes to `main` or `master` branches using the `NPM_TOKEN` secret.



