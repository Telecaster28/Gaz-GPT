import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { type: "user", text: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const botMessage = { type: "bot", text: data.response };

      setMessages([...messages, userMessage, botMessage]);
    } catch (err) {
      setMessages([...messages, userMessage, { type: "bot", text: "Error calling GPT API." }]);
    }

    setInput("");
  };

return (
  <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Gaz GPT Chat</h1>

      <div className="border p-4 h-96 overflow-auto mb-4 rounded-lg">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.type === "user" ? "text-right" : "text-left"}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <input
        type="text"
        className="border p-2 w-full mb-2 rounded-md"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        className="bg-blue-500 text-white p-2 w-full rounded-md hover:bg-blue-600 transition"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  </div>
);
}


export default App;
