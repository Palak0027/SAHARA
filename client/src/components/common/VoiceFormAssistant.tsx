import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Check, X, AlertCircle, Edit3, Trash2 } from "lucide-react";
import { parseVoiceInput, type ParsedDonationOrNeed } from "../../services/voiceNlpParser";

interface VoiceFormAssistantProps {
  onApply: (parsed: ParsedDonationOrNeed) => void;
  availableCategories?: { id: string; name: string }[];
  context?: "donor" | "receiver" | "register";
  language?: "en" | "hi";
}

// Extend Window interface for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export const VoiceFormAssistant: React.FC<VoiceFormAssistantProps> = ({
  onApply,
  availableCategories = [],
  context = "donor",
  language = "en",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [voiceLang, setVoiceLang] = useState<"en-IN" | "hi-IN">(
    language === "hi" ? "hi-IN" : "en-IN"
  );
  const [parsedData, setParsedData] = useState<ParsedDonationOrNeed | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isUserActiveRef = useRef<boolean>(false);
  const accumulatedFinalRef = useRef<string>("");
  const voiceLangRef = useRef<string>(voiceLang);
  const restartTimeoutRef = useRef<any>(null);

  // Check Web Speech API availability on mount
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechClass) {
      setIsSupported(false);
    }
  }, []);

  // Sync voice language when parent language changes
  useEffect(() => {
    const lang = language === "hi" ? "hi-IN" : "en-IN";
    setVoiceLang(lang);
    voiceLangRef.current = lang;
  }, [language]);

  // Clean up active speech recognition on unmount
  useEffect(() => {
    return () => {
      isUserActiveRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.abort();
        } catch (_) { }
        recognitionRef.current = null;
      }
    };
  }, []);

  const stopListening = () => {
    isUserActiveRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) { }
      recognitionRef.current = null;
    }

    const fullText = (accumulatedFinalRef.current + " " + interimText).trim();
    if (fullText) {
      const extracted = parseVoiceInput(fullText, availableCategories);
      setParsedData(extracted);
    }
  };

  const initAndStartRecognition = () => {
    setErrorMsg("");

    // Automatically clear previous/demo text so fresh spoken voice starts on a clean slate
    setTranscript("");
    setInterimText("");
    accumulatedFinalRef.current = "";
    setParsedData(null);

    // Stop existing session first to avoid InvalidStateError
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) { }
      recognitionRef.current = null;
    }

    const win = window as unknown as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechClass) {
      setIsSupported(false);
      setIsListening(false);
      return;
    }

    // Safely cleanup previous instance before instantiating a new one
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      } catch (_) {}
      recognitionRef.current = null;
    }

    try {
      const recognition = new SpeechClass();
      recognition.lang = voiceLangRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        if (isUserActiveRef.current) {
          setIsListening(true);
          setErrorMsg("");
        }
      };

      recognition.onresult = (event: any) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript + " ";
          } else {
            interimChunk += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          accumulatedFinalRef.current = (accumulatedFinalRef.current + " " + finalChunk).trim();
          setTranscript(accumulatedFinalRef.current);
        }
        setInterimText(interimChunk);

        // Immediate parsing on both final and interim text so field lights up the moment words are uttered
        const fullCurrentText = (accumulatedFinalRef.current + " " + interimChunk).trim();
        if (fullCurrentText) {
          const extracted = parseVoiceInput(fullCurrentText, availableCategories);
          setParsedData(extracted);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);

        // 'aborted' is a normal cancellation - never display an error banner
        if (event.error === "aborted") {
          return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          isUserActiveRef.current = false;
          setIsListening(false);
          setErrorMsg(
            voiceLangRef.current === "hi-IN"
              ? "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र एड्रेस बार में लॉक (🔒) आइकॉन दबाकर माइक्रोफ़ोन Allow करें।"
              : "Microphone permission denied. Click the lock (🔒) icon in your address bar and allow microphone access."
          );
        } else if (event.error === "audio-capture") {
          isUserActiveRef.current = false;
          setIsListening(false);
          setErrorMsg(
            voiceLangRef.current === "hi-IN"
              ? "कोई माइक्रोफ़ोन नहीं मिला या माइक्रोफ़ोन बंद है। कृपया माइक चेक करें।"
              : "No microphone detected or microphone is muted. Please check your mic settings."
          );
        } else if (event.error === "no-speech") {
          // Brief silence: Do not disconnect user! Keep listening active so pauses don't break flow
        } else if (event.error === "network") {
          setErrorMsg(
            voiceLangRef.current === "hi-IN"
              ? "वॉयस नेटवर्क सेवा में रुकावट। कृपया इंटरनेट चेक करें या नीचे सीधे लिखें।"
              : "Network connection issue with speech service. You can type directly or click a 1-click sample."
          );
        }
      };

      recognition.onend = () => {
        // RESILIENT AUTO-RESTART ON PAUSE:
        // Chromium stops speech recognition after brief pauses or when continuous limit hits.
        // If user is still in listening mode, spawn a fresh SpeechRecognition instance after 200ms!
        if (isUserActiveRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isUserActiveRef.current) {
              initAndStartRecognition();
            }
          }, 200);
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Failed to start speech recognition:", err);
      if (isUserActiveRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (isUserActiveRef.current) {
            initAndStartRecognition();
          }
        }, 300);
      }
    }
  };

  const startListening = async () => {
    setErrorMsg("");

    // Automatically clear previous/demo text so fresh spoken voice starts on a clean slate
    setTranscript("");
    setInterimText("");
    accumulatedFinalRef.current = "";
    setParsedData(null);

    isUserActiveRef.current = true;
    setIsListening(true);

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    const win = window as unknown as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechClass) {
      setIsSupported(false);
      setIsListening(false);
      isUserActiveRef.current = false;
      setErrorMsg(
        voiceLang === "hi-IN"
          ? "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। आप नीचे सीधे लिख सकते हैं या 1-क्लिक सैंपल इस्तेमाल कर सकते हैं।"
          : "Speech recognition is not supported in this browser. You can type directly or click any 1-click sample below."
      );
      return;
    }

    // Check secure context for production deployment
    const isSecure =
      window.isSecureContext ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isSecure) {
      setErrorMsg(
        voiceLang === "hi-IN"
          ? "ब्राउज़र वॉयस इनपुट के लिए HTTPS आवश्यक है। डिप्लॉयमेंट में https:// का उपयोग करें, या नीचे डेमो सैंपल/टाइपिंग का इस्तेमाल करें।"
          : "Browser microphone access requires HTTPS. In production use HTTPS, or test with the 1-click samples / typing below."
      );
    }

    // Explicitly prompt for mic permission under user gesture if needed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop tracks so Web Speech API has exclusive microphone access
        stream.getTracks().forEach((track) => track.stop());
      } catch (micErr: any) {
        console.warn("Microphone access error:", micErr);
        if (micErr.name === "NotAllowedError" || micErr.name === "PermissionDeniedError") {
          isUserActiveRef.current = false;
          setIsListening(false);
          setErrorMsg(
            voiceLang === "hi-IN"
              ? "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र एड्रेस बार में लॉक (🔒) आइकॉन दबाकर माइक्रोफ़ोन Allow करें।"
              : "Microphone permission denied. Click the lock (🔒) icon in your address bar and allow microphone access."
          );
          return;
        }
      }
    }

    initAndStartRecognition();
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setErrorMsg("");
    // Start listening immediately within user click gesture
    startListening();
  };

  const handleCloseModal = () => {
    stopListening();
    setShowModal(false);
    setErrorMsg("");
  };

  const handleClearTranscript = () => {
    stopListening();
    setTranscript("");
    setInterimText("");
    accumulatedFinalRef.current = "";
    setParsedData(null);
    setErrorMsg("");
  };

  const handleApply = () => {
    if (parsedData) {
      onApply(parsedData);
      handleCloseModal();
      setTranscript("");
      setInterimText("");
      accumulatedFinalRef.current = "";
      setParsedData(null);
    }
  };

  const handleTextChange = (text: string) => {
    setTranscript(text);
    accumulatedFinalRef.current = text;
    setInterimText("");
    if (text.trim()) {
      const extracted = parseVoiceInput(text, availableCategories);
      setParsedData(extracted);
    } else {
      setParsedData(null);
    }
  };

  // Demo samples for both Hindi and English
  const samplePills =
    context === "register"
      ? voiceLang === "hi-IN"
        ? [
          {
            label: "👤 राहुल वर्मा (डोनर - लखनऊ)",
            text: "मेरा नाम राहुल वर्मा है, फोन 9876543210, शहर लखनऊ, पिनकोड 226001, डोनर अकाउंट बनाना है।",
          },
          {
            label: "👤 प्रिया शर्मा (रिसीवर - मुंबई)",
            text: "मेरा नाम प्रिया शर्मा है, फोन 9123456780, शहर मुंबई, मुझे भोजन और राशन की मदद चाहिए, रिसीवर अकाउंट।",
          },
          {
            label: "🏢 समर्पण संस्था (संगठन - दिल्ली)",
            text: "समर्पण फाउंडेशन, फोन 9811223344, शहर दिल्ली, पिनकोड 110001, संगठन खाता।",
          },
        ]
        : [
          {
            label: "👤 Rahul Verma (Donor - Lucknow)",
            text: "My name is Rahul Verma, phone 9876543210, city Lucknow, pincode 226001, donor account.",
          },
          {
            label: "👤 Priya Sharma (Receiver - Mumbai)",
            text: "My name is Priya Sharma, phone 9123456780, email priya@gmail.com, city Mumbai, receiver account.",
          },
          {
            label: "🏢 Samarpan NGO (Organization - Delhi)",
            text: "Samarpan Foundation, phone 9811223344, city Delhi, pincode 110001, organization receiver account.",
          },
        ]
      : context === "receiver"
        ? voiceLang === "hi-IN"
          ? [
            {
              label: "🍲 भोजन (30 पैकेट - पटना)",
              text: "हमें 30 पैकेट ताजा भोजन की बहुत तत्काल आवश्यकता है पटना में।",
            },
            {
              label: "🧥 गर्म कपड़े (जयपुर)",
              text: "हमें 5 बच्चों के लिए गर्म कपड़े और कंबल चाहिए, बहुत जरूरी है जयपुर में।",
            },
          ]
          : [
            {
              label: "🍲 30 Food Packets (Patna)",
              text: "We urgently need 30 packets of fresh food in Patna for flood relief.",
            },
            {
              label: "🧥 Warm Clothes (Jaipur)",
              text: "We urgently need warm winter clothes for 5 people in Jaipur.",
            },
          ]
        : voiceLang === "hi-IN"
          ? [
            {
              label: "🍲 15 भोजन पैकेट (दिल्ली)",
              text: "मुझे 15 पैकेट ताजा भोजन और रोटियां दान करनी हैं, दिल्ली रोहिणी में।",
            },
            {
              label: "🧥 20 गर्म कपड़े (जयपुर)",
              text: "मैं जयपुर में 20 गर्म स्वेटर और कपड़े दान करना चाहता हूँ।",
            },
          ]
          : [
            {
              label: "🍲 15 Food Packets (Delhi)",
              text: "I want to donate 15 food packets and rice in Delhi near Rohini sector 15.",
            },
            {
              label: "🧥 20 Warm Clothes (Jaipur)",
              text: "I want to donate 20 warm winter clothes and blankets in Jaipur.",
            },
          ];

  const handleUseSample = (sampleText: string) => {
    stopListening();
    handleTextChange(sampleText);
  };

  return (
    <>
      {/* Launch Banner Button - Full width & compact */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(47, 85, 71, 0.08) 0%, rgba(8, 127, 140, 0.12) 100%)",
          border: "1.5px dashed rgba(47, 85, 71, 0.35)",
          borderRadius: "12px",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          margin: "0 0 10px 0",
          boxShadow: "0 2px 6px rgba(47, 85, 71, 0.04)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "200px", flex: "1 1 auto" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              minWidth: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(47, 85, 71, 0.25)",
              flexShrink: 0,
            }}
          >
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.86rem", color: "#1B3B30", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>AI Voice Fill • आवाज़ से भरें</span>
              <span
                style={{
                  fontSize: "0.64rem",
                  background: "#E8F5E9",
                  color: "#2E7D32",
                  padding: "1px 5px",
                  borderRadius: "5px",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                }}
              >
                NEW
              </span>
            </div>
            <p style={{ margin: "1px 0 0", fontSize: "0.74rem", color: "#526B62", lineHeight: 1.2 }}>
              {voiceLang === "hi-IN"
                ? "रुक-रुक कर बोलें या 1-क्लिक से फ़ॉर्म भरें (Hindi / English)"
                : "Speak with natural pauses or 1-click sample (Hindi / English)"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          style={{
            background: "linear-gradient(135deg, #2F5547 0%, #087F8C 100%)",
            color: "#fff",
            border: 0,
            borderRadius: "8px",
            padding: "7px 12px",
            fontWeight: 700,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            boxShadow: "0 2px 8px rgba(47, 85, 71, 0.22)",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Mic size={14} />
          <span>{voiceLang === "hi-IN" ? "बोलें 🎙️" : "Speak Now 🎙️"}</span>
        </button>
      </div>

      {/* Voice Assistant Modal - Continuous Listening & Guidance Tracker */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
            boxSizing: "border-box",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "88vh",
              overflowY: "auto",
              padding: "16px 18px",
              boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
              border: "1px solid #E2E8F0",
              animation: "fadeIn 0.2s ease-out",
              boxSizing: "border-box",
              scrollbarWidth: "thin",
            }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "0.96rem", fontWeight: 800, color: "#1B3B30" }}>
                    {voiceLang === "hi-IN" ? "SAHARA AI वॉइस असिस्टेंट" : "SAHARA AI Voice Assistant"}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.72rem", color: "#64748B" }}>
                    {voiceLang === "hi-IN"
                      ? "रुक-रुक कर स्वाभाविक बोलें, माइक चालू रहेगा"
                      : "Speak naturally with pauses, mic stays on"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Language Switcher */}
                <div style={{ display: "flex", gap: "2px", background: "#F1F5F9", padding: "2px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLang("hi-IN");
                      voiceLangRef.current = "hi-IN";
                      if (isListening || isUserActiveRef.current) {
                        initAndStartRecognition();
                      }
                    }}
                    style={{
                      border: 0,
                      padding: "3px 7px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: voiceLang === "hi-IN" ? "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)" : "transparent",
                      color: voiceLang === "hi-IN" ? "#fff" : "#475569",
                      transition: "all 0.15s ease",
                    }}
                  >
                    हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceLang("en-IN");
                      voiceLangRef.current = "en-IN";
                      if (isListening || isUserActiveRef.current) {
                        initAndStartRecognition();
                      }
                    }}
                    style={{
                      border: 0,
                      padding: "3px 7px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      background: voiceLang === "en-IN" ? "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)" : "transparent",
                      color: voiceLang === "en-IN" ? "#fff" : "#475569",
                      transition: "all 0.15s ease",
                    }}
                  >
                    English
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: "transparent",
                    border: 0,
                    padding: "3px",
                    cursor: "pointer",
                    color: "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Compact Glowing Mic Section with Status */}
            <div style={{ textAlign: "center", margin: "6px 0 8px" }}>
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "50%",
                  border: 0,
                  cursor: "pointer",
                  background: isListening
                    ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #2F5547 0%, #065A6B 100%)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isListening
                    ? "0 0 0 8px rgba(239, 68, 68, 0.2), 0 6px 16px rgba(239, 68, 68, 0.3)"
                    : "0 0 0 6px rgba(47, 85, 71, 0.12), 0 4px 14px rgba(47, 85, 71, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                {isListening ? (
                  <Mic size={24} style={{ animation: "pulse 1.5s infinite" }} />
                ) : (
                  <MicOff size={22} />
                )}
              </button>
              <div
                style={{
                  marginTop: "5px",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: isListening ? "#DC2626" : "#475569",
                }}
              >
                {isListening
                  ? voiceLang === "hi-IN"
                    ? "🔴 सुन रहे हैं... आप रुक-रुक कर भी बोल सकते हैं"
                    : "🔴 Listening... You can pause naturally between words"
                  : voiceLang === "hi-IN"
                    ? "बोलने के लिए माइक दबाएं"
                    : "Tap mic to start speaking"}
              </div>
              <div
                style={{
                  marginTop: "2px",
                  fontSize: "0.71rem",
                  color: "#64748B",
                  fontWeight: 500,
                }}
              >
                {voiceLang === "hi-IN" ? (
                  <span>
                    🇮🇳 <strong>हिन्दी मोड:</strong> आप हिन्दी में बोलें (अंग्रेज़ी के लिए ऊपर <strong>English</strong> चुनें)
                  </span>
                ) : (
                  <span>
                    🌐 <strong>English Mode:</strong> Speak in English (हिन्दी में बोलने के लिए ऊपर <strong>हिन्दी</strong> चुनें)
                  </span>
                )}
              </div>
            </div>

            {/* Real-time Context-Specific Field Detection Checklist */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
                justifyContent: "center",
                margin: "0 0 8px",
                padding: "6px 8px",
                background: "#F8FAFC",
                borderRadius: "10px",
                border: "1px solid #E2E8F0",
              }}
            >
              {context === "donor" ? (
                <>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.categoryName ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.categoryName ? "#166534" : "#64748B",
                      border: parsedData?.categoryName ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📦 {parsedData?.categoryName ? `श्रेणी: ${parsedData.categoryName} ✓` : (voiceLang === "hi-IN" ? "सामग्री / Category बोलें" : "Say Category (e.g. Food, Clothes)")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.quantity ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.quantity ? "#166534" : "#64748B",
                      border: parsedData?.quantity ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    🔢 {parsedData?.quantity ? `मात्रा: ${parsedData.quantity} ${parsedData.quantityUnit || "items"} ✓` : (voiceLang === "hi-IN" ? "मात्रा बोलें (जैसे 15 पैकेट)" : "Say Quantity (e.g. 15 packets)")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.city ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.city ? "#166534" : "#64748B",
                      border: parsedData?.city ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📍 {parsedData?.city ? `शहर: ${parsedData.city} ✓` : (voiceLang === "hi-IN" ? "शहर बोलें (जैसे Delhi)" : "Say City")}
                  </span>
                </>
              ) : context === "receiver" ? (
                <>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.categoryName ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.categoryName ? "#166534" : "#64748B",
                      border: parsedData?.categoryName ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📦 {parsedData?.categoryName ? `ज़रूरत: ${parsedData.categoryName} ✓` : (voiceLang === "hi-IN" ? "ज़रूरत की श्रेणी बोलें" : "Say Needed Category")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.quantity ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.quantity ? "#166534" : "#64748B",
                      border: parsedData?.quantity ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    🔢 {parsedData?.quantity ? `मात्रा: ${parsedData.quantity} ${parsedData.quantityUnit || "items"} ✓` : (voiceLang === "hi-IN" ? "मात्रा बोलें" : "Say Quantity")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.city ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.city ? "#166534" : "#64748B",
                      border: parsedData?.city ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📍 {parsedData?.city ? `शहर: ${parsedData.city} ✓` : (voiceLang === "hi-IN" ? "शहर बोलें" : "Say City")}
                  </span>
                  {parsedData?.urgency === "high" && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 7px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        background: "#FEE2E2",
                        color: "#B91C1C",
                        border: "1px solid #FCA5A5",
                      }}
                    >
                      ⚡ तत्काल / Urgent ✓
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.name ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.name ? "#166534" : "#64748B",
                      border: parsedData?.name ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    👤 {parsedData?.name ? `नाम: ${parsedData.name} ✓` : (voiceLang === "hi-IN" ? "नाम बोलें" : "Say Name")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.phone ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.phone ? "#166534" : "#64748B",
                      border: parsedData?.phone ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📱 {parsedData?.phone ? `फोन: ${parsedData.phone} ✓` : (voiceLang === "hi-IN" ? "10 अंकों का फोन बोलें" : "Say 10-digit Phone")}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "2px 7px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      background: parsedData?.city ? "#DCFCE7" : "#FFFFFF",
                      color: parsedData?.city ? "#166534" : "#64748B",
                      border: parsedData?.city ? "1px solid #86EFAC" : "1px dashed #CBD5E1",
                    }}
                  >
                    📍 {parsedData?.city ? `शहर: ${parsedData.city} ✓` : (voiceLang === "hi-IN" ? "शहर बोलें" : "Say City")}
                  </span>
                  {parsedData?.email && (
                    <span
                      style={{
                        fontSize: "0.72rem",
                        padding: "2px 7px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        background: "#DCFCE7",
                        color: "#166534",
                        border: "1px solid #86EFAC",
                      }}
                    >
                      ✉️ {parsedData.email} ✓
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Live Editable Transcript Box with Clear Action */}
            <div style={{ margin: "0 0 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  {voiceLang === "hi-IN" ? "बोली गई बातें (लाइव टेक्स्ट):" : "Spoken words (live text):"}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  {(transcript || interimText) && (
                    <button
                      type="button"
                      onClick={handleClearTranscript}
                      style={{
                        background: "transparent",
                        border: 0,
                        color: "#DC2626",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        padding: "0 2px",
                      }}
                    >
                      <Trash2 size={11} />
                      <span>{voiceLang === "hi-IN" ? "साफ़ करें" : "Clear"}</span>
                    </button>
                  )}
                  <span style={{ fontSize: "0.68rem", color: "#94A3B8" }}>
                    <Edit3 size={10} style={{ verticalAlign: "middle", marginRight: "2px" }} />
                    {voiceLang === "hi-IN" ? "एडिटेबल" : "Editable"}
                  </span>
                </div>
              </div>
              <textarea
                value={transcript + (interimText ? " " + interimText : "")}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={
                  context === "donor"
                    ? voiceLang === "hi-IN"
                      ? "जैसे: 'मुझे 15 पैकेट ताजा भोजन डोनेट करना है दिल्ली में' (रुक-रुक कर भी बोल सकते हैं)"
                      : "e.g., 'I want to donate 15 food packets in Delhi' (you can speak with pauses)"
                    : context === "receiver"
                      ? voiceLang === "hi-IN"
                        ? "जैसे: 'हमें 5 गर्म कपड़े और कंबल चाहिए जयपुर में' (रुक-रुक कर भी बोल सकते हैं)"
                        : "e.g., 'We urgently need 5 blankets in Jaipur' (you can speak with pauses)"
                      : voiceLang === "hi-IN"
                        ? "जैसे: 'प्रिया शर्मा, 9484758113, लखनऊ' (रुक-रुक कर भी बोल सकते हैं)"
                        : "e.g., 'Priya Sharma, 9484758113, Lucknow' (you can speak with pauses)"
                }
                rows={2}
                style={{
                  width: "100%",
                  background: "#F8FAFC",
                  borderRadius: "10px",
                  border: "1.5px solid #E2E8F0",
                  padding: "8px 10px",
                  fontSize: "0.82rem",
                  color: "#1E293B",
                  lineHeight: 1.35,
                  resize: "none",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#087F8C")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>

            {/* Error Message with Resiliency Tips */}
            {errorMsg && (
              <div
                style={{
                  margin: "0 0 8px",
                  padding: "6px 10px",
                  background: "#FEF2F2",
                  color: "#B91C1C",
                  borderRadius: "8px",
                  fontSize: "0.74rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "5px",
                  lineHeight: 1.3,
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1-Click Demo Sample Pills (Context + Language aware) */}
            <div style={{ margin: "0 0 10px" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>
                💡 {voiceLang === "hi-IN" ? "1-क्लिक टेस्ट सैंपल:" : "1-Click Demo Samples:"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {samplePills.map((pill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleUseSample(pill.text)}
                    style={{
                      background: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      color: "#334155",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#E2E8F0";
                      e.currentTarget.style.borderColor = "#CBD5E1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F1F5F9";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                    }}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={handleCloseModal}
                style={{
                  background: "transparent",
                  border: "1px solid #CBD5E1",
                  color: "#64748B",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {voiceLang === "hi-IN" ? "रद्द करें" : "Cancel"}
              </button>

              <button
                type="button"
                onClick={handleApply}
                disabled={!parsedData}
                style={{
                  background: parsedData ? "linear-gradient(135deg, #2F5547 0%, #087F8C 100%)" : "#CBD5E1",
                  color: "#fff",
                  border: 0,
                  padding: "6px 16px",
                  borderRadius: "8px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: parsedData ? "pointer" : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  boxShadow: parsedData ? "0 2px 8px rgba(47, 85, 71, 0.25)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Check size={14} />
                <span>{voiceLang === "hi-IN" ? "फ़ॉर्म में भरें" : "Apply to Form"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
