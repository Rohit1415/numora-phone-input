"use client";

import React, { useState } from "react";
import { PhoneInput } from "numora-phone-input";
import "numora-phone-input/style.css";

export default function Page() {
  const [phone, setPhone] = useState("");

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Next.js Hydration-Safe Example</h1>
      <p>This component uses React 18's useId to ensure server-side rendering and hydration safety on Next.js.</p>
      
      <div style={{ marginTop: "2rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
          Mobile Number
        </label>
        <PhoneInput
          defaultCountry="gb"
          value={phone}
          onChange={setPhone}
          placeholder="Enter phone number"
        />
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}>
        E.164 Output Value: <span style={{ fontFamily: "monospace" }}>{phone || "(empty)"}</span>
      </div>
    </main>
  );
}
