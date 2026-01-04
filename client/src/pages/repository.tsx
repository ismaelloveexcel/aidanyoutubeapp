import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Image as ImageIcon, Upload, Trash2 } from "lucide-react";

interface MediaItem {
  id: string;
  type: "audio" | "image";
  name: string;
  url: string;
}

export default function Repository() {
  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("tubestar-media-repo");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems: MediaItem[] = files.map((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("audio/") ? "audio" : "image";
      return {
        id: Math.random().toString(36),
        type,
        name: file.name,
        url,
      };
    });
    const updated = [...media, ...newItems];
    setMedia(updated);
    localStorage.setItem("tubestar-media-repo", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = media.filter((item) => item.id !== id);
    setMedia(updated);
    localStorage.setItem("tubestar-media-repo", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🎵 Media Repository</h1>
        <p className="text-gray-400">Upload and manage your music, sound effects, and overlays for easy use in your videos.</p>
      </div>
      <Card className="bg-[#0a1525] border-[#1a2a4a]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload className="h-5 w-5 text-[#2BD4FF]" />
            Add Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Upload Audio or Image
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {media.length === 0 ? (
          <p className="text-zinc-400 col-span-full text-center">No media uploaded yet.</p>
        ) : (
          media.map((item) => (
            <Card key={item.id} className="bg-[#0a1525] border-[#1a2a4a]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {item.type === "audio" ? <Music className="h-5 w-5 text-[#4E4DFF]" /> : <ImageIcon className="h-5 w-5 text-[#6DFF9C]" />}
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.type === "audio" ? (
                  <audio controls src={item.url} className="w-full mt-2" />
                ) : (
                  <img src={item.url} alt={item.name} className="w-full h-40 object-contain rounded-lg mt-2" />
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="mt-3">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
