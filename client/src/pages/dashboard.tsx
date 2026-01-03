import { useState } from "react";
import { useCreatorProfile, AVATARS } from "@/lib/creator-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "wouter";

export default function Dashboard() {
  const { profile, setName, setChannelName, setAvatar, isSetup } = useCreatorProfile();
  const [showSetup, setShowSetup] = useState(!isSetup);
  const [tempName, setTempName] = useState(profile.name);
  const [tempChannel, setTempChannel] = useState(profile.channelName);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);

  const handleSaveProfile = () => {
    if (tempName.trim()) {
      setName(tempName);
      setChannelName(tempChannel);
      setAvatar(selectedAvatar);
      setShowSetup(false);
    }
  };

  const quickActions = [
    { title: "Generate Idea", emoji: "💡", path: "/ideas", gradient: "from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)]" },
    { title: "Write Script", emoji: "📝", path: "/script", gradient: "from-[hsl(270,100%,55%)] to-[hsl(290,100%,50%)]" },
    { title: "Record Video", emoji: "🎬", path: "/recorder", gradient: "from-[hsl(0,100%,50%)] to-[hsl(15,100%,45%)]" },
    { title: "Edit Video", emoji: "✂️", path: "/editor", gradient: "from-[hsl(180,100%,45%)] to-[hsl(170,100%,40%)]" },
  ];

  return (
    <div className="space-y-16">
      {/* Welcome Section with enhanced visuals */}
      <div className="text-center py-12 relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-80 h-80 bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(180,100%,50%)] rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-8 animate-bounce">{profile.avatar}</div>
          <h1 className="font-display text-5xl mb-4 bg-gradient-to-r from-white via-[hsl(180,100%,80%)] to-white bg-clip-text text-transparent">
            {profile.name ? `Hey ${profile.name}! 🎮` : "Welcome to TubeStar! 🚀"}
          </h1>
          <p className="text-xl text-gray-300 font-medium max-w-lg mx-auto">
            {profile.channelName ? `Let's create epic content for ${profile.channelName}` : "Your gaming studio awaits - let's level up!"}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/roadmap">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(45,100%,50%)] to-[hsl(35,100%,45%)] text-gray-900 hover:from-[hsl(45,100%,55%)] hover:to-[hsl(35,100%,50%)] shadow-[0_4px_20px_rgba(255,180,0,0.35)] text-lg px-8">
                🗺️ Start Creating Video
              </Button>
            </Link>
            {!isSetup && (
              <Button size="lg" onClick={() => setShowSetup(true)} className="text-lg px-8">
                🎮 Set Up Your Profile
              </Button>
            )}
            {isSetup && (
              <Button variant="ghost" onClick={() => setShowSetup(true)} className="text-lg">
                ⚙️ Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions - Reduced to 4 main actions */}
      <div>
        <h2 className="font-display text-3xl mb-8 text-center">
          <span className="bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent">⚡ Quick Start</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {quickActions.map((action) => (
            <Link key={action.path} href={action.path}>
              <div className={`bg-gradient-to-br ${action.gradient} p-1 rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,150,255,0.3)] group`}>
                <div className="bg-[hsl(220,30%,10%)] rounded-xl p-8 text-center h-full group-hover:bg-[hsl(220,30%,13%)] transition-colors">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{action.emoji}</div>
                  <h3 className="font-display text-lg text-white">{action.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards with enhanced styling */}
      <div>
        <h2 className="font-display text-3xl mb-8 text-center">
          <span className="bg-gradient-to-r from-[hsl(180,100%,60%)] to-[hsl(170,100%,50%)] bg-clip-text text-transparent">📈 Your Stats</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="text-center border-[hsl(210,60%,40%)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(210,100%,60%)] to-[hsl(200,100%,50%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base mt-2">📝 Scripts Created</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-[hsl(180,60%,40%)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(180,100%,50%)] to-[hsl(170,100%,45%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base mt-2">💡 Ideas Saved</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-[hsl(45,60%,40%)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(45,100%,50%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base mt-2">🎨 Thumbnails Made</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Filming Checklist - Collapsed by default with show/hide */}
      <div className="max-w-4xl mx-auto">
        <Card className="border-[hsl(140,50%,35%)]">
          <CardHeader>
            <CardTitle className="text-2xl">📋 Filming Checklist</CardTitle>
            <CardDescription>Quick reminders before you start recording</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { text: "Camera is clean and focused", emoji: "📸" },
                { text: "Microphone and audio ready", emoji: "🎤" },
                { text: "Good lighting set up", emoji: "💡" },
                { text: "Script reviewed", emoji: "📝" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[hsl(140,40%,15%)] to-[hsl(160,40%,12%)] rounded-xl border border-[hsl(140,40%,25%)]">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-green-300 font-semibold">✓ {item.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">🎮 Set Up Your Profile</DialogTitle>
            <DialogDescription className="text-base">
              Tell us about yourself and your channel!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="channel" className="text-base font-semibold">Channel Name (optional)</Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-base font-semibold">Choose Your Avatar</Label>
              <div className="grid grid-cols-6 gap-3 mt-3">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-3 rounded-xl transition-all transform hover:scale-110 ${
                      selectedAvatar === avatar
                        ? "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] scale-110 shadow-[0_0_20px_rgba(0,150,255,0.4)]"
                        : "bg-[hsl(220,25%,15%)] hover:bg-[hsl(210,30%,20%)] border border-[hsl(210,30%,28%)]"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="w-full" size="lg">
              🚀 Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
