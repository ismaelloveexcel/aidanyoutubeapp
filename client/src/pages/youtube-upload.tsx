import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function YouTubeUpload() {
  const [isConnected, setIsConnected] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const connectToYouTube = () => {
    toast({
      title: "YouTube Connection",
      description: "This feature requires parental permission and YouTube API setup. Contact your parent or guardian to enable YouTube uploads.",
    });
    // In a real implementation, this would initiate OAuth flow
    // window.location.href = '/api/auth/youtube';
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

    // Simulate upload progress
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

    // In a real implementation, this would upload via YouTube API
    // const formData = new FormData();
    // formData.append('video', videoFile);
    // formData.append('title', title);
    // formData.append('description', description);
    // formData.append('tags', tags);
    // await fetch('/api/youtube/upload', { method: 'POST', body: formData });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📤 YouTube Upload</h1>
        <p className="text-gray-400">Upload your videos directly to YouTube</p>
      </div>

      {/* Parental Permission Notice */}
      <Card className="border-[hsl(50,100%,50%)] border-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚠️ Parental Permission Required
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

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect to YouTube</CardTitle>
            <CardDescription>Link your YouTube channel to start uploading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📺</div>
              <p className="text-gray-400 mb-6">
                Connect your YouTube account with parental approval
              </p>
              <Button onClick={connectToYouTube} size="lg">
                Connect YouTube Account
              </Button>
            </div>

            <div className="pt-4 border-t-2 border-[hsl(240,10%,20%)]">
              <h4 className="font-semibold mb-3">What We'll Need Access To:</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Upload videos to your channel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Set video titles, descriptions, and thumbnails</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>View your video analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  <span>We will NOT access comments, subscriptions, or personal data</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upload Form */}
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
                  className="mt-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[hsl(320,100%,50%)] file:text-white hover:file:bg-[hsl(320,100%,60%)]"
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
