import { useState } from "react";

import axios from "axios";

import ReactMarkdown from "react-markdown";

import { Prism as SyntaxHighlighter }
from "react-syntax-highlighter";

import { oneDark }
from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {

  /* =========================
      STATES
  ========================= */

  const [conversations, setConversations] = useState(() => {

    const saved = localStorage.getItem(
      "conversations"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [currentChatId, setCurrentChatId] =
    useState(() => {

      const saved = localStorage.getItem(
        "currentChatId"
      );

      return saved ? Number(saved) : null;
    });

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] =
    useState(false);

  /* =========================
      SAVE FUNCTIONS
  ========================= */

  const saveConversations = (
    updatedChats
  ) => {

    setConversations(updatedChats);

    localStorage.setItem(
      "conversations",
      JSON.stringify(updatedChats)
    );
  };

  const saveCurrentChatId = (id) => {

    setCurrentChatId(id);

    localStorage.setItem(
      "currentChatId",
      id
    );
  };

  /* =========================
      CREATE NEW CHAT
  ========================= */

  const createNewChat = () => {

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    };

    const updatedChats = [
      newChat,
      ...conversations
    ];

    saveConversations(updatedChats);

    saveCurrentChatId(newChat.id);
  };

  /* =========================
      CURRENT CHAT
  ========================= */

  const currentChat = conversations.find(
    (chat) => chat.id === currentChatId
  );

  /* =========================
      SEND MESSAGE
  ========================= */

  const sendMessage = async () => {

    if (!message.trim()) return;

    let activeChatId = currentChatId;

    let updatedChats = [...conversations];

    /* CREATE CHAT IF NONE */

    if (!activeChatId) {

      const newChat = {
        id: Date.now(),
        title: message,
        messages: []
      };

      updatedChats = [
        newChat,
        ...updatedChats
      ];

      activeChatId = newChat.id;

      saveCurrentChatId(activeChatId);
    }

    /* USER MESSAGE */

    const userMessage = {
      role: "user",
      text: message
    };

    updatedChats = updatedChats.map(
      (chat) => {

        if (chat.id === activeChatId) {

          return {

            ...chat,

            title:
              chat.messages.length === 0
                ? message
                : chat.title,

            messages: [
              ...chat.messages,
              userMessage
            ]
          };
        }

        return chat;
      });

    saveConversations(updatedChats);

    setMessage("");

    setLoading(true);

    try {

      /* CURRENT CHAT HISTORY */

      const activeChat =
        updatedChats.find(
          (chat) =>
            chat.id === activeChatId
        );

      const res = await axios.post(
        "http://127.0.0.1:8000/api/chat",
        {

          message: userMessage.text,

          history:
            activeChat?.messages || []
        }
      );

      const aiMessage = {

        role: "ai",

        text: res.data.response
      };

      updatedChats = updatedChats.map(
        (chat) => {

          if (
            chat.id === activeChatId
          ) {

            return {

              ...chat,

              messages: [
                ...chat.messages,
                aiMessage
              ]
            };
          }

          return chat;
        });

      saveConversations(updatedChats);

    } catch (error) {

      console.log(error);

      const errorMessage = {

        role: "ai",

        text:
          "❌ Backend connection error"
      };

      updatedChats = updatedChats.map(
        (chat) => {

          if (
            chat.id === activeChatId
          ) {

            return {

              ...chat,

              messages: [
                ...chat.messages,
                errorMessage
              ]
            };
          }

          return chat;
        });

      saveConversations(updatedChats);
    }

    setLoading(false);
  };

  /* =========================
      DELETE CHAT
  ========================= */

  const deleteChat = (id) => {

    const filteredChats =
      conversations.filter(
        (chat) => chat.id !== id
      );

    saveConversations(filteredChats);

    if (filteredChats.length > 0) {

      saveCurrentChatId(
        filteredChats[0].id
      );

    } else {

      saveCurrentChatId(null);
    }
  };

  /* =========================
      PDF UPLOAD
  ========================= */

  const handlePdfUpload = async (
    e
  ) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    setUploading(true);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload-pdf",
        formData,
        {

          headers: {

            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      const aiMessage = {

        role: "ai",

        text:
          `📄 ${res.data.response}`
      };

      const updatedChats =
        conversations.map((chat) => {

          if (
            chat.id === currentChatId
          ) {

            return {

              ...chat,

              messages: [
                ...chat.messages,
                aiMessage
              ]
            };
          }

          return chat;
        });

      saveConversations(updatedChats);

    } catch (error) {

      console.log(error);
    }

    setUploading(false);
  };

  /* =========================
      MARKDOWN COMPONENTS
  ========================= */

  const markdownComponents = {

    code({
      inline,
      className,
      children,
      ...props
    }) {

      const match =
        /language-(\w+)/.exec(
          className || ""
        );

      return !inline && match ? (

        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >

          {String(children).replace(
            /\n$/,
            ""
          )}

        </SyntaxHighlighter>

      ) : (

        <code
          className="
            bg-slate-700
            px-1
            py-0.5
            rounded
          "
          {...props}
        >

          {children}

        </code>
      );
    }
  };

  /* =========================
      UI
  ========================= */

  return (

    <div
      className="
        flex
        h-screen
        bg-slate-950
        text-white
      "
    >

      {/* ======================
            SIDEBAR
      ====================== */}

      <div
        className="
          w-72
          bg-slate-900
          border-r
          border-slate-800
          flex
          flex-col
        "
      >

        {/* LOGO */}

        <div className="p-5">

          <h1
            className="
              text-2xl
              font-bold
              text-cyan-400
            "
          >
            AI College Companion
          </h1>

          <button
            onClick={createNewChat}
            className="
              mt-6
              w-full
              bg-cyan-500
              hover:bg-cyan-600
              p-3
              rounded-xl
              font-semibold
              transition
            "
          >
            + New Chat
          </button>

        </div>

        {/* HISTORY */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            pb-4
            space-y-2
          "
        >

          {
            conversations.map(
              (chat) => (

                <div
                  key={chat.id}

                  className={`
                    flex
                    items-center
                    justify-between
                    p-3
                    rounded-xl
                    cursor-pointer
                    transition

                    ${
                      currentChatId ===
                      chat.id

                        ? "bg-cyan-500"

                        : "bg-slate-800 hover:bg-slate-700"
                    }
                  `}
                >

                  <div
                    className="
                      truncate
                      flex-1
                    "

                    onClick={() =>
                      saveCurrentChatId(
                        chat.id
                      )
                    }
                  >
                    {chat.title}
                  </div>

                  <button
                    onClick={() =>
                      deleteChat(chat.id)
                    }

                    className="
                      ml-3
                      text-red-300
                      hover:text-red-500
                    "
                  >
                    ✕
                  </button>

                </div>
              ))
          }

        </div>

      </div>

      {/* ======================
            MAIN CHAT
      ====================== */}

      <div
        className="
          flex-1
          flex
          flex-col
        "
      >

        {/* HEADER */}

        <div
          className="
            p-5
            border-b
            border-slate-800
            text-2xl
            font-semibold
            text-cyan-300
          "
        >
          AI Assistant for Aspiring College Students
        </div>

        {/* MESSAGES */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-6
            space-y-5
          "
        >

          {
            currentChat?.messages.map(
              (
                chat,
                index
              ) => (

                <div
                  key={index}

                  className={`
                    max-w-4xl
                    p-5
                    rounded-2xl
                    leading-8
                    whitespace-pre-wrap

                    ${
                      chat.role ===
                      "user"

                        ? "bg-cyan-500 ml-auto"

                        : "bg-slate-800 text-gray-200"
                    }
                  `}
                >

                  {
                    chat.role ===
                    "ai"

                      ? (

                        <ReactMarkdown
                          components={
                            markdownComponents
                          }
                        >

                          {chat.text}

                        </ReactMarkdown>

                      )

                      : (

                        chat.text
                      )
                  }

                </div>
              ))
          }

          {/* TYPING */}

          {
            loading && (

              <div
                className="
                  bg-slate-800
                  p-4
                  rounded-2xl
                  w-fit
                  flex
                  gap-2
                "
              >

                <div
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-white
                    animate-bounce
                  "
                ></div>

                <div
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-white
                    animate-bounce
                    delay-100
                  "
                ></div>

                <div
                  className="
                    w-2
                    h-2
                    rounded-full
                    bg-white
                    animate-bounce
                    delay-200
                  "
                ></div>

              </div>
            )
          }

          {/* PDF LOADING */}

          {
            uploading && (

              <div
                className="
                  bg-purple-500
                  p-4
                  rounded-2xl
                  w-fit
                "
              >
                📄 Uploading PDF...
              </div>
            )
          }

        </div>

        {/* INPUT AREA */}

        <div
          className="
            p-5
            border-t
            border-slate-800
            flex
            gap-4
            items-center
          "
        >

          {/* INPUT */}

          <input
            type="text"

            placeholder="Ask anything..."

            value={message}

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {

                sendMessage();
              }
            }}

            className="
              flex-1
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:outline-none
            "
          />

          {/* SEND BUTTON */}

          <button
            onClick={sendMessage}

            className="
              bg-cyan-500
              hover:bg-cyan-600
              px-6
              py-4
              rounded-xl
              font-semibold
              transition
            "
          >
            Send
          </button>

          {/* PDF BUTTON */}

          <label
            className="
              bg-purple-500
              hover:bg-purple-600
              px-5
              py-4
              rounded-xl
              cursor-pointer
              font-semibold
              transition
            "
          >

            Upload PDF

            <input
              type="file"

              accept=".pdf"

              hidden

              onChange={
                handlePdfUpload
              }
            />

          </label>

        </div>

      </div>

    </div>
  );
}

export default App;