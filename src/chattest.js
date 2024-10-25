import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaMicrophone } from 'react-icons/fa';
 
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [userResponses, setUserResponses] = useState({ name: '', email: '' });
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
 
  const steps = ['What is your name?', 'What is your email address?'];
  const chatBoxRef = useRef(null);
 
  // SpeechRecognition API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
 
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
 
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
 
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
 
  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { user: 'user', text: input }]);
      if (currentStep === 0) {
        setUserResponses({ ...userResponses, name: input });
      } else if (currentStep === 1) {
        setUserResponses({ ...userResponses, email: input });
      }
      setInput('');
      goToNextStep();
    }
  };
 
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setMessages((prev) => [
        ...prev,
        { user: 'bot', text: steps[currentStep + 1] },
      ]);
    }
  };
 
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setMessages((prev) => [
        ...prev,
        { user: 'bot', text: steps[currentStep - 1] },
      ]);
    }
  };
 
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    if (!hasOpenedOnce || messages.length === 0) {
      setMessages([{ user: 'bot', text: 'How can I assist you today?' }]);
      setHasOpenedOnce(true);
    }
    setShowPopup(false);
  };
 
  const clearConversation = () => {
    setMessages([{ user: 'bot', text: 'How can I assist you today?' }]);
    setCurrentStep(0);
  };
 
  const handleSpeech = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }
 
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
 
    recognition.onstart = () => {
      console.log('Voice recognition activated. Try speaking into the microphone.');
    };
 
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      setInput(transcript);
      setIsListening(false);
    };
 
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
 
    recognition.onend = () => {
      console.log('Voice recognition turned off.');
      setIsListening(false);
    };
  };
 
  return (
    <div>
      <button onClick={toggleChatbot} style={styles.chatbotButton}>
        <FaCommentDots style={styles.icon} />
      </button>
 
      {showPopup && !showChatbot && (
        <div style={styles.popupMessage}>
          How can I assist you?
        </div>
      )}
 
      {showChatbot && (
        <div style={styles.chatContainer}>
          <img src="./logo512.png" alt="Org's Name" style={styles.logo} />
 
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
            <button
              onClick={handleSpeech}
              style={{
                ...styles.micButton,
                backgroundColor: isListening ? '#ff4d4d' : '#007bff',
              }}
            >
              <FaMicrophone />
            </button>
          </div>
 
          <div style={styles.buttonContainer}>
            <button onClick={clearConversation} style={styles.clearButton}>
              Clear Conversation
            </button>
            {currentStep > 0 && (
              <button onClick={goToPreviousStep} style={styles.navButton}>
                Previous
              </button>
            )}
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
  logo: {
    width: '100%',
    maxHeight: '50px',
    marginBottom: '10px',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'scroll',
    flex: 1,
    paddingRight: '5px',
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
  micButton: {
    padding: '10px 15px',
    color: '#fff',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  clearButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    flex: 1,
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
};
 
const globalStyles = `
  .chatBox::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Edge */
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOut {
    from { opacity: 1;
    to { opacity: 0; }
  }
`;
 
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);
 
export default Chatbot;
