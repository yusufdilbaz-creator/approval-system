import React, { useState } from "react";

export default function App() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 40 }}>
      <h1>Approval System 🚀</h1>

      <input
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p>You wrote: {text}</p>
    </div>
  );
}
