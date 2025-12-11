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
    { title: "Generate Idea", emoji: "💡", path: "/ideas", color: "hsl(320, 100%, 50%)" },
    { title: "Write Script", emoji: "📝", path: "/script", color: "hsl(180, 100%, 50%)" },
    { title: "Design Thumbnail", emoji: "🎨", path: "/thumbnail", color: "hsl(50, 100%, 50%)" },
    { title: "Browse Templates", emoji: "📋", path: "/templates", color: "hsl(280, 100%, 50%)" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">{profile.avatar}</div>
        <h1 className="heading-display text-4xl mb-2">
          {profile.name ? `Hey ${profile.name}!` : "Welcome to TubeStar!"}
        </h1>
        <p className="text-xl text-gray-400">
          {profile.channelName ? `Let's create for ${profile.channelName}` : "Your creative studio awaits"}
        </p>
        {!isSetup && (
          <Button className="mt-4" onClick={() => setShowSetup(true)}>
            Set Up Profile
          </Button>
        )}
        {isSetup && (
          <Button className="mt-4" variant="ghost" onClick={() => setShowSetup(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-2xl mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} href={action.path}>
              <Card className="cursor-pointer hover:scale-105 transition-transform">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-3">{action.emoji}</div>
                  <h3 className="font-display text-lg">{action.title}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="font-display text-2xl mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl text-[hsl(320,100%,50%)]">0</CardTitle>
              <CardDescription>Scripts Created</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl text-[hsl(180,100%,50%)]">0</CardTitle>
              <CardDescription>Ideas Saved</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl text-[hsl(50,100%,50%)]">0</CardTitle>
              <CardDescription>Thumbnails Made</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Filming Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Filming Checklist</CardTitle>
          <CardDescription>Don't forget these before recording!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "✓ Check camera is clean and focused",
              "✓ Test microphone and audio levels",
              "✓ Set up good lighting",
              "✓ Review script one more time",
              "✓ Clear background of clutter",
              "✓ Turn off notifications on devices"
            ].map((item, i) => (
              <div key={i} className="p-3 bg-[hsl(240,10%,15%)] rounded-lg">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profile Setup Dialog */}
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Your Profile</DialogTitle>
            <DialogDescription>
              Tell us about yourself and your channel!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="channel">Channel Name (optional)</Label>
              <Input
                id="channel"
                value={tempChannel}
                onChange={(e) => setTempChannel(e.target.value)}
                placeholder="Enter your channel name"
                className="mt-2"
              />
            </div>
            <div>
              <Label>Choose Your Avatar</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-2 rounded-lg transition-all ${
                      selectedAvatar === avatar
                        ? "bg-[hsl(320,100%,50%)] scale-110"
                        : "bg-[hsl(240,10%,15%)] hover:bg-[hsl(240,10%,20%)]"
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleSaveProfile} className="w-full">
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
