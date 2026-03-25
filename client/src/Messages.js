import React, { useState, useEffect } from "react";
import { FaSearch, FaPaperPlane, FaUser } from "react-icons/fa";
import io from "socket.io-client";
import "./Messages.css"; // Ensure this file exists and is styled

const socket = io("http://localhost:5000"); // Connect to backend

const Messages = () => {
  const username = localStorage.getItem("username") || "Guest"; // Get username

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  // Sample static group chats — can be replaced by backend API
  const conversations = [
    { id: "group1", name: "Developers Group", message: "Let's discuss React!" },
    { id: "group2", name: "Tech Talk", message: "Who's using Next.js?" },
    { id: "group3", name: "Career Builders", message: "Hiring updates!" },
  ];

  // Join socket group and handle incoming messages
  useEffect(() => {
    if (selectedChat) {
      socket.emit("joinGroup", selectedChat.id);

      socket.on("receiveMessage", (newMessage) => {
        if (newMessage.groupId === selectedChat.id) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });

      socket.on("typing", (data) => {
        setTypingUsers((prev) =>
          prev.includes(data.user) ? prev : [...prev, data.user]
        );
      });

      socket.on("stoppedTyping", (data) => {
        setTypingUsers((prev) => prev.filter((user) => user !== data.user));
      });

      return () => {
        socket.off("receiveMessage");
        socket.off("typing");
        socket.off("stoppedTyping");
      };
    }
  }, [selectedChat]);

  // Scroll to bottom of chat
  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }, [messages]);

  const handleSendMessage = () => {
    if (selectedChat && messageInput.trim() !== "") {
      socket.emit("sendMessage", {
        sender: username,
        text: messageInput,
        groupId: selectedChat.id,
      });
      setMessageInput("");
    }
  };

  const handleTyping = () => {
    if (selectedChat) {
      socket.emit("userTyping", { user: username, groupId: selectedChat.id });
    }
  };

  const handleStopTyping = () => {
    if (selectedChat) {
      socket.emit("userStoppedTyping", { user: username, groupId: selectedChat.id });
    }
  };

  return (
    <div className="messages-container">
      {/* Sidebar for conversations */}
      <div className="messages-sidebar">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search messages..." />
        </div>
        {conversations.map((chat) => (
          <div
            key={chat.id}
            className={`chat-item ${selectedChat?.id === chat.id ? "active" : ""}`}
            onClick={() => {
              setMessages([]); // Clear previous messages
              setSelectedChat(chat);
            }}
          >
            <FaUser className="user-icon" />
            <div className="chat-info">
              <span className="chat-name">{chat.name}</span>
              <span className="chat-message">{chat.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat Window */}
      <div className="messages-chat">
        {selectedChat ? (
          <>
            <h2>{selectedChat.name}</h2>
            <div className="chat-box">
              {messages.map((msg, index) => (
                <p key={index} className="received-message">
                  <strong>{msg.sender}: </strong>
                  {msg.text}
                </p>
              ))}
            </div>

            {/* Typing Indicator */}
            {typingUsers.length > 0 && (
              <p className="typing-indicator">
                {typingUsers.join(", ")} is typing...
              </p>
            )}

            {/* Message Input */}
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleTyping}
                onKeyUp={handleStopTyping}
              />
              <button className="send-button" onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <p className="select-chat">Select a conversation to start messaging!</p>
        )}
      </div>
    </div>
  );
};

export default Messages;
