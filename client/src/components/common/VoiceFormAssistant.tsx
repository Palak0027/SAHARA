import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Sparkles, Check, RefreshCw, Volume2, Globe } from "lucide-react";
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

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechClass) {
      setIsSupported(false);
    }
  }, []);

  // Update voice language if parent language changes
  useEffect(() => {
    setVoiceLang(language === "hi" ? "hi-IN" : "en-IN");
  }, [language]);

  const startListening = () => {
    setErrorMsg("");
    setTranscript("");
    setInterimText("");
    setParsedData(null);

    const win = window as unknown as IWindow;
    const SpeechClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechClass) {
      setErrorMsg("Speech recognition is not supported in this browser. You can type or use the sample demo.");
      return;
    }

    try {
      const recognition = new SpeechClass();
      recognition.lang = voiceLang;
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript + " ";
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        if (finalStr) {
          setTranscript((prev) => {
            const updated = (prev + " " + finalStr).trim();
            const extracted = parseVoiceInput(updated, availableCategories);
            setParsedData(extracted);
            return updated;
          });
        }
        setInterimText(interimStr);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setErrorMsg("Microphone permission was denied. Please allow microphone access in your browser settings.");
        } else if (event.error !== "no-speech") {
          setErrorMsg(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Failed to start speech recognition:", err);
      setErrorMsg(err.message || "Failed to start microphone.");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    const fullText = (transcript + " " + interimText).trim();
    if (fullText) {
      const extracted = parseVoiceInput(fullText, availableCategories);
      setParsedData(extracted);
    }
  };

  const handleApply = () => {
    if (parsedData) {
      onApply(parsedData);
      setShowModal(false);
      setTranscript("");
      setInterimText("");
      setParsedData(null);
    }
  };

  // Sample prompt for Hackathon demo testing without mic
  const handleUseDemoSample = () => {
    let sample = "";
    if (context === "donor") {
      sample = voiceLang === "hi-IN"
        ? "मुझे 10 पैकेट ताजा भोजन और रोटियां दान करनी हैं, दिल्ली रोहिणी में।"
        : "I want to donate 10 food packets and rice in Delhi near Rohini sector 15.";
    } else if (context === "receiver") {
      sample = voiceLang === "hi-IN"
        ? "हमें 5 बच्चों के लिए गर्म कपड़े और कंबल चाहिए, बहुत जरूरी है जयपुर में।"
        : "We urgently need warm winter clothes for 5 people in Jaipur.";
    } else {
      sample = voiceLang === "hi-IN"
        ? "मेरा नाम राहुल वर्मा है, फोन 9876543210, शहर लखनऊ, डोनर अकाउंट बनाना है।"
        : "My name is Rahul Verma, phone 9876543210, city Lucknow, donor account.";
    }

    setTranscript(sample);
    const extracted = parseVoiceInput(sample, availableCategories);
    setParsedData(extracted);
  };

  const promptExample =
    context === "donor"
      ? voiceLang === "hi-IN"
        ? 'जैसे: "मुझे 10 पैकेट खाना डोनेट करना है दिल्ली में"'
        : 'e.g., "I want to donate 10 packets of food in Delhi"'
      : context === "receiver"
      ? voiceLang === "hi-IN"
        ? 'जैसे: "हमें 5 गर्म कपड़े चाहिए जयपुर में बहुत जरूरी"'
        : 'e.g., "We urgently need warm clothes for 5 people in Jaipur"'
      : voiceLang === "hi-IN"
      ? 'जैसे: "मेरा नाम राहुल है, फोन 9876543210, शहर दिल्ली"'
      : 'e.g., "My name is Rahul, phone 9876543210, city Delhi"';

  return (
    <>
      {/* Launch Banner Button (Displayed at top of Form) */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(47, 85, 71, 0.08) 0%, rgba(6, 90, 107, 0.12) 100%)",
          border: "1.5px dashed rgba(47, 85, 71, 0.35)",
          borderRadius: "16px",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          margin: "0 0 20px 0",
          boxShadow: "0 2px 10px rgba(47, 85, 71, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "#2F5547",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(47, 85, 71, 0.25)",
            }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1B3B30", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>AI Voice Fill</span>
              <span style={{ fontSize: "0.7rem", background: "#E8F5E9", color: "#2E7D32", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                NEW
              </span>
            </div>
            <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#526B62" }}>
              {language === "hi" ? "बोलकर फ़ॉर्म भरें (हिंदी / English)" : "Speak to autofill this entire form automatically"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowModal(true);
            setTimeout(() => startListening(), 250);
          }}
          style={{
            background: "#2F5547",
            color: "#fff",
            border: 0,
            borderRadius: "12px",
            padding: "8px 16px",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 12px rgba(47, 85, 71, 0.2)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Mic size={16} />
          <span>{language === "hi" ? "बोलें 🎙️" : "Speak Now 🎙️"}</span>
        </button>
      </div>

      {/* Voice Assistant Modal */}
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
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "24px",
              maxWidth: "520px",
              width: "100%",
              padding: "26px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #E2E8F0",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "1.3rem" }}>✨</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#1B3B30" }}>
                    {language === "hi" ? "SAHARA AI वॉइस असिस्टेंट" : "SAHARA AI Voice Assistant"}
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#64748B" }}>
                    {promptExample}
                  </p>
                </div>
              </div>

              {/* Language Switcher */}
              <div style={{ display: "flex", gap: "4px", background: "#F1F5F9", padding: "3px", borderRadius: "10px" }}>
                <button
                  type="button"
                  onClick={() => setVoiceLang("hi-IN")}
                  style={{
                    border: 0,
                    padding: "4px 8px",
                    borderRadius: "7px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: voiceLang === "hi-IN" ? "#2F5547" : "transparent",
                    color: voiceLang === "hi-IN" ? "#fff" : "#64748B",
                  }}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setVoiceLang("en-IN")}
                  style={{
                    border: 0,
                    padding: "4px 8px",
                    borderRadius: "7px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: voiceLang === "en-IN" ? "#2F5547" : "transparent",
                    color: voiceLang === "en-IN" ? "#fff" : "#64748B",
                  }}
                >
                  English
                </button>
              </div>
            </div>

            {/* Glowing Microphone Indicator */}
            <div style={{ textAlign: "center", margin: "22px 0" }}>
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: 0,
                  cursor: "pointer",
                  background: isListening
                    ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                    : "linear-gradient(135deg, #2F5547 0%, #1B3B30 100%)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isListening
                    ? "0 0 0 12px rgba(239, 68, 68, 0.2), 0 8px 24px rgba(239, 68, 68, 0.35)"
                    : "0 0 0 8px rgba(47, 85, 71, 0.15), 0 8px 20px rgba(47, 85, 71, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                {isListening ? <Mic size={34} style={{ animation: "pulse 1.5s infinite" }} /> : <MicOff size={30} />}
              </button>
              <div style={{ marginTop: "12px", fontSize: "0.88rem", fontWeight: 700, color: isListening ? "#DC2626" : "#475569" }}>
                {isListening ? (language === "hi" ? "सुन रहे हैं... बोलिए!" : "Listening... Speak now!") : (language === "hi" ? "माइक पर क्लिक करें" : "Tap mic to speak")}
              </div>
            </div>

            {/* Live Transcript Box */}
            <div
              style={{
                background: "#F8FAFC",
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                padding: "12px 14px",
                minHeight: "75px",
                maxHeight: "120px",
                overflowY: "auto",
                fontSize: "0.9rem",
                color: "#1E293B",
                lineHeight: 1.5,
              }}
            >
              {transcript || interimText ? (
                <>
                  <span>{transcript}</span>
                  <span style={{ color: "#94A3B8" }}> {interimText}</span>
                </>
              ) : (
                <span style={{ color: "#94A3B8", fontStyle: "italic" }}>
                  {language === "hi" ? "आपकी आवाज़ यहाँ दिखाई देगी..." : "Your spoken words will appear here in real-time..."}
                </span>
              )}
            </div>

            {errorMsg && (
              <div style={{ margin: "10px 0 0", padding: "8px 12px", background: "#FEF2F2", color: "#B91C1C", borderRadius: "10px", fontSize: "0.8rem" }}>
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Extracted Fields Preview */}
            {parsedData && (
              <div
                style={{
                  marginTop: "14px",
                  padding: "12px 14px",
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: "14px",
                }}
              >
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" }}>
                  {language === "hi" ? "AI द्वारा पहचानी गई जानकारी:" : "AI Extracted Fields:"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {parsedData.categoryName && (
                    <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      📦 {parsedData.categoryName}
                    </span>
                  )}
                  {parsedData.quantity ? (
                    <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      🔢 {parsedData.quantity} {parsedData.quantityUnit || "items"}
                    </span>
                  ) : null}
                  {parsedData.city && (
                    <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      📍 {parsedData.city}
                    </span>
                  )}
                  {parsedData.urgency && parsedData.urgency === "high" && (
                    <span style={{ background: "#FEE2E2", color: "#B91C1C", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      ⚡ Urgent
                    </span>
                  )}
                  {parsedData.name && (
                    <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      👤 {parsedData.name}
                    </span>
                  )}
                  {parsedData.phone && (
                    <span style={{ background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}>
                      📱 {parsedData.phone}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "18px", gap: "10px" }}>
              <button
                type="button"
                onClick={handleUseDemoSample}
                style={{
                  background: "#F1F5F9",
                  border: 0,
                  color: "#475569",
                  padding: "9px 14px",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                💡 {language === "hi" ? "डेमो सैंपल डालें" : "Try Demo Sample"}
              </button>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    stopListening();
                    setShowModal(false);
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid #CBD5E1",
                    color: "#64748B",
                    padding: "9px 16px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={!parsedData}
                  style={{
                    background: parsedData ? "#2F5547" : "#CBD5E1",
                    color: "#fff",
                    border: 0,
                    padding: "9px 18px",
                    borderRadius: "10px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: parsedData ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: parsedData ? "0 4px 12px rgba(47, 85, 71, 0.25)" : "none",
                  }}
                >
                  <Check size={16} />
                  <span>{language === "hi" ? "फ़ॉर्म में भरें" : "Apply to Form"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
