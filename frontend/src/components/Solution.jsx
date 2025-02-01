import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { BsClipboardCheckFill, BsClipboard } from 'react-icons/bs';
import ScrollToBottom from 'react-scroll-to-bottom';

const Solution = ({ fileName, onClose }) => {
    const [solutionText, setSolutionText] = useState('');
    const [copied, setCopied] = useState(false);
    const chatContainerRef = useRef(null);


    useEffect(() => {
        const fetchSolution = async () => {
            try {
              const response = await axios.get(`/api/solutions/${fileName}`);
              setSolutionText(response.data);
            } catch (error) {
              console.error('Error fetching solution:', error);
            }
          };

          fetchSolution();
    },[fileName]);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset after 3 seconds
    };

    const solutionLines = solutionText.trim().split(/(?=Question \d+:\n)/); // Split by question headers

    const [userInput, setUserInput] = useState("");
     const [chatMessages, setChatMessages] = useState([]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleSendMessage = () => {
      if (userInput.trim() === '') return; // Don't send empty messages

      const newMessage = {
        text: userInput,
        sender: 'user'
      }

        setChatMessages(prevMessages => [...prevMessages, newMessage]);

        const prompt = `Consider the code given below and answer the question asked : ${userInput} \n Code: ${solutionText} `
        const sendPrompt = async() => {
          try{
            const response = await axios.post('/api/gemini-chat', {
              prompt: prompt
            });
             const botMessage = {
               text: response.data.generatedText,
               sender: 'bot'
              }
             setChatMessages(prevMessages => [...prevMessages, botMessage])
          }catch(err){
              console.error('Error sending message: ', err);
          }
        }
       sendPrompt()

         setUserInput("")
  };
  return(
    <div className='solution-box'>
    <div className="solution-header">
            <p>Solution for: {fileName}</p>
            <button onClick={onClose} className='close-button'>Close</button>
        </div>

      <div className="solution-container">
         {solutionLines.map((line, index) => (
         <div key={index} className='solution-item'>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
             <p>
              {line.startsWith('Question') ? line.split('\n')[0] : "Generated Code"}
            </p>
         <CopyToClipboard text={line} onCopy={handleCopy}>
              <button className="copy-button">
                {copied ? <BsClipboardCheckFill /> : <BsClipboard />}
             </button>
          </CopyToClipboard>
          </div>
           <pre style={{ margin: 0 }}>
            {line.split('\n').slice(1).join('\n')}
          </pre>
         </div>
           ))}
    </div>
    <div className="chat-box">
    <ScrollToBottom className='chat-container'  mode="bottom"  behavior='smooth'  initialScrollBehavior="auto"  ref={chatContainerRef}>
       {chatMessages.map((message, index) => (
       <div key={index} className={`chat-message ${message.sender}-message`}>
         <p>{message.text}</p>
       </div>
       ))}
  </ScrollToBottom>

  <div className='chat-input-area'>
    <input className="chat-input"
           type='text'
           placeholder='Enter your query'
           value={userInput}
           onChange={handleInputChange}
         />
   <button className='chat-button' onClick={handleSendMessage}>Send</button>
 </div>
    </div>
    </div>
  );
}

export default Solution;