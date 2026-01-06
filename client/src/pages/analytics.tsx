import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Youtube, BarChart3, TrendingUp, Eye, ThumbsUp, MessageCircle, Clock, AlertCircle, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";

interface VideoStats {
  total: number;
  draft: number;
  inProgress: number;
  published: number;
}

export default function Analytics() {
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);

  // Fetch video project stats from the database
  const { data: videoStats, isLoading } = useQuery<VideoStats>({
    queryKey: ['/api/video-projects/stats'],
  });

  // Since YouTube is not connected, show the empty state / connection prompt
  if (!isYouTubeConnected) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="heading-display text-4xl mb-2">📊 Analytics</h1>
          <p className="text-gray-400">Track your channel's performance</p>
        </div>

        {/* YouTube Connection Card */}
        <Card className="border-[#FF0000]/30 bg-gradient-to-br from-[#1a0a0a] to-[#0a1525]">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF0000]/10">
                <Youtube className="h-10 w-10 text-[#FF0000]" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  Connect Your YouTube Channel
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Connect your YouTube account to see real analytics like views, likes, 
                  comments, and watch time for all your videos.
                </p>
              </div>
              <Link href="/youtube-upload">
                <Button size="lg" className="gap-2 bg-[#FF0000] hover:bg-[#CC0000]">
                  <LinkIcon className="h-4 w-4" />
                  Connect YouTube Account
                </Button>
              </Link>
              <p className="text-xs text-gray-500">
                Requires parental permission for creators under 13
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Local Stats from the App */}
        <div>
          <h2 className="font-display text-2xl mb-4">🎬 Your TubeStar Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-[hsl(320,100%,50%)]">
                  {isLoading ? "..." : videoStats?.total ?? 0}
                </CardTitle>
                <CardDescription>Total Projects</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-[hsl(50,100%,50%)]">
                  {isLoading ? "..." : videoStats?.draft ?? 0}
                </CardTitle>
                <CardDescription>Drafts</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-[hsl(180,100%,50%)]">
                  {isLoading ? "..." : videoStats?.inProgress ?? 0}
                </CardTitle>
                <CardDescription>In Progress</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-4xl text-[hsl(140,100%,50%)]">
                  {isLoading ? "..." : videoStats?.published ?? 0}
                </CardTitle>
                <CardDescription>Published</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Empty State for Videos */}
        <Card>
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-16 w-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No YouTube Analytics Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Once you connect your YouTube account, you'll see detailed analytics for 
              all your videos including views, likes, comments, and watch time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/ideas">
                <Button variant="secondary">💡 Generate Video Ideas</Button>
              </Link>
              <Link href="/recorder">
                <Button variant="secondary">🎬 Record a Video</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* What You'll See */}
        <Card>
          <CardHeader>
            <CardTitle>📈 What You'll See When Connected</CardTitle>
            <CardDescription>Analytics features available after connecting YouTube</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg text-center">
                <Eye className="h-8 w-8 mx-auto text-[hsl(320,100%,50%)] mb-2" />
                <h4 className="font-semibold">Views</h4>
                <p className="text-sm text-gray-400">See how many people watched</p>
              </div>
              <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg text-center">
                <ThumbsUp className="h-8 w-8 mx-auto text-[hsl(180,100%,50%)] mb-2" />
                <h4 className="font-semibold">Likes</h4>
                <p className="text-sm text-gray-400">Track your engagement</p>
              </div>
              <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg text-center">
                <MessageCircle className="h-8 w-8 mx-auto text-[hsl(50,100%,50%)] mb-2" />
                <h4 className="font-semibold">Comments</h4>
                <p className="text-sm text-gray-400">See what fans are saying</p>
              </div>
              <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg text-center">
                <Clock className="h-8 w-8 mx-auto text-[hsl(280,100%,50%)] mb-2" />
                <h4 className="font-semibold">Watch Time</h4>
                <p className="text-sm text-gray-400">How long people watch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips for New Creators */}
        <Card>
          <CardHeader>
            <CardTitle>💡 Tips for Growing Your Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-[hsl(140,100%,50%)] bg-opacity-20 border-2 border-[hsl(140,100%,50%)] rounded-lg">
                <h4 className="font-semibold mb-2">✓ Post Consistently</h4>
                <p className="text-sm">Try to upload at the same time each week. Consistency helps build an audience!</p>
              </div>
              <div className="p-4 bg-[hsl(50,100%,50%)] bg-opacity-20 border-2 border-[hsl(50,100%,50%)] rounded-lg">
                <h4 className="font-semibold mb-2">📈 Engage With Comments</h4>
                <p className="text-sm">Reply to your viewers! It helps build community and boosts your videos.</p>
              </div>
              <div className="p-4 bg-[hsl(320,100%,50%)] bg-opacity-20 border-2 border-[hsl(320,100%,50%)] rounded-lg">
                <h4 className="font-semibold mb-2">🎯 Hook Viewers Early</h4>
                <p className="text-sm">The first 5 seconds matter most. Start with something exciting!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Connected state (future: will show real analytics)
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📊 Analytics</h1>
        <p className="text-gray-400">Track your channel's performance</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <TrendingUp className="h-16 w-16 mx-auto text-[#6DFF9C] mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">YouTube Connected!</h3>
          <p className="text-gray-400">
            Your analytics will appear here once you start getting views.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
