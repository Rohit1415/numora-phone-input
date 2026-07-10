import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { createRef } from "react";
import { PhoneInput, PhoneInputRef } from "../src/components/PhoneInput";

describe("PhoneInput Component", () => {
  test("renders the basic input elements successfully", () => {
    const { container } = render(<PhoneInput defaultCountry="us" placeholder="Enter phone" />);

    const input = screen.getByLabelText("Phone number") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe("Enter phone");

    const dialCode = container.querySelector(".pi-dial-code");
    expect(dialCode).toBeInTheDocument();
    expect(dialCode).toHaveTextContent("+1");
  });

  test("sanitizes text inputs by removing non-digits", async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="in" />);

    const input = screen.getByLabelText("Phone number") as HTMLInputElement;
    await user.type(input, "987abc-654");

    expect(input.value).toBe("987654");
  });

  test("toggles dropdown visibility on clicking selector button", async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="us" />);

    const selector = screen.getByLabelText("Select country code");
    const dropdown = screen.getByLabelText("Search countries").closest(".pi-dropdown");

    expect(dropdown).not.toHaveClass("open");

    await user.click(selector);
    expect(dropdown).toHaveClass("open");

    const searchInput = screen.getByLabelText("Search countries");
    expect(searchInput).toHaveFocus();
  });

  test("filters country options via the search box", async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="us" />);

    const selector = screen.getByLabelText("Select country code");
    await user.click(selector);

    const searchInput = screen.getByLabelText("Search countries");
    await user.type(searchInput, "germany");

    const items = screen.getAllByRole("option");
    expect(items.length).toBe(1);
    expect(items[0]).toHaveTextContent("Germany");
  });

  test("selects a country and updates display text", async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="us" />);

    const selector = screen.getByLabelText("Select country code");
    await user.click(selector);

    const searchInput = screen.getByLabelText("Search countries");
    await user.type(searchInput, "united kingdom");

    const item = screen.getByRole("option");
    await user.click(item);

    const dialCodeElement = selector.querySelector(".pi-dial-code");
    expect(dialCodeElement).toHaveTextContent("+44");
    expect(selector).toHaveFocus();
  });

  test("exposes public imperative handle APIs via React ref", () => {
    const ref = createRef<PhoneInputRef>();
    render(<PhoneInput ref={ref} defaultCountry="us" />);

    expect(ref.current).toBeDefined();

    act(() => {
      ref.current?.setValue("+919876543210");
    });
    expect(ref.current?.getSelectedCountry().iso2).toBe("in");
    expect(ref.current?.getInputValue()).toBe("9876543210");
    expect(ref.current?.getDialCode()).toBe("+91");
    expect(ref.current?.getValue()).toBe("+919876543210");

    act(() => {
      ref.current?.setCountry("gb");
    });
    expect(ref.current?.getSelectedCountry().iso2).toBe("gb");
  });

  test("supports keyboard dropdown navigation and ESC close", async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="us" />);

    const selector = screen.getByLabelText("Select country code");
    await user.click(selector);

    const searchInput = screen.getByLabelText("Search countries");
    expect(searchInput).toHaveFocus();

    await user.keyboard("{ArrowDown}");

    const firstOption = screen.getAllByRole("option")[0];
    expect(firstOption).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(selector).toHaveFocus();

    const dropdown = screen.getByLabelText("Search countries").closest(".pi-dropdown");
    expect(dropdown).not.toHaveClass("open");
  });
});
