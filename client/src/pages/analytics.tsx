import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Analytics() {
  const videos = [
    { id: 1, title: "My First Gaming Video", views: 1250, likes: 89, comments: 24, watchTime: 3200 },
    { id: 2, title: "Top 5 Minecraft Secrets", views: 3450, likes: 278, comments: 67, watchTime: 8900 },
    { id: 3, title: "Daily Vlog #1", views: 890, likes: 45, comments: 12, watchTime: 2100 },
  ];

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comments, 0);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">📊 Analytics</h1>
        <p className="text-gray-400">Track your channel's performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-[hsl(320,100%,50%)]">{totalViews.toLocaleString()}</CardTitle>
            <CardDescription>Total Views</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-[hsl(180,100%,50%)]">{totalLikes}</CardTitle>
            <CardDescription>Total Likes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-[hsl(50,100%,50%)]">{totalComments}</CardTitle>
            <CardDescription>Total Comments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl text-[hsl(280,100%,50%)]">{videos.length}</CardTitle>
            <CardDescription>Videos Uploaded</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Video Performance */}
      <div>
        <h2 className="font-display text-2xl mb-4">🎥 Video Performance</h2>
        <div className="space-y-4">
          {videos.map((video, index) => (
            <Card key={video.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>Video #{index + 1}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display text-[hsl(320,100%,50%)]">
                      {video.views.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">views</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-semibold">👍 {video.likes}</div>
                    <div className="text-sm text-gray-400">Likes</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">💬 {video.comments}</div>
                    <div className="text-sm text-gray-400">Comments</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">⏱️ {Math.floor(video.watchTime / 60)}m</div>
                    <div className="text-sm text-gray-400">Watch Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-[hsl(140,100%,50%)] bg-opacity-20 border-2 border-[hsl(140,100%,50%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Your Best Performer</h4>
              <p className="text-sm">"{videos[1].title}" is crushing it! Make more like this.</p>
            </div>
            <div className="p-4 bg-[hsl(50,100%,50%)] bg-opacity-20 border-2 border-[hsl(50,100%,50%)] rounded-lg">
              <h4 className="font-semibold mb-2">📈 Growth Tip</h4>
              <p className="text-sm">Your gaming videos get 2x more views. Focus on gaming content!</p>
            </div>
            <div className="p-4 bg-[hsl(320,100%,50%)] bg-opacity-20 border-2 border-[hsl(320,100%,50%)] rounded-lg">
              <h4 className="font-semibold mb-2">🎯 Next Goal</h4>
              <p className="text-sm">You're only 150 views away from 10K total! Keep posting!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
