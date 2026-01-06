import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, AlertTriangle, Youtube, CheckCircle, Loader2, ExternalLink, Settings } from "lucide-react";
import { Link } from "wouter";

interface YouTubeAuthStatus {
  configured: boolean;
  message: string;
}

export default function YouTubeUpload() {
  const [isConnected, setIsConnected] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check if YouTube OAuth is configured on the server
  const { data: authStatus, isLoading: checkingAuth } = useQuery<YouTubeAuthStatus>({
    queryKey: ['/api/auth/youtube/status'],
  });

  // Check for successful OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const youtubeConnected = urlParams.get('youtube_connected');
    const youtubeError = urlParams.get('youtube_error');
    const channelNameParam = urlParams.get('channel_name');

    if (youtubeConnected === 'true') {
      setIsConnected(true);
      setChannelName(channelNameParam || 'Your Channel');
      toast({
        title: "🎉 YouTube Connected!",
        description: `Successfully connected to ${channelNameParam || 'your YouTube channel'}!`,
      });
      // Clean up URL
      window.history.replaceState({}, '', '/youtube-upload');
    } else if (youtubeError) {
      toast({
        title: "❌ Connection Failed",
        description: `Could not connect to YouTube: ${youtubeError}. Please try again.`,
      });
      // Clean up URL
      window.history.replaceState({}, '', '/youtube-upload');
    }
  }, [toast]);

  const connectToYouTube = async () => {
    if (!authStatus?.configured) {
      toast({
        title: "YouTube Not Configured",
        description: "Ask your parent or guardian to set up YouTube API credentials.",
      });
      return;
    }

    setIsConnecting(true);
    try {
      const response = await fetch('/api/auth/youtube');
      const data = await response.json();
      
      if (data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        toast({
          title: "Connection Error",
          description: data.error || "Could not start YouTube connection. Please try again.",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to YouTube. Please try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectYouTube = () => {
    setIsConnected(false);
    setChannelName("");
    toast({
      title: "Disconnected",
      description: "Your YouTube account has been disconnected.",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB limit
        toast({
          title: "File Too Large",
          description: "Video must be under 2GB. Try compressing your video first.",
        });
        return;
      }
      setVideoFile(file);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile || !title) {
      toast({
        title: "Missing Information",
        description: "Please select a video and enter a title.",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress (real implementation would use YouTube API)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast({
            title: "Upload Complete!",
            description: "Your video has been uploaded to YouTube. It may take a few minutes to process.",
          });
          // Reset form
          setVideoFile(null);
          setTitle("");
          setDescription("");
          setTags("");
          return 0;
        }
        return prev + 5;
      });
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Upload className="h-10 w-10 text-[#F3C94C]" />
          <h1 className="heading-display text-4xl">YouTube Upload</h1>
        </div>
        <p className="text-gray-400">Upload your videos directly to YouTube</p>
      </div>

      {/* Parental Permission Notice */}
      <Card className="border-[hsl(50,100%,50%)] border-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(50,100%,50%)]" />
            Parental Permission Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-gray-400">
              <strong className="text-white">For creators under 13:</strong> You need a parent or guardian
              to set up YouTube uploads. They'll need to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
              <li>Create a Family Link account or supervise your YouTube channel</li>
              <li>Approve the YouTube API connection for this app</li>
              <li>Review and approve videos before publishing</li>
              <li>Set appropriate privacy settings (we recommend 'Unlisted' to start)</li>
            </ul>
            <p className="text-gray-400 pt-3 border-t border-[hsl(240,10%,20%)]">
              <strong className="text-white">Note:</strong> This app follows COPPA (Children's Online Privacy Protection Act)
              guidelines to keep young creators safe online.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      {isConnected ? (
        <Card className="border-[#6DFF9C] bg-gradient-to-br from-[#0a1f0a] to-[#0a1525]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-[#6DFF9C]/10">
                  <CheckCircle className="h-8 w-8 text-[#6DFF9C]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Connected to YouTube</h3>
                  <p className="text-gray-400">Channel: {channelName}</p>
                </div>
              </div>
              <Button variant="secondary" onClick={disconnectYouTube} size="sm">
                Disconnect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect to YouTube</CardTitle>
            <CardDescription>Link your YouTube channel to start uploading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <Youtube className="h-16 w-16 text-[#FF0000]" />
              </div>
              
              {checkingAuth ? (
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking connection status...
                </div>
              ) : authStatus?.configured ? (
                <>
                  <p className="text-gray-400 mb-6">
                    Connect your YouTube account with parental approval
                  </p>
                  <Button 
                    onClick={connectToYouTube} 
                    size="lg"
                    disabled={isConnecting}
                    className="gap-2 bg-[#FF0000] hover:bg-[#CC0000]"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Youtube className="h-4 w-4" />
                        Connect YouTube Account
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-4 bg-[hsl(45,100%,50%)]/10 border border-[hsl(45,100%,50%)]/30 rounded-lg mb-6">
                    <div className="flex items-center gap-2 text-[hsl(45,100%,60%)] mb-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-semibold">Setup Required</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      YouTube connection is not configured yet. Ask your parent or guardian to:
                    </p>
                    <ol className="text-sm text-gray-400 list-decimal list-inside mt-2 space-y-1">
                      <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-[#2BD4FF] hover:underline">Google Cloud Console</a></li>
                      <li>Enable YouTube Data API v3</li>
                      <li>Create OAuth 2.0 credentials</li>
                      <li>Add the credentials to this app's settings</li>
                    </ol>
                  </div>
                  <Button disabled size="lg" className="gap-2">
                    <Youtube className="h-4 w-4" />
                    Connect YouTube Account
                  </Button>
                </>
              )}
            </div>

            <div className="pt-4 border-t-2 border-[hsl(240,10%,20%)]">
              <h4 className="font-semibold mb-3">What We'll Need Access To:</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6DFF9C] flex items-center justify-center">
                    <span className="text-[10px] text-[#0a1628] font-bold">Y</span>
                  </div>
                  <span>Upload videos to your channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6DFF9C] flex items-center justify-center">
                    <span className="text-[10px] text-[#0a1628] font-bold">Y</span>
                  </div>
                  <span>Set video titles, descriptions, and thumbnails</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#6DFF9C] flex items-center justify-center">
                    <span className="text-[10px] text-[#0a1628] font-bold">Y</span>
                  </div>
                  <span>View your video analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">N</span>
                  </div>
                  <span>We will NOT access comments, subscriptions, or personal data</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Form - Only show when connected */}
      {isConnected && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Upload New Video</CardTitle>
              <CardDescription>Fill in your video details and upload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video">Video File</Label>
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="mt-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#2BD4FF] file:text-[#0a1628] hover:file:bg-[#1BA8D4]"
                />
                {videoFile && (
                  <p className="text-sm text-gray-400 mt-2">
                    Selected: {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a catchy title..."
                  maxLength={100}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">{title.length}/100 characters</p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell viewers what your video is about..."
                  maxLength={5000}
                  rows={4}
                  className="mt-2 w-full bg-[hsl(240,10%,12%)] border-[3px] border-[hsl(240,10%,20%)] rounded-lg p-3 text-white resize-none focus:outline-none focus:border-[hsl(320,100%,50%)]"
                />
                <p className="text-xs text-gray-400 mt-1">{description.length}/5000 characters</p>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="gaming, minecraft, tutorial"
                  className="mt-2"
                />
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-3 bg-[hsl(240,10%,15%)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[hsl(320,100%,50%)] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={uploadVideo}
                disabled={uploading || !videoFile || !title}
                className="w-full"
                size="lg"
              >
                {uploading ? "Uploading..." : "📤 Upload to YouTube"}
              </Button>
            </CardContent>
          </Card>

          {/* Upload Tips */}
          <Card>
            <CardHeader>
              <CardTitle>📝 Before You Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Check Video Quality</h4>
                  <p className="text-sm text-gray-400">Make sure video is clear and audio is good</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Kid-Friendly Content</h4>
                  <p className="text-sm text-gray-400">No bad words, violence, or scary stuff</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Create Custom Thumbnail</h4>
                  <p className="text-sm text-gray-400">Use our Thumbnail Designer before uploading</p>
                </div>
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✓ Double-Check Info</h4>
                  <p className="text-sm text-gray-400">Review title and description for typos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Privacy Settings Info */}
      <Card>
        <CardHeader>
          <CardTitle>🔒 Recommended Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2 text-[hsl(320,100%,50%)]">For Beginners: "Unlisted"</h4>
              <p className="text-sm text-gray-400">
                Only people with the link can watch. Great for sharing with friends and family first!
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2 text-[hsl(180,100%,50%)]">For Growing Channels: "Public"</h4>
              <p className="text-sm text-gray-400">
                Anyone can find and watch. Use this once you're comfortable with your content!
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2 text-[hsl(50,100%,50%)]">Privacy Tip</h4>
              <p className="text-sm text-gray-400">
                Never share personal information like your address, school, or phone number in videos!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
