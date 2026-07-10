import React, { useRef, useState } from "react";
import { PhoneInput, PhoneInputRef } from "numora-phone-input";
import "numora-phone-input/style.css";

export default function App() {
  const phoneRef = useRef<PhoneInputRef>(null);
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitted phone number: ${phoneRef.current?.getValue()}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20, maxWidth: 400 }}>
      <h3>React SPA Example</h3>
      <PhoneInput
        ref={phoneRef}
        defaultCountry="us"
        value={value}
        onChange={setValue}
        placeholder="Enter your phone number"
      />
      <div style={{ marginTop: 10 }}>
        <button type="submit">Submit</button>
        <button 
          type="button" 
          onClick={() => phoneRef.current?.setValue("+447911123456")} 
          style={{ marginLeft: 10 }}
        >
          Set UK Number
        </button>
      </div>
      <p>Current state value: {value}</p>
    </form>
  );
}
