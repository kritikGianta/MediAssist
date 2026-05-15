import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, LocateFixed, MapPinned, Mic, SendHorizonal, Volume2 } from "lucide-react";
import Sidebar from "./components/Sidebar";
import ExperimentPanel from "./components/ExperimentPanel";
import UploadCard from "./components/UploadCard";
import LandingPage from "./components/LandingPage";
import { useVoice } from "./hooks/useVoice";
import {
  fetchHistory,
  fetchSettings,
  lookupNearby,
  saveSettings,
  sendChat,
  uploadReport
} from "./utils/api";

const DISCLAIMER =
  "This chatbot is not a licensed medical professional. Consult a doctor for emergencies or accurate diagnosis.";

const initialSettings = {
  model_name: "llama-3.1-8b-instant",
  temperature: 0.2,
  max_tokens: 256,
  top_k: 4,
  chunk_size: 500,
  chunk_overlap: 80,
  embedding_model: "sentence-transformers/all-MiniLM-L6-v2"
};

export default function App() {
  const [activeView, setActiveView] = useState("landing");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Describe symptoms, upload a PDF report, or ask for nearby hospitals. I'll give general guidance, likely conditions, precautions, and safe OTC suggestions when appropriate.\n\n" +
        DISCLAIMER
    }
  ]);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [reportSummary, setReportSummary] = useState("");
  const [reportLoading, setReportLoading] = useState(false);
  const [nearby, setNearby] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [toast, setToast] = useState("");
  const { isListening, isSpeaking, startListening, speak } = useVoice();

  useEffect(() => {
    fetchHistory().then(setHistory).catch(() => undefined);
    fetchSettings().then(setSettings).catch(() => undefined);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeView]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((item) => item.role === "assistant"),
    [messages]
  );

  const handleSend = async (customMessage) => {
    const text = (customMessage ?? input).trim();
    if (!text || loading) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await sendChat({
        message: text,
        history: nextMessages.slice(-8).map(({ role, content }) => ({ role, content })),
        settings
      });
      setMessages((current) => [...current, { role: "assistant", content: response.answer, meta: response }]);
      const refreshedHistory = await fetchHistory();
      setHistory(refreshedHistory);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I hit a backend issue while generating a response. Check that the FastAPI server is running and GROQ_API_KEY is set in backend/.env.\n\n" +
            DISCLAIMER
        }
      ]);
      setToast(error.message || "Chat failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      const transcript = await startListening();
      setInput(transcript);
    } catch (error) {
      setToast(error.message);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await saveSettings(settings);
      setToast("Settings saved");
    } catch (error) {
      setToast(error.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }
    setReportLoading(true);
    try {
      const response = await uploadReport(file);
      setReportSummary(response.summary);
      setToast("Report summarized");
    } catch (error) {
      setToast(error.message || "Upload failed");
    } finally {
      setReportLoading(false);
    }
  };

  const handleNearby = async () => {
    if (!navigator.geolocation) {
      setToast("Geolocation is not supported in this browser.");
      return;
    }
    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await lookupNearby({
            latitude: coords.latitude,
            longitude: coords.longitude,
            radius_km: 5
          });
          setNearby(response.results || []);
        } catch (error) {
          setToast(error.message || "Nearby lookup failed");
        } finally {
          setNearbyLoading(false);
        }
      },
      () => {
        setNearbyLoading(false);
        setToast("Location permission was denied.");
      }
    );
  };

  const openChatWorkspace = (prefillMessage = "") => {
    if (prefillMessage) {
      setInput(prefillMessage);
    }
    setActiveView("workspace");
  };

  const renderLandingView = () => (
    <LandingPage
      onPrimaryClick={() => openChatWorkspace("I have fever, headache, and sore throat")}
      onSecondaryClick={() => openChatWorkspace()}
    />
  );

  const renderWorkspaceView = () => (
    <>
      <section className="glass rounded-[30px] p-4 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-['Space_Grotesk'] text-xs uppercase tracking-[0.28em] text-mist">Chat workspace</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Healthcare assistant and nearby care finder</h2>
            <p className="mt-2 text-sm text-mist">
              Ask symptom questions, upload reports, and find nearby hospitals or pharmacies from this workspace.
            </p>
          </div>
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#18364014] bg-white px-4 py-3 font-medium text-ink shadow-card transition hover:border-aqua/30"
          >
            <ArrowLeft size={16} />
            Back to home
          </button>
        </div>
      </section>

      <section id="workspace" className="grid gap-5 xl:grid-cols-[1.55fr_0.95fr]">
        <div className="glass flex min-h-[700px] flex-col rounded-[34px] p-4">
          <div className="panel-scroll flex-1 space-y-4 overflow-y-auto px-2 pb-6 pt-2">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={`${message.role}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-[28px] px-5 py-4 shadow-lg ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-aqua to-glow text-white"
                        : "border border-[#18364014] bg-white text-ink shadow-card"
                    }`}
                  >
                    <div className="whitespace-pre-line text-[15px] leading-7">{message.content}</div>
                    {message.meta?.emergency ? (
                      <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <div className="flex items-center gap-2 font-medium">
                          <AlertTriangle size={16} />
                          Emergency warning
                        </div>
                        Seek immediate medical attention.
                      </div>
                    ) : null}
                    {message.meta?.citations?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.meta.citations.map((citation, citeIndex) => (
                          <span
                            key={`${citation.title}-${citeIndex}`}
                            className="rounded-full border border-[#18364014] bg-[#f6f8f8] px-3 py-1 text-xs text-mist"
                            title={citation.preview}
                          >
                            {citation.title}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-[#18364014] bg-white px-4 py-3 text-sm text-mist shadow-card"
              >
                <span className="h-2 w-2 animate-pulse rounded-full bg-aqua" />
                Reviewing symptom notes and related health context...
              </motion.div>
            ) : null}
          </div>

          <div className="mt-auto rounded-[30px] border border-[#18364014] bg-[#fbfaf7] p-3">
            <div className="mb-3 flex flex-wrap items-center gap-2 px-2 text-xs text-mist/70">
              <span className="rounded-full border border-[#18364014] bg-white px-3 py-1">Symptom guidance</span>
              <span className="rounded-full border border-[#18364014] bg-white px-3 py-1">Report summaries</span>
              <span className="rounded-full border border-[#18364014] bg-white px-3 py-1">Emergency warnings</span>
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={handleVoiceInput}
                className={`rounded-2xl border px-4 py-3 transition ${
                  isListening
                    ? "border-aqua bg-aqua/20 text-aqua"
                    : "border-[#18364014] bg-white text-ink hover:border-aqua/40"
                }`}
              >
                <Mic size={18} />
              </button>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Describe your symptoms or ask a healthcare question..."
                className="min-h-[58px] flex-1 resize-none rounded-[24px] border border-[#18364014] bg-white px-5 py-4 text-ink outline-none placeholder:text-mist"
              />
              <button
                onClick={() => latestAssistantMessage && speak(latestAssistantMessage.content)}
                className="rounded-2xl border border-[#18364014] bg-white px-4 py-3 text-ink transition hover:border-aqua/40"
              >
                <Volume2 size={18} />
              </button>
              <button
                onClick={() => handleSend()}
                className="rounded-2xl bg-gradient-to-r from-aqua to-glow px-5 py-4 font-medium text-white transition hover:opacity-95"
              >
                <SendHorizonal size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <ExperimentPanel
            settings={settings}
            onChange={(field, value) => setSettings((current) => ({ ...current, [field]: value }))}
            onSave={handleSaveSettings}
            saving={savingSettings}
          />

          <UploadCard onFile={handleUpload} loading={reportLoading} summary={reportSummary} />

          <div className="glass rounded-[28px] p-5">
            <div className="mb-4 flex items-center gap-3">
              <MapPinned className="text-blush" />
              <div>
                <h3 className="text-lg font-semibold text-ink">Nearby doctors & hospitals</h3>
                <p className="text-sm text-mist">Powered by browser geolocation and OpenStreetMap.</p>
              </div>
            </div>
            <button
              onClick={handleNearby}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-aqua to-glow px-4 py-3 font-medium text-white"
            >
              <LocateFixed size={18} />
              {nearbyLoading ? "Finding nearby care..." : "Find nearby care"}
            </button>
            <div className="space-y-3">
              {nearby.length === 0 ? (
                <p className="text-sm text-mist">Use the button above to load clinics, hospitals, and pharmacies near you.</p>
              ) : (
                nearby.map((place) => (
                  <a
                    key={`${place.name}-${place.latitude}-${place.longitude}`}
                    href={place.osm_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-3xl border border-[#18364014] bg-white p-4 transition hover:border-aqua/40 hover:shadow-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-ink">{place.name}</p>
                        <p className="mt-1 text-sm capitalize text-aqua">{place.category}</p>
                        <p className="mt-2 text-sm text-mist">{place.address}</p>
                      </div>
                      <span className="rounded-full bg-[#eff7f4] px-3 py-1 text-xs text-aqua">
                        {place.distance_km} km
                      </span>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 text-ink md:px-6">
      <div className="pointer-events-none absolute left-[8%] top-[10%] h-56 w-56 rounded-full bg-[#d8eee7] blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[8%] h-52 w-52 rounded-full bg-[#f3d8cd] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[6%] left-[42%] h-40 w-40 rounded-full bg-[#dcefe8] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-mesh-gradient opacity-90" />

      <div className="relative mx-auto min-h-[calc(100vh-2rem)] max-w-[1550px]">
        {activeView === "workspace" ? (
          <div className="flex gap-5">
            <Sidebar history={history} onPromptClick={setInput} />
            <main className="flex min-w-0 flex-1 flex-col gap-5">{renderWorkspaceView()}</main>
          </div>
        ) : (
          <main className="flex min-w-0 flex-1 flex-col gap-5">{renderLandingView()}</main>
        )}
      </div>

      <AnimatePresence>
        {toast ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-[#18364014] bg-white px-4 py-3 text-sm text-ink shadow-card"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
