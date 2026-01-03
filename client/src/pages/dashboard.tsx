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
    { title: "View Progress", emoji: "🏆", path: "/progress", gradient: "from-[hsl(45,100%,45%)] to-[hsl(35,100%,50%)]" },
    { title: "Generate Idea", emoji: "💡", path: "/ideas", gradient: "from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)]" },
    { title: "Record Video", emoji: "🎬", path: "/recorder", gradient: "from-[hsl(0,100%,50%)] to-[hsl(15,100%,45%)]" },
    { title: "Edit Video", emoji: "✂️", path: "/editor", gradient: "from-[hsl(180,100%,45%)] to-[hsl(170,100%,40%)]" },
    { title: "AI Assistant", emoji: "🤖", path: "/ai-assistant", gradient: "from-[hsl(220,100%,55%)] to-[hsl(240,100%,50%)]" },
    { title: "Go Viral", emoji: "🚀", path: "/viral", gradient: "from-[hsl(140,100%,45%)] to-[hsl(160,100%,40%)]" },
    { title: "Analytics", emoji: "📊", path: "/analytics", gradient: "from-[hsl(270,100%,55%)] to-[hsl(290,100%,50%)]" },
    { title: "Content Calendar", emoji: "📅", path: "/calendar", gradient: "from-[hsl(30,100%,50%)] to-[hsl(20,100%,45%)]" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Section with enhanced visuals */}
      <div className="text-center py-10 relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
          <div className="w-64 h-64 bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(180,100%,50%)] rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-8xl mb-6 animate-bounce">{profile.avatar}</div>
          <h1 className="font-display text-5xl mb-3 bg-gradient-to-r from-white via-[hsl(180,100%,80%)] to-white bg-clip-text text-transparent">
            {profile.name ? `Hey ${profile.name}! 🎮` : "Welcome to TubeStar! 🚀"}
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            {profile.channelName ? `Let's create epic content for ${profile.channelName}` : "Your gaming studio awaits - let's level up!"}
          </p>
          <div className="mt-6">
            {!isSetup && (
              <Button size="lg" onClick={() => setShowSetup(true)}>
                🎮 Set Up Your Profile
              </Button>
            )}
            {isSetup && (
              <Button variant="ghost" onClick={() => setShowSetup(true)}>
                ⚙️ Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions with gradient cards */}
      <div>
        <h2 className="font-display text-3xl mb-6 text-center">
          <span className="bg-gradient-to-r from-[hsl(45,100%,60%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent">⚡ Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {quickActions.map((action) => (
            <Link key={action.path} href={action.path}>
              <div className={`bg-gradient-to-br ${action.gradient} p-1 rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_30px_rgba(0,150,255,0.3)] group`}>
                <div className="bg-[hsl(220,30%,10%)] rounded-xl p-6 text-center h-full group-hover:bg-[hsl(220,30%,13%)] transition-colors">
                  <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform">{action.emoji}</div>
                  <h3 className="font-display text-lg text-white">{action.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards with enhanced styling */}
      <div>
        <h2 className="font-display text-3xl mb-6 text-center">
          <span className="bg-gradient-to-r from-[hsl(180,100%,60%)] to-[hsl(170,100%,50%)] bg-clip-text text-transparent">📈 Your Stats</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="text-center border-[hsl(210,60%,40%)]">
            <CardHeader>
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(210,100%,60%)] to-[hsl(200,100%,50%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base">📝 Scripts Created</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-[hsl(180,60%,40%)]">
            <CardHeader>
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(180,100%,50%)] to-[hsl(170,100%,45%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base">💡 Ideas Saved</CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center border-[hsl(45,60%,40%)]">
            <CardHeader>
              <CardTitle className="text-5xl bg-gradient-to-r from-[hsl(45,100%,50%)] to-[hsl(35,100%,50%)] bg-clip-text text-transparent">0</CardTitle>
              <CardDescription className="text-base">🎨 Thumbnails Made</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Filming Checklist with enhanced styling */}
      <Card className="border-[hsl(140,50%,35%)]">
        <CardHeader>
          <CardTitle className="text-2xl">📋 Filming Checklist</CardTitle>
          <CardDescription>Don't forget these before recording!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { text: "Check camera is clean and focused", emoji: "📸" },
              { text: "Test microphone and audio levels", emoji: "🎤" },
              { text: "Set up good lighting", emoji: "💡" },
              { text: "Review script one more time", emoji: "📝" },
              { text: "Clear background of clutter", emoji: "🧹" },
              { text: "Turn off notifications on devices", emoji: "🔕" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gradient-to-r from-[hsl(140,40%,15%)] to-[hsl(160,40%,12%)] rounded-xl border border-[hsl(140,40%,25%)]">
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-green-300 font-semibold">✓ {item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
