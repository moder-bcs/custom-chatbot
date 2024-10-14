import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots } from 'react-icons/fa';
 
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false); 
 
  const chatBoxRef = useRef(null);
 
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
      const hidePopupTimer = setTimeout(() => {
        setShowPopup(false);
      }, 5000); 
      return () => clearTimeout(hidePopupTimer);
    }, 1000); 
  }, []);
 
  
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
 
 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
 
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { user: 'user', text: input }]);
      setMessages((prev) => [
        ...prev,
        { user: 'bot', text: 'I am here to help with anything you need!' },
      ]);
      setInput('');
    }
  };
 
  
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
 
    
    if (!hasOpenedOnce) {
      setMessages((prev) => [
        ...prev,
        { user: 'bot', text: 'How can I assist you today?' },
      ]);
      setHasOpenedOnce(true); 
    }
 
    setShowPopup(false); 
  };
 
  return (
    <div>
      {}
      <button onClick={toggleChatbot} style={styles.chatbotButton}>
        <FaCommentDots style={styles.icon} />
      </button>
 
      {}
      {showPopup && !showChatbot && (
        <div style={styles.popupMessage}>
          How can I assist you?
        </div>
      )}
 
      {/* Chatbot Window */}
      {showChatbot && (
        <div style={styles.chatContainer}>
          <div style={styles.chatBox} ref={chatBoxRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: message.user === 'bot' ? 'flex-start' : 'flex-end',
                  backgroundColor: message.user === 'bot' ? '#f1f0f0' : '#007bff',
                  color: message.user === 'bot' ? '#000' : '#fff',
                  animation: 'fadeIn 0.3s', 
                }}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} 
              placeholder="Type a message..."
            />
            <button onClick={handleSend} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 

const styles = {
  chatbotButton: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    fontSize: '24px',
    transition: 'background-color 0.3s ease, transform 0.3s ease', 
  },
  chatbotButtonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.1)',
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.4)',
  },
  icon: {
    fontSize: '30px',
    color: '#fff',
  },
  popupMessage: {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    fontSize: '14px',
    zIndex: 1000,
    animation: 'fadeIn 0.5s, fadeOut 0.5s 4.5s', 
  },
  chatContainer: {
    position: 'fixed',
    bottom: '90px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '400px',
    width: '300px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '20px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    overflow: 'hidden',
    animation: 'fadeIn 0.3s', 
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'scroll',
    flex: 1,
    paddingRight: '5px',
    scrollbarWidth: 'none', 
  },
  message: {
    maxWidth: '60%',
    padding: '10px',
    borderRadius: '15px',
    wordWrap: 'break-word',
  },
  inputContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '15px',
    border: 'none',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  sendButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};
 

const globalStyles = `
  .chatBox::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      to {
        opacity: 0;
      }
    }
  }
`;
 

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);
 
export default Chatbot;