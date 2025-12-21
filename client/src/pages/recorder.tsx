import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type RecordingMode = "webcam" | "screen" | null;

export default function VideoRecorder() {
  const [mode, setMode] = useState<RecordingMode>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

    const options = { mimeType: "video/webm;codecs=vp9" };
    const mediaRecorder = new MediaRecorder(streamRef.current, options);
    const chunks: Blob[] = [];

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
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const downloadVideo = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tubestar-video-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Video Downloaded!",
      description: "Your video has been saved to your device.",
    });
  };

  const playback = () => {
    if (recordedChunks.length === 0) return;

    const blob = new Blob(recordedChunks, { type: "video/webm" });
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
    setMode(null);
    stopStream();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = "";
      videoRef.current.controls = false;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🎬 Video Recorder</h1>
        <p className="text-gray-400">Record videos with your webcam or screen</p>
      </div>

      {!mode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:scale-105 transition-transform" onClick={startCamera}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📹</div>
              <h3 className="font-display text-2xl mb-2">Webcam Recording</h3>
              <p className="text-gray-400">Record yourself with your camera</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:scale-105 transition-transform" onClick={startScreen}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="font-display text-2xl mb-2">Screen Recording</h3>
              <p className="text-gray-400">Record your screen for tutorials</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {mode === "webcam" ? "📹 Webcam" : "🖥️ Screen"} Recording
                </CardTitle>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="font-display text-xl">{formatTime(recordingTime)}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  muted={!hasRecording}
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                {!isRecording && !hasRecording && (
                  <>
                    <Button onClick={startRecording} size="lg">
                      ⏺️ Start Recording
                    </Button>
                    <Button variant="ghost" onClick={resetRecording}>
                      ← Back
                    </Button>
                  </>
                )}

                {isRecording && (
                  <>
                    {!isPaused ? (
                      <Button onClick={pauseRecording} variant="secondary">
                        ⏸️ Pause
                      </Button>
                    ) : (
                      <Button onClick={resumeRecording} variant="secondary">
                        ▶️ Resume
                      </Button>
                    )}
                    <Button onClick={stopRecording} variant="accent">
                      ⏹️ Stop
                    </Button>
                  </>
                )}

                {hasRecording && !isRecording && (
                  <>
                    <Button onClick={playback} variant="secondary">
                      ▶️ Playback
                    </Button>
                    <Button onClick={downloadVideo}>
                      💾 Download
                    </Button>
                    <Button variant="ghost" onClick={resetRecording}>
                      🔄 New Recording
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📝 Recording Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Good Lighting</h4>
                  <p className="text-sm text-gray-400">Face a window or use a lamp for clear video</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Quiet Space</h4>
                  <p className="text-sm text-gray-400">Find a quiet room for better audio</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Test First</h4>
                  <p className="text-sm text-gray-400">Do a quick test to check quality</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Be Yourself</h4>
                  <p className="text-sm text-gray-400">Your personality makes your videos unique!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
