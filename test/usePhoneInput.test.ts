import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePhoneInput } from "../src/hooks/usePhoneInput";

describe("usePhoneInput hook", () => {
  test("initializes with default options", () => {
    const { result } = renderHook(() => usePhoneInput({ defaultCountry: "us" }));

    expect(result.current.selectedCountry.iso2).toBe("us");
    expect(result.current.getDialCode()).toBe("+1");
    expect(result.current.inputValue).toBe("");
    expect(result.current.isOpen).toBe(false);
  });

  test("sanitizes typed inputs by keeping only numbers", () => {
    const { result } = renderHook(() => usePhoneInput());

    act(() => {
      result.current.setInputValue("987abc-654 321");
    });

    expect(result.current.inputValue).toBe("987654321");
    expect(result.current.getValue()).toBe("+91987654321");
  });

  test("parses full phone numbers and auto-updates selected country", () => {
    const { result } = renderHook(() => usePhoneInput({ defaultCountry: "us" }));

    act(() => {
      result.current.setValue("+447911123456");
    });

    expect(result.current.selectedCountry.iso2).toBe("gb");
    expect(result.current.inputValue).toBe("7911123456");
    expect(result.current.getValue()).toBe("+447911123456");
  });

  test("toggles dropdown display state", () => {
    const { result } = renderHook(() => usePhoneInput());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleDropdown();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeDropdown();
    });
    expect(result.current.isOpen).toBe(false);
  });

  test("selects a country programmatically", () => {
    const { result } = renderHook(() => usePhoneInput());

    act(() => {
      result.current.setCountry("gb");
    });

    expect(result.current.selectedCountry.iso2).toBe("gb");
    expect(result.current.getDialCode()).toBe("+44");
  });
});
