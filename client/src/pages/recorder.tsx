import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Camera, Monitor, Play, Pause, Square, Download, RotateCcw, AlertTriangle, FolderOpen, Save } from "lucide-react";

type RecordingMode = "webcam" | "screen" | null;

const DEFAULT_MIME_TYPE = "video/webm";
const SUPPORTED_MIME_TYPES = [
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
  "video/mp4",
];

const DRAFT_KEY = "tubestar-video-draft";

interface VideoDraft {
  title: string;
  recordingType: string;
  savedAt: string;
  duration: number;
}

function saveDraft(draft: VideoDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function getDraft(): VideoDraft | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export default function VideoRecorder() {
  const [mode, setMode] = useState<RecordingMode>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordedMimeType, setRecordedMimeType] = useState(DEFAULT_MIME_TYPE);
  const [showSaveReminder, setShowSaveReminder] = useState(false);
  const [draft, setDraft] = useState<VideoDraft | null>(null);
  const [importedVideo, setImportedVideo] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [videoName, setVideoName] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    setDraft(getDraft());
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (hasRecording && !isRecording) {
      setShowSaveReminder(true);
    }
  }, [hasRecording, isRecording]);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode("webcam");
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
      });
    }
  };

  const startScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode("screen");
    } catch (error) {
      toast({
        title: "Screen Share Error",
        description: "Could not start screen recording.",
      });
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    let mimeType = "";
    for (const type of SUPPORTED_MIME_TYPES) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }
    if (!mimeType) {
      toast({
        title: "Recording Error",
        description: "Your browser doesn't support video recording. Try Chrome or Firefox.",
      });
      return;
    }
    const options = { mimeType };
    const mediaRecorder = new MediaRecorder(streamRef.current, options);
    const chunks: Blob[] = [];
    setRecordedMimeType(mimeType);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      setRecordedChunks(chunks);
      setHasRecording(true);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const promptForName = () => {
    // Generate a default name
    const defaultName = `my-video-${Date.now().toString().slice(-6)}`;
    setVideoName(defaultName);
    setShowNamePrompt(true);
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) return;
    
    // Sanitize the name - remove special chars, replace spaces with dashes
    const sanitizedName = videoName.trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) || 'my-video';
    
    const filename = `${sanitizedName}.webm`;
    
    const blob = new Blob(recordedChunks, { type: recordedMimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Save draft metadata so user can resume editing later
    saveDraft({
      title: filename,
      recordingType: mode || "webcam",
      savedAt: new Date().toISOString(),
      duration: recordingTime,
    });
    setDraft(getDraft());

    setShowSaveReminder(false);
    setShowNamePrompt(false);
    toast({
      title: "Video Saved!",
      description: `Saved as "${filename}". Import it in the Editor to continue working on it.`,
    });
  };

  const playback = () => {
    if (recordedChunks.length === 0 && !importedVideo) return;
    
    if (importedVideo) {
      if (videoRef.current) {
        videoRef.current.src = importedVideo;
        videoRef.current.controls = true;
        videoRef.current.play();
      }
      return;
    }

    const blob = new Blob(recordedChunks, { type: recordedMimeType });
    const url = URL.createObjectURL(blob);
    stopStream();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.controls = true;
      videoRef.current.play();
    }
  };

  const resetRecording = () => {
    setRecordedChunks([]);
    setHasRecording(false);
    setRecordedMimeType(DEFAULT_MIME_TYPE);
    setMode(null);
    setShowSaveReminder(false);
    setImportedVideo(null);
    stopStream();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
      videoRef.current.controls = false;
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setImportedVideo(url);
    setHasRecording(true);
    setMode("webcam");
    
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.controls = true;
    }

    toast({
      title: "Video Imported!",
      description: "Your video is ready. You can send it to the Editor for effects!",
    });
  };

  const clearDraftAndNotify = () => {
    clearDraft();
    setDraft(null);
    toast({ title: "Draft Cleared", description: "Ready to start fresh!" });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Video Recorder</h1>
        <p className="text-zinc-400">Record videos with your webcam or screen</p>
      </div>

      {/* Name Your Video Prompt */}
      {showNamePrompt && (
        <Card className="bg-gradient-to-r from-[#6DFF9C]/10 to-[#2BD4FF]/10 border-[#6DFF9C]/40">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-[#6DFF9C]/20">
                  <Save className="h-6 w-6 text-[#6DFF9C]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Name Your Video</h3>
                  <p className="text-zinc-400 text-sm">Give your video a memorable name!</p>
                </div>
              </div>
              <Input
                value={videoName}
                onChange={(e) => setVideoName(e.target.value)}
                placeholder="my-awesome-video"
                className="bg-[#0a1525] border-[#1a2a4a] text-white"
                maxLength={50}
                data-testid="input-video-name"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadVideo} className="flex-1 bg-[#6DFF9C] text-black" data-testid="button-confirm-download">
                  <Download className="h-4 w-4 mr-2" />
                  Save Video
                </Button>
                <Button variant="ghost" onClick={() => setShowNamePrompt(false)} data-testid="button-cancel-download">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prominent Save Reminder Banner */}
      {showSaveReminder && hasRecording && !isRecording && !showNamePrompt && (
        <div className="rounded-xl bg-gradient-to-r from-[#F3C94C]/20 to-[#2BD4FF]/20 border border-[#F3C94C]/40 p-4 sm:p-6" data-testid="banner-save-reminder">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-full bg-[#F3C94C]/20">
              <AlertTriangle className="h-6 w-6 text-[#F3C94C]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Save Your Video!</h3>
              <p className="text-zinc-300 text-sm">Your recording will be lost if you leave this page. Download it now to keep it safe!</p>
            </div>
            <Button onClick={promptForName} className="w-full sm:w-auto bg-[#6DFF9C] text-black" data-testid="button-download-reminder">
              <Download className="h-4 w-4 mr-2" />
              Download Video
            </Button>
          </div>
        </div>
      )}

      {!mode ? (
        <div className="space-y-8">
          {/* Resume Draft Card */}
          {draft && (
            <Card className="bg-gradient-to-r from-[#4E4DFF]/10 to-[#2BD4FF]/10 border-[#4E4DFF]/30">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="p-3 rounded-full bg-[#4E4DFF]/20">
                    <FolderOpen className="h-6 w-6 text-[#4E4DFF]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Continue Your Video</h3>
                    <p className="text-zinc-300 text-sm">
                      You saved "{draft.title}" on {new Date(draft.savedAt).toLocaleDateString()}. 
                      Import it below to keep editing!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none" data-testid="button-import-draft">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Import Video
                    </Button>
                    <Button variant="ghost" onClick={clearDraftAndNotify} size="sm" data-testid="button-clear-draft">
                      Start Fresh
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover-elevate active-elevate-2 bg-[#0a1525] border-[#1a2a4a]" onClick={startCamera} data-testid="card-webcam">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#2BD4FF]/10 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-[#2BD4FF]" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-white">Webcam Recording</h3>
                <p className="text-zinc-400">Record yourself with your camera</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover-elevate active-elevate-2 bg-[#0a1525] border-[#1a2a4a]" onClick={startScreen} data-testid="card-screen">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#4E4DFF]/10 flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-[#4E4DFF]" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-white">Screen Recording</h3>
                <p className="text-zinc-400">Record your screen for tutorials</p>
              </CardContent>
            </Card>
          </div>

          {/* Import Previous Recording */}
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="p-3 rounded-xl bg-[#6DFF9C]/10">
                  <FolderOpen className="h-6 w-6 text-[#6DFF9C]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Have a saved video?</h3>
                  <p className="text-sm text-zinc-400">Import a video you downloaded earlier to continue editing</p>
                </div>
                <Button variant="ghost" onClick={() => fileInputRef.current?.click()} data-testid="button-import-video">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Import Video
                </Button>
              </div>
            </CardContent>
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileImport}
            className="hidden"
            data-testid="input-file-import"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-white">
                  {mode === "webcam" ? <Camera className="h-5 w-5 text-[#2BD4FF]" /> : <Monitor className="h-5 w-5 text-[#4E4DFF]" />}
                  {importedVideo ? "Imported Video" : mode === "webcam" ? "Webcam" : "Screen"} Recording
                </CardTitle>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="font-display text-xl text-white">{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={!hasRecording && !importedVideo}
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {!isRecording && !hasRecording && !importedVideo && (
                  <>
                    <Button onClick={startRecording} className="bg-[#6DFF9C] text-black" data-testid="button-start-recording">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                      Start Recording
                    </Button>
                    <Button variant="ghost" onClick={resetRecording} data-testid="button-back">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  </>
                )}

                {isRecording && (
                  <>
                    {!isPaused ? (
                      <Button onClick={pauseRecording} variant="secondary" data-testid="button-pause">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button onClick={resumeRecording} variant="secondary" data-testid="button-resume">
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button onClick={stopRecording} className="bg-[#F3C94C] text-black" data-testid="button-stop">
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </>
                )}

                {(hasRecording || importedVideo) && !isRecording && (
                  <>
                    <Button onClick={playback} variant="secondary" data-testid="button-playback">
                      <Play className="h-4 w-4 mr-2" />
                      Play
                    </Button>
                    {!importedVideo && (
                      <Button onClick={promptForName} className="bg-[#6DFF9C] text-black" data-testid="button-download">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                    <Button variant="ghost" onClick={resetRecording} data-testid="button-new-recording">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      New Recording
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="text-white">Recording Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#122046] rounded-lg">
                  <h4 className="font-semibold mb-2 text-[#6DFF9C]">Good Lighting</h4>
                  <p className="text-sm text-zinc-400">Face a window or use a lamp for clear video</p>
                </div>
                <div className="p-4 bg-[#122046] rounded-lg">
                  <h4 className="font-semibold mb-2 text-[#2BD4FF]">Quiet Space</h4>
                  <p className="text-sm text-zinc-400">Find a quiet room for better audio</p>
                </div>
                <div className="p-4 bg-[#122046] rounded-lg">
                  <h4 className="font-semibold mb-2 text-[#F3C94C]">Test First</h4>
                  <p className="text-sm text-zinc-400">Do a quick test to check quality</p>
                </div>
                <div className="p-4 bg-[#122046] rounded-lg">
                  <h4 className="font-semibold mb-2 text-[#4E4DFF]">Be Yourself</h4>
                  <p className="text-sm text-zinc-400">Your personality makes your videos unique!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
