import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Scissors, Type, Music, Download, Play, Pause, Trash2, FolderOpen, Plus, AlertTriangle, Check, Lightbulb } from "lucide-react";

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
  { id: "upbeat", name: "Upbeat Energy" },
  { id: "chill", name: "Chill Vibes" },
  { id: "epic", name: "Epic Adventure" },
  { id: "happy", name: "Happy Days" },
];

const DRAFT_KEY = "tubestar-editor-draft";

interface ClipMeta {
  name: string;
  startTime: number;
  endTime: number;
  originalDuration: number;
}

interface EditorDraft {
  clips: ClipMeta[];
  textOverlays: TextOverlay[];
  selectedMusic: string | null;
  savedAt: string;
}

function saveEditorDraft(draft: EditorDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function getEditorDraft(): EditorDraft | null {
  try {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function clearEditorDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

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
  const [showSaveReminder, setShowSaveReminder] = useState(false);
  const [savedDraft, setSavedDraft] = useState<EditorDraft | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const draft = getEditorDraft();
    if (draft) {
      setSavedDraft(draft);
      setTextOverlays(draft.textOverlays);
      setSelectedMusic(draft.selectedMusic);
    }
  }, []);

  useEffect(() => {
    if (clips.length > 0 || textOverlays.length > 0) {
      setShowSaveReminder(true);
    }
  }, [clips.length, textOverlays.length]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let addedCount = 0;

    for (const file of files) {
      if (!file.type.startsWith('video/')) continue;

      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          // Check if we have saved trim data for this file
          const savedClipMeta = savedDraft?.clips.find(c => c.name === file.name);
          
          const newClip: VideoClip = {
            id: Math.random().toString(36),
            file,
            url,
            startTime: savedClipMeta?.startTime || 0,
            endTime: savedClipMeta?.endTime || video.duration,
            duration: video.duration,
          };

          setClips(prev => [...prev, newClip]);
          setTotalDuration(prev => prev + (newClip.endTime - newClip.startTime));
          addedCount++;
          resolve(null);
        };
      });
    }

    const restoredCount = files.filter(f => savedDraft?.clips.some(c => c.name === f.name)).length;
    
    toast({
      title: "Clips Added!",
      description: restoredCount > 0 
        ? `Added ${addedCount} clip(s). Restored ${restoredCount} saved trim(s)!`
        : `Added ${addedCount} video clip(s)`,
    });
  };

  const loadClip = (clip: VideoClip) => {
    // Pause current playback when switching clips
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    
    setCurrentClip(clip);
    setTrimStart(clip.startTime);
    setTrimEnd(clip.endTime);
    setCurrentTime(clip.startTime);

    if (videoRef.current) {
      videoRef.current.src = clip.url;
      videoRef.current.currentTime = clip.startTime;
    }
  };

  const trimClip = () => {
    if (!currentClip) return;

    // Create the updated clip with new trim values
    const updatedCurrentClip = { ...currentClip, startTime: trimStart, endTime: trimEnd };

    // Only update startTime and endTime, keep original duration intact
    const updatedClips = clips.map(c =>
      c.id === currentClip.id ? updatedCurrentClip : c
    );

    setClips(updatedClips);
    // Update currentClip so playback respects new bounds immediately
    setCurrentClip(updatedCurrentClip);
    setTotalDuration(updatedClips.reduce((sum, c) => sum + (c.endTime - c.startTime), 0));

    // Sync video element to new trim bounds
    if (videoRef.current) {
      // If current position is outside new bounds, seek to start
      if (videoRef.current.currentTime < trimStart || videoRef.current.currentTime > trimEnd) {
        videoRef.current.currentTime = trimStart;
        setCurrentTime(trimStart);
      }
    }

    toast({
      title: "Clip Trimmed!",
      description: `Trimmed to ${(trimEnd - trimStart).toFixed(1)}s`,
    });
  };

  const deleteClip = (id: string) => {
    const newClips = clips.filter(c => c.id !== id);
    setClips(newClips);
    // Recalculate total duration after deletion
    setTotalDuration(newClips.reduce((sum, c) => sum + (c.endTime - c.startTime), 0));
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

  const saveProject = () => {
    const draft: EditorDraft = {
      clips: clips.map(c => ({
        name: c.file.name,
        startTime: c.startTime,
        endTime: c.endTime,
        originalDuration: c.duration,
      })),
      textOverlays,
      selectedMusic,
      savedAt: new Date().toISOString(),
    };
    saveEditorDraft(draft);
    setSavedDraft(draft);
    setShowSaveReminder(false);
    toast({
      title: "Project Saved!",
      description: "Your editing settings have been saved. Remember to download your clips from the Recorder page!",
    });
  };

  const clearProject = () => {
    clearEditorDraft();
    setSavedDraft(null);
    setClips([]);
    setCurrentClip(null);
    setTextOverlays([]);
    setSelectedMusic(null);
    setTotalDuration(0);
    toast({
      title: "Project Cleared",
      description: "Ready to start fresh!",
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
  };

  const togglePlay = () => {
    if (!videoRef.current || !currentClip) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // If at or past the end, reset to start of trimmed section
      if (videoRef.current.currentTime >= currentClip.endTime) {
        videoRef.current.currentTime = currentClip.startTime;
        setCurrentTime(currentClip.startTime);
      }
      // If before start, reset to start
      if (videoRef.current.currentTime < currentClip.startTime) {
        videoRef.current.currentTime = currentClip.startTime;
        setCurrentTime(currentClip.startTime);
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Stop playback at the trimmed end time
      if (currentClip && video.currentTime >= currentClip.endTime) {
        video.pause();
        video.currentTime = currentClip.endTime;
        setCurrentTime(currentClip.endTime);
        setIsPlaying(false);
      } else {
        setCurrentTime(video.currentTime);
      }
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
  }, [currentClip]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">Video Editor</h1>
        <p className="text-zinc-400">Edit your videos like a pro!</p>
      </div>

      {/* Prominent Save Reminder Banner */}
      {showSaveReminder && clips.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-[#F3C94C]/20 to-[#2BD4FF]/20 border border-[#F3C94C]/40 p-4 sm:p-6" data-testid="banner-save-reminder">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-full bg-[#F3C94C]/20">
              <AlertTriangle className="h-6 w-6 text-[#F3C94C]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Save Your Project!</h3>
              <p className="text-zinc-300 text-sm">Your editing work will be lost if you leave this page. Save your project settings!</p>
            </div>
            <Button onClick={saveProject} className="w-full sm:w-auto bg-[#6DFF9C] text-black" data-testid="button-save-project">
              <Check className="h-4 w-4 mr-2" />
              Save Project
            </Button>
          </div>
        </div>
      )}

      {/* Resume Draft Card */}
      {savedDraft && clips.length === 0 && (
        <Card className="bg-gradient-to-r from-[#4E4DFF]/10 to-[#2BD4FF]/10 border-[#4E4DFF]/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-full bg-[#4E4DFF]/20">
                <FolderOpen className="h-6 w-6 text-[#4E4DFF]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Continue Your Project</h3>
                <p className="text-zinc-300 text-sm">
                  You have saved editing settings. Import your video clips to continue where you left off!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button onClick={() => fileInputRef.current?.click()} className="flex-1 sm:flex-none" data-testid="button-import-clips">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Import Clips
                </Button>
                <Button variant="ghost" onClick={clearProject} size="sm" data-testid="button-clear-project">
                  Start Fresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview & Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="text-white">Preview</CardTitle>
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
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#2BD4FF]/10 flex items-center justify-center">
                        <FolderOpen className="h-8 w-8 text-[#2BD4FF]" />
                      </div>
                      <p>Upload clips to start editing</p>
                    </div>
                  </div>
                )}
              </div>

              {currentClip && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Button onClick={togglePlay} variant="secondary" data-testid="button-toggle-play">
                      {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <div className="flex-1">
                      <div className="text-sm text-zinc-400">
                        {formatTime(currentTime - currentClip.startTime)} / {formatTime(currentClip.endTime - currentClip.startTime)}
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
                        className="w-full accent-[#2BD4FF]"
                        data-testid="input-seek"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="text-white">Timeline ({clips.length} clips - {formatTime(totalDuration)})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {clips.length === 0 ? (
                  <p className="text-zinc-400 text-center py-8">No clips yet</p>
                ) : (
                  clips.map((clip, index) => (
                    <div
                      key={clip.id}
                      className={`p-3 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                        currentClip?.id === clip.id
                          ? 'bg-[#2BD4FF]/20 border border-[#2BD4FF]/40'
                          : 'bg-[#122046] hover-elevate'
                      }`}
                      onClick={() => loadClip(clip)}
                      data-testid={`clip-${index}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#4E4DFF]/20 flex items-center justify-center text-[#4E4DFF] font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-white">{clip.file.name}</div>
                          <div className="text-sm text-zinc-400">
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
                        data-testid={`button-delete-clip-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
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
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Plus className="h-5 w-5 text-[#6DFF9C]" />
                Add Clips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full" data-testid="button-add-clips">
                <FolderOpen className="h-4 w-4 mr-2" />
                Import Video Files
              </Button>
            </CardContent>
          </Card>

          {/* Trim Tool */}
          {currentClip && (
            <Card className="bg-[#0a1525] border-[#1a2a4a]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Scissors className="h-5 w-5 text-[#F3C94C]" />
                  Trim Clip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-zinc-300">Start Time</Label>
                  <input
                    type="range"
                    min={0}
                    max={currentClip.duration}
                    step={0.1}
                    value={trimStart}
                    onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                    className="w-full accent-[#F3C94C]"
                    data-testid="input-trim-start"
                  />
                  <div className="text-sm text-zinc-400">{formatTime(trimStart)}</div>
                </div>
                <div>
                  <Label className="text-zinc-300">End Time</Label>
                  <input
                    type="range"
                    min={0}
                    max={currentClip.duration}
                    step={0.1}
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                    className="w-full accent-[#F3C94C]"
                    data-testid="input-trim-end"
                  />
                  <div className="text-sm text-zinc-400">{formatTime(trimEnd)}</div>
                </div>
                <Button onClick={trimClip} className="w-full bg-[#F3C94C] text-black" data-testid="button-apply-trim">
                  Apply Trim
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Text Overlay */}
          {currentClip && (
            <Card className="bg-[#0a1525] border-[#1a2a4a]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Type className="h-5 w-5 text-[#2BD4FF]" />
                  Add Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={newOverlayText}
                  onChange={(e) => setNewOverlayText(e.target.value)}
                  placeholder="Enter text..."
                  maxLength={50}
                  data-testid="input-overlay-text"
                />
                <Button onClick={addTextOverlay} className="w-full" data-testid="button-add-text">
                  Add Text Overlay
                </Button>
                {textOverlays.length > 0 && (
                  <div className="text-sm text-zinc-400">
                    {textOverlays.length} overlay(s) added
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Music */}
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Music className="h-5 w-5 text-[#4E4DFF]" />
                Background Music
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {MUSIC_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => setSelectedMusic(track.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedMusic === track.id
                      ? 'bg-[#4E4DFF]/20 border border-[#4E4DFF]/40 text-white'
                      : 'bg-[#122046] text-zinc-300 hover-elevate'
                  }`}
                  data-testid={`button-music-${track.id}`}
                >
                  {track.name}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Save & Export */}
          <Card className="bg-[#0a1525] border-[#1a2a4a]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Download className="h-5 w-5 text-[#6DFF9C]" />
                Save & Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={saveProject} variant="secondary" className="w-full" data-testid="button-save">
                <Check className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              <Button onClick={mergeAndExport} className="w-full bg-[#6DFF9C] text-black" data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export Final Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-[#0a1525] border-[#1a2a4a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lightbulb className="h-5 w-5 text-[#F3C94C]" />
            Editing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#122046] rounded-lg">
              <h4 className="font-semibold mb-2 text-[#6DFF9C]">Cut the Boring Parts</h4>
              <p className="text-sm text-zinc-400">Trim dead air and long pauses - keep it snappy!</p>
            </div>
            <div className="p-4 bg-[#122046] rounded-lg">
              <h4 className="font-semibold mb-2 text-[#2BD4FF]">Add Text for Context</h4>
              <p className="text-sm text-zinc-400">Help viewers understand with on-screen text</p>
            </div>
            <div className="p-4 bg-[#122046] rounded-lg">
              <h4 className="font-semibold mb-2 text-[#F3C94C]">Background Music = Mood</h4>
              <p className="text-sm text-zinc-400">Choose music that matches your video's energy</p>
            </div>
            <div className="p-4 bg-[#122046] rounded-lg">
              <h4 className="font-semibold mb-2 text-[#4E4DFF]">Export Note</h4>
              <p className="text-sm text-zinc-400">For full merging, you'll need video processing software</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
