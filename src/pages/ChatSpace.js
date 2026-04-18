import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMyMembership } from "../services/membershipService";
import {
  connectChatSocket,
  disconnectChatSocket,
  getChatMessages,
  sendChatMessage,
} from "../services/chatService";
import "./chat.css";

const MAX_MESSAGE_LENGTH = 500;

const isMembershipActive = (membership) => {
  if (!membership || membership.status !== "approved") {
    return false;
  }

  return new Date(membership.validTill) >= new Date();
};

const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

const ChatSpace = () => {
  const [membership, setMembership] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [socketError, setSocketError] = useState("");
  const [loadError, setLoadError] = useState("");

  const token = localStorage.getItem("token");
  const currentUserId = useMemo(() => {
    try {
      const raw = token?.split(".")[1];
      if (!raw) {
        return "";
      }
      const parsed = JSON.parse(atob(raw.replace(/-/g, "+").replace(/_/g, "/")));
      return parsed.id || "";
    } catch {
      return "";
    }
  }, [token]);

  const messageListRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setCheckingAccess(true);
      setLoadError("");

      try {
        const member = await getMyMembership();
        if (!isMounted) {
          return;
        }

        setMembership(member);

        if (!isMembershipActive(member)) {
          setMessages([]);
          return;
        }

        setLoadingMessages(true);
        const data = await getChatMessages();
        if (!isMounted) {
          return;
        }
        setMessages(data.messages || []);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setLoadError(err.message || "Unable to load chat");
      } finally {
        if (isMounted) {
          setCheckingAccess(false);
          setLoadingMessages(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!token || !isMembershipActive(membership)) {
      disconnectChatSocket();
      return undefined;
    }

    const socket = connectChatSocket(token);

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((item) => item.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleOnlineCount = (payload) => {
      setOnlineCount(Number(payload?.count || 0));
    };

    const handleSocketError = (err) => {
      setSocketError(err?.message || "Realtime chat disconnected");
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:online-count", handleOnlineCount);
    socket.on("connect_error", handleSocketError);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:online-count", handleOnlineCount);
      socket.off("connect_error", handleSocketError);
      disconnectChatSocket();
    };
  }, [membership, token]);

  useEffect(() => {
    const target = messageListRef.current;
    if (target) {
      target.scrollTop = target.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    const normalized = messageText.replace(/\s+/g, " ").trim();
    if (!normalized || sending) {
      return;
    }

    if (normalized.length > MAX_MESSAGE_LENGTH) {
      setLoadError(`Message must be under ${MAX_MESSAGE_LENGTH} characters`);
      return;
    }

    setSending(true);
    setLoadError("");

    try {
      const response = await sendChatMessage(normalized);
      const created = response?.message;

      // REST fallback keeps UX snappy if socket event is delayed.
      if (created) {
        setMessages((prev) => {
          if (prev.some((item) => item.id === created.id)) {
            return prev;
          }
          return [...prev, created];
        });
      }

      setMessageText("");
    } catch (err) {
      setLoadError(err.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const canChat = isMembershipActive(membership);

  return (
    <>
      <Navbar />

      <main className="chat-space-page">
        <section className="chat-shell">
          <header className="chat-header">
            <div>
              <h1>Connect with MINDS </h1>
              <p>One common room for all active members to interact.</p>
            </div>
            <div className="online-pill">Online: {onlineCount}</div>
          </header>

          {checkingAccess ? (
            <div className="chat-state">Checking membership status...</div>
          ) : !canChat ? (
            <div className="chat-state">
              <h3>Chat unlocks for active members</h3>
              <p>
                Your membership must be approved and valid to enter the common
                space.
              </p>
            </div>
          ) : (
            <>
              {socketError ? <div className="chat-warning">{socketError}</div> : null}
              {loadError ? <div className="chat-error">{loadError}</div> : null}

              <div className="chat-messages" ref={messageListRef}>
                {loadingMessages ? (
                  <div className="chat-state">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="chat-state">
                    No messages yet. Start the conversation.
                  </div>
                ) : (
                  messages.map((message) => {
                    const mine = String(message.senderUserId) === String(currentUserId);
                    return (
                      <article
                        key={message.id}
                        className={`chat-bubble ${mine ? "mine" : "other"}`}
                      >
                        <div className="chat-meta">
                          <strong>{mine ? "You" : message.senderName}</strong>
                          <span>{formatDateTime(message.createdAt)}</span>
                        </div>
                        <p>{message.text}</p>
                      </article>
                    );
                  })
                )}
              </div>

              <form className="chat-form" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageText}
                  maxLength={MAX_MESSAGE_LENGTH}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={!canChat || sending}
                />
                <button type="submit" disabled={!canChat || sending}>
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ChatSpace;
