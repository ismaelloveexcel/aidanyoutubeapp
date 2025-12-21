import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface VideoClip {
  id: string;
  file: File;
  url: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

const MUSIC_TRACKS = [
  { id: "upbeat", name: "Upbeat Energy", url: "" },
  { id: "chill", name: "Chill Vibes", url: "" },
  { id: "epic", name: "Epic Adventure", url: "" },
  { id: "happy", name: "Happy Days", url: "" },
];

export default function VideoEditor() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [currentClip, setCurrentClip] = useState<VideoClip | null>(null);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [newOverlayText, setNewOverlayText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    for (const file of files) {
      if (!file.type.startsWith('video/')) continue;

      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          const newClip: VideoClip = {
            id: Math.random().toString(36),
            file,
            url,
            startTime: 0,
            endTime: video.duration,
            duration: video.duration,
          };

          setClips(prev => [...prev, newClip]);
          setTotalDuration(prev => prev + video.duration);
          resolve(null);
        };
      });
    }

    toast({
      title: "Clips Added!",
      description: `Added ${files.length} video clip(s)`,
    });
  };

  const loadClip = (clip: VideoClip) => {
    setCurrentClip(clip);
    setTrimStart(clip.startTime);
    setTrimEnd(clip.endTime);

    if (videoRef.current) {
      videoRef.current.src = clip.url;
      videoRef.current.currentTime = clip.startTime;
    }
  };

  const trimClip = () => {
    if (!currentClip) return;

    const updatedClips = clips.map(c =>
      c.id === currentClip.id
        ? { ...c, startTime: trimStart, endTime: trimEnd, duration: trimEnd - trimStart }
        : c
    );

    setClips(updatedClips);
    setTotalDuration(updatedClips.reduce((sum, c) => sum + (c.endTime - c.startTime), 0));

    toast({
      title: "Clip Trimmed!",
      description: `Trimmed to ${(trimEnd - trimStart).toFixed(1)}s`,
    });
  };

  const deleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
    if (currentClip?.id === id) {
      setCurrentClip(null);
    }
    toast({
      title: "Clip Deleted",
      description: "Removed clip from timeline",
    });
  };

  const addTextOverlay = () => {
    if (!newOverlayText.trim() || !currentClip) return;

    const overlay: TextOverlay = {
      id: Math.random().toString(36),
      text: newOverlayText,
      startTime: videoRef.current?.currentTime || 0,
      endTime: (videoRef.current?.currentTime || 0) + 3,
      x: 50,
      y: 80,
      fontSize: 48,
      color: "#ffffff",
    };

    setTextOverlays([...textOverlays, overlay]);
    setNewOverlayText("");

    toast({
      title: "Text Added!",
      description: "Added text overlay to video",
    });
  };

  const mergeAndExport = async () => {
    if (clips.length === 0) {
      toast({
        title: "No Clips",
        description: "Add video clips first!",
      });
      return;
    }

    toast({
      title: "Exporting Video",
      description: "This feature requires a backend video processing service. For now, download clips individually from the recorder page.",
    });

    // In a real implementation, this would merge clips using FFmpeg
    // and render text overlays, then download the final video
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🎞️ Video Editor</h1>
        <p className="text-gray-400">Edit your videos like a pro!</p>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview & Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
                {currentClip ? (
                  <>
                    <video
                      ref={videoRef}
                      className="w-full h-full object-contain"
                      controls={false}
                    />
                    {textOverlays.map(overlay => (
                      currentTime >= overlay.startTime && currentTime <= overlay.endTime && (
                        <div
                          key={overlay.id}
                          className="absolute pointer-events-none"
                          style={{
                            left: `${overlay.x}%`,
                            top: `${overlay.y}%`,
                            fontSize: `${overlay.fontSize}px`,
                            color: overlay.color,
                            transform: 'translate(-50%, -50%)',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontWeight: 'bold',
                          }}
                        >
                          {overlay.text}
                        </div>
                      )
                    ))}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎬</div>
                      <p>Upload clips to start editing</p>
                    </div>
                  </div>
                )}
              </div>

              {currentClip && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Button onClick={togglePlay} variant="secondary">
                      {isPlaying ? "⏸️ Pause" : "▶️ Play"}
                    </Button>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">
                        {formatTime(currentTime)} / {formatTime(currentClip.duration)}
                      </div>
                      <input
                        type="range"
                        min={currentClip.startTime}
                        max={currentClip.endTime}
                        value={currentTime}
                        onChange={(e) => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = parseFloat(e.target.value);
                          }
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline ({clips.length} clips - {formatTime(totalDuration)})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clips.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No clips yet</p>
                ) : (
                  clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                        currentClip?.id === clip.id
                          ? 'bg-[hsl(320,100%,50%)]'
                          : 'bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)]'
                      }`}
                      onClick={() => loadClip(clip)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">#{index + 1}</span>
                        <div>
                          <div className="font-semibold">{clip.file.name}</div>
                          <div className="text-sm text-gray-400">
                            {formatTime(clip.endTime - clip.startTime)}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteClip(clip.id);
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools Panel */}
        <div className="space-y-4">
          {/* Upload */}
          <Card>
            <CardHeader>
              <CardTitle>📤 Add Clips</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileUpload}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[hsl(320,100%,50%)] file:text-white hover:file:bg-[hsl(320,100%,60%)]"
              />
            </CardContent>
          </Card>

          {/* Trim Tool */}
          {currentClip && (
            <Card>
              <CardHeader>
                <CardTitle>✂️ Trim Clip</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Start Time</Label>
                  <input
                    type="range"
                    min={0}
                    max={currentClip.duration}
                    step={0.1}
                    value={trimStart}
                    onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400">{formatTime(trimStart)}</div>
                </div>
                <div>
                  <Label>End Time</Label>
                  <input
                    type="range"
                    min={0}
                    max={currentClip.duration}
                    step={0.1}
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400">{formatTime(trimEnd)}</div>
                </div>
                <Button onClick={trimClip} className="w-full">
                  Apply Trim
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Text Overlay */}
          {currentClip && (
            <Card>
              <CardHeader>
                <CardTitle>📝 Add Text</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newOverlayText}
                  onChange={(e) => setNewOverlayText(e.target.value)}
                  placeholder="Enter text..."
                  maxLength={50}
                />
                <Button onClick={addTextOverlay} className="w-full">
                  Add Text Overlay
                </Button>
                {textOverlays.length > 0 && (
                  <div className="text-sm text-gray-400">
                    {textOverlays.length} overlay(s) added
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Music */}
          <Card>
            <CardHeader>
              <CardTitle>🎵 Background Music</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MUSIC_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedMusic(track.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedMusic === track.id
                      ? 'bg-[hsl(180,100%,50%)] text-black'
                      : 'bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)]'
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Export */}
          <Card>
            <CardHeader>
              <CardTitle>💾 Export</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={mergeAndExport} className="w-full" size="lg">
                Export Final Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Editing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Cut the Boring Parts</h4>
              <p className="text-sm text-gray-400">Trim dead air and long pauses - keep it snappy!</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Add Text for Context</h4>
              <p className="text-sm text-gray-400">Help viewers understand with on-screen text</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Background Music = Mood</h4>
              <p className="text-sm text-gray-400">Choose music that matches your video's energy</p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Export Note</h4>
              <p className="text-sm text-gray-400">For full merging, you'll need video processing software</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
