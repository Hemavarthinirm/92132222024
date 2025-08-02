import React, { useState } from "react";
import "./App.css";

function App() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [validity, setValidity] = useState(30); // default 30 minutes
  const [result, setResult] = useState("");

  const handleShorten = async () => {
    if (!longUrl.trim()) {
      alert("Please enter a URL.");
      return;
    }

    // Step 1: Send log to Affordmed API
    await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_TOKEN_HERE"
      },
      body: JSON.stringify({
        stack: "frontend",
        level: "info",
        package: "component",
        message: "User clicked shorten button"
      })
    });

    // Step 2: Call backend API (you can replace this with your own endpoint)
    const response = await fetch("http://localhost:4000/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: longUrl,
        shortcode: customCode || undefined,
        validity: parseInt(validity) || 30
      })
    });

    const data = await response.json();
    if (data.shortenedUrl) {
      setResult(data.shortenedUrl);
    } else {
      setResult("Something went wrong. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>🔗 React URL Shortener</h2>

      <input
        type="text"
        placeholder="Paste your long URL here"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
      />

      <input
        type="text"
        placeholder="Optional shortcode (e.g. mylink123)"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
      />

      <input
        type="number"
        placeholder="Validity (minutes, default 30)"
        value={validity}
        onChange={(e) => setValidity(e.target.value)}
      />

      <button onClick={handleShorten}>Shorten</button>

      {result && (
        <div className="result">
          <p>Shortened URL:</p>
          <a href={result} target="_blank" rel="noopener noreferrer">
            {result}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
