import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ASSISTANT',
      content: '👋 Hi! I am your **IMS AI Assistant**. Ask me about open internships, eligibility guidelines, cover letters, or weekly reports!',
      sources: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userQuery = inputText.trim();
    setInputText('');

    // Append user message to UI
    const newMsgList = [...messages, { sender: 'USER', content: userQuery }];
    setMessages(newMsgList);
    setLoading(true);

    try {
      if (!isAuthenticated) {
        // Fallback for unauthenticated visitors
        setTimeout(() => {
          setMessages([
            ...newMsgList,
            {
              sender: 'ASSISTANT',
              content: `To get personalized internship recommendations and submit applications, please **[Sign In](/login)** or **[Register](/register/student)**.\n\nYou can browse publicly listed opportunities on the **[Internships](/internships)** page.`,
              sources: ['Public Platform Directory']
            }
          ]);
          setLoading(false);
        }, 600);
        return;
      }

      const res = await api.post('/ai/chat', {
        message: userQuery,
        conversationId: conversationId
      });

      if (res.data.success && res.data.data) {
        const responseData = res.data.data;
        if (!conversationId && responseData.conversationId) {
          setConversationId(responseData.conversationId);
        }

        setMessages([
          ...newMsgList,
          {
            sender: 'ASSISTANT',
            content: responseData.message,
            sources: responseData.retrievedSources || [],
            isLiveLlm: responseData.liveLlm,
            modelName: responseData.modelName
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages([
        ...newMsgList,
        {
          sender: 'ASSISTANT',
          content: '⚠️ Sorry, I could not process your query at this moment. Please check your network connection and try again.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([
      {
        sender: 'ASSISTANT',
        content: 'Conversation reset. What questions do you have regarding internships or evaluations?',
        sources: []
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className="chat-fab-button shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
        title="Chat with IMS Assistant"
      >
        {isOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-robot"></i>}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="chat-modal-window">
          {/* Header */}
          <div className="chat-header">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <i className="bi bi-robot fs-6"></i>
              </div>
              <div>
                <h6 className="mb-0 text-white fw-bold">IMS AI Assistant</h6>
                <span className="badge bg-white text-primary py-0 px-2" style={{ fontSize: '0.65rem' }}>RAG Powered</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-sm btn-outline-light border-0 py-0 px-2"
                title="Start New Discussion"
                onClick={handleNewChat}
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-light border-0 py-0 px-2"
                onClick={() => setIsOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-container">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message-bubble ${msg.sender === 'USER' ? 'message-user' : 'message-assistant'}`}
              >
                <div className="markdown-content">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-top border-light-subtle small text-muted">
                    <span className="fw-semibold d-block text-secondary" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-link-45deg"></i> Grounded Sources:
                    </span>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {msg.sources.map((src, sIdx) => (
                        <span key={sIdx} className="badge bg-light text-dark border small" style={{ fontSize: '0.68rem' }}>
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message-bubble message-assistant">
                <span className="text-muted small me-2">Assistant is thinking</span>
                <span className="typing-dot"></span>
                <span className="typing-dot mx-1"></span>
                <span className="typing-dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-2 border-top bg-white d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control form-control-sm rounded-pill px-3"
              placeholder="Ask about internships, rules..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="btn btn-ims-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '34px', height: '34px', flexShrink: 0 }}
              disabled={!inputText.trim() || loading}
            >
              <i className="bi bi-send-fill" style={{ fontSize: '0.8rem' }}></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
