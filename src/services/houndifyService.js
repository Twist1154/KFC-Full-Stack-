import { HOUNDIFY_CONFIG } from "../config";

export class HoundifyService {
  constructor() {
    this.voiceRequest = null;
    this.audioContext = null;
    this.processor = null;
    this.mediaStreamSource = null;
  }

  generateUserId() {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `user_${timestamp}_${randomPart}`;
  }

  async initialize() {
    if (!window.Houndify) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/houndify.js";
        script.async = true;
        script.onload = () => resolve(null);
        script.onerror = () => reject(new Error("Failed to load Houndify script"));
        document.body.appendChild(script);
      });

      await new Promise((resolve, reject) => {
        let attempts = 0;
        const checkHoundify = setInterval(() => {
          if (window.Houndify) {
            clearInterval(checkHoundify);
            resolve(null);
          } else if (attempts++ > 500) {
            clearInterval(checkHoundify);
            reject(new Error("Failed to initialize Houndify"));
          }
        }, 100);
      });
    }
  }

  async startVoiceSearch(onFinalResponse, onError) {
    try {
      await this.initialize();

      if (!window.Houndify) throw new Error("Houndify not initialized");

      if (this.voiceRequest && this.voiceRequest.state !== "aborted") {
        this.voiceRequest.abort();
      }

      console.log("🎙️ Starting Houndify Voice Request...");

      const userId = this.generateUserId();

      this.voiceRequest = new window.Houndify.VoiceRequest({
        clientId: HOUNDIFY_CONFIG.clientId,
        clientKey: HOUNDIFY_CONFIG.clientKey,
        sampleRate: 44100,
        enableVAD: false,
        requestInfo: {
          UserID: userId,
          Latitude: 37.388309,
          Longitude: -121.973968,
          PartialTranscriptsDesired: true, // ✅ Enables real-time transcription
          ObjectByteCountPrefix: true, // (Optional) Improves performance
        },

        onTranscriptionUpdate: (transcript) => {
          if (transcript && transcript.PartialTranscript) {
            console.log("📝 Partial Transcript:", transcript.PartialTranscript);
        
            // Optionally, update UI with real-time transcription
            if (this.onPartialTranscription) {
              this.onPartialTranscription(transcript.PartialTranscript);
            }
        
            // 🛑 Reset client-side VAD timeout on each transcription update
            clearTimeout(this.vadTimeout);
            this.vadTimeout = setTimeout(() => {
              console.log("⏳ No speech detected for 5s, stopping...");
              this.stop();
            }, 5000); // Stops if no speech is detected for 5 seconds
        
            // 🛑 Check SafeToStopAudio flag from the server
            if (transcript.SafeToStopAudio) {
              console.log("🔇 Server suggests stopping audio...");
              this.stop();
            }
          } else {
            console.warn("⚠️ No transcription detected. Possible audio issue.");
          }
        },
        

        onResponse: (response) => {
          console.log("✅ Final Voice Response:", response);

          if (this.voiceRequest) {
            const fullTranscript = this.voiceRequest.getTranscript();
            console.log("📜 Full Transcript:", fullTranscript || "No transcript available");

            if (!fullTranscript || fullTranscript.trim() === "") {
              console.warn("🚫 No transcript returned in the response.");
            }
          }

          if (response.Format === "SoundHoundVoiceSearchResult") {
            const spokenText =
              response.AllResults?.[0]?.SpokenResponse || "No response available";
            console.log("🔊 Recognized Speech:", spokenText);

            if (spokenText) this.speakText(spokenText);
          } else {
            console.log("⌛ Waiting for final response...");
          }

          if (onFinalResponse) onFinalResponse(response);
        },

        onError: (error) => {
          console.error("❌ Voice Error:", error);
          if (onError) onError(error);
        },
      });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.mediaStreamSource.connect(this.processor);
      this.processor.connect(this.audioContext.destination);

      this.processor.onaudioprocess = (event) => {
        if (this.voiceRequest) {
          const audioData = event.inputBuffer.getChannelData(0);
          const int16Array = new Int16Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            const s = Math.max(-1, Math.min(1, audioData[i]));
            int16Array[i] = s < 0 ? s * 32768 : s * 32767;
          }

        /*   console.log("🎧 Captured audio data:", int16Array);
          this.voiceRequest.write(int16Array); */
        }
      };

      stream.getTracks().forEach((track) => {
        track.onended = () => {
          console.log("🎤 Audio stream ended.");
          this.stop();
        };
      });

      setTimeout(() => {
        console.log("⏳ Auto-stopping after 10 seconds...");
        this.stop();
      }, 10000);
    } catch (error) {
      console.error("❌ Failed to start voice search:", error);
      if (onError) onError(error);
    }
  }

  speakText(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    synth.speak(utterance);
  }

  async stop() {
    if (this.voiceRequest) {
      this.voiceRequest.end();
      this.voiceRequest = null;
    }

    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }

    if (this.mediaStreamSource) {
      this.mediaStreamSource.disconnect();
      this.mediaStreamSource = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }

    console.log("🛑 Stopped Voice Search");
  }
}
