import { useEffect, useRef, useState } from 'react';
import { HOUNDIFY_CONFIG } from '../config';

const VoiceInput = ({ onAddToCart, onPlaceOrder }) => {
  const houndifyRef = useRef(null);
  const [apiLogs, setApiLogs] = useState([]);

  useEffect(() => {
    const loadHoundify = () => {
      if (!window.Houndify) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/houndify@3.1.1/dist/houndify.js';
        script.async = true;
        script.onload = initHoundify;
        document.body.appendChild(script);
      } else {
        initHoundify();
      }
    };

    const initHoundify = () => {
      houndifyRef.current = new window.Houndify.VoiceRequest({
        clientId: HOUNDIFY_CONFIG.clientId,
        clientKey: HOUNDIFY_CONFIG.clientKey,
        onResponse: (response) => {
          const responseLog = {
            type: 'RESPONSE',
            timestamp: new Date().toISOString(),
            data: {
              transcript: response.transcript,
              spokenResponse: response.spokenResponse,
              commandKind: response.CommandKind,
              intentType: response.IntentType,
              conversationState: response.ConversationState
            }
          };
          console.log('Houndify Response:', JSON.stringify(responseLog, null, 2));
          setApiLogs(logs => [...logs, responseLog]);

          // Make the response speak
          speakResponse(response.spokenResponse);

          handleVoiceCommand(response.transcript);
        },
        onError: (err) => {
          const errorLog = {
            type: 'ERROR',
            timestamp: new Date().toISOString(),
            error: err.message || err
          };
          console.error('Houndify Error:', JSON.stringify(errorLog, null, 2));
          setApiLogs(logs => [...logs, errorLog]);
          alert('Sorry, there was an error processing your voice command.');
        },
        onTranscriptionUpdate: (transcript) => {
          const transcriptLog = {
            type: 'TRANSCRIPT_UPDATE',
            timestamp: new Date().toISOString(),
            data: { transcript }
          };
          console.log('Transcript Update:', JSON.stringify(transcriptLog, null, 2));
          setApiLogs(logs => [...logs, transcriptLog]);
        },
        // Request Info sent to Houndify
        requestInfo: {
          UserID: "KFC-DriveThrough-User",
          Latitude: 0,
          Longitude: 0,
          TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          DeviceID: "Web-Browser-" + navigator.userAgent,
          RequestID: Date.now().toString(),
          InputLanguageIETFTag: "en-US",
          InputLanguageEnglishName: "English",
          PartialTranscriptsDesired: true,
          AudioSource: "Browser",
          Context: {
            menuItems: [
              '21 piece bucket',
              '15 piece bucket',
              '9 piece bucket',
              'sweet chilli crunch master',
              'spicy crunch master',
              'wicked zinger buddy'
            ]
          }
        }
      });

      // Log the initial configuration
      console.log('Houndify Configuration:', JSON.stringify({
        type: 'CONFIG',
        timestamp: new Date().toISOString(),
        config: {
          clientId: HOUNDIFY_CONFIG.clientId,
          requestInfo: houndifyRef.current.requestInfo
        }
      }, null, 2));
    };

    loadHoundify();

    return () => {
      if (houndifyRef.current) {
        houndifyRef.current.abort();
      }
    };
  }, []);

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language to US English
    utterance.pitch = 1; // Optional: Adjust pitch
    utterance.rate = 1;  // Optional: Adjust speed

    synth.speak(utterance); // Speak the response
  };

  const handleVoiceCommand = (transcript) => {
    const command = transcript.toLowerCase();
    
    if (command.includes('place order')) {
      onPlaceOrder();
      return;
    }

    const menuItems = [
      '21 piece bucket',
      '15 piece bucket',
      '9 piece bucket',
      'sweet chilli crunch master',
      'spicy crunch master',
      'wicked zinger buddy'
    ];

    menuItems.forEach((item, index) => {
      if (command.includes(item.toLowerCase())) {
        onAddToCart(index + 1);
      }
    });
  };

  const startListening = () => {
    if (houndifyRef.current) {
      const startLog = {
        type: 'START_LISTENING',
        timestamp: new Date().toISOString()
      };
      console.log('Starting Voice Recognition:', JSON.stringify(startLog, null, 2));
      setApiLogs(logs => [...logs, startLog]);
      houndifyRef.current.start();
    }
  };

  const stopListening = () => {
    if (houndifyRef.current) {
      const stopLog = {
        type: 'STOP_LISTENING',
        timestamp: new Date().toISOString()
      };
      console.log('Stopping Voice Recognition:', JSON.stringify(stopLog, null, 2));
      setApiLogs(logs => [...logs, stopLog]);
      houndifyRef.current.stop();
    }
  };

  return (
    <button 
      onClick={startListening}
      onMouseUp={stopListening}
      className="floating-mic"
      title="Press and hold to speak"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
        />
      </svg>
    </button>
  );
};

export default VoiceInput;
