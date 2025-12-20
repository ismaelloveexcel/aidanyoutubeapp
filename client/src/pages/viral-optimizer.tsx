import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const TRENDING_TOPICS = [
  { category: "Gaming", topics: ["Minecraft Updates", "Roblox Secrets", "Fortnite Challenges", "Among Us Mods", "Pokemon Strategies"] },
  { category: "Tech", topics: ["iPhone Tips", "TikTok Hacks", "AI Tools", "App Reviews", "Coding Tutorials"] },
  { category: "DIY", topics: ["Room Makeover", "Art Challenges", "Slime Recipes", "Crafts", "Baking Tutorials"] },
  { category: "Entertainment", topics: ["Movie Reviews", "Music Reactions", "Dance Challenges", "Pranks", "Comedy Skits"] },
];

const VIRAL_FORMULAS = [
  { pattern: "I Tried [Challenge] for [Time Period]", example: "I Tried Only Eating Blue Food for 24 Hours" },
  { pattern: "[Number] [Topic] That Will [Result]", example: "10 Minecraft Secrets That Will Blow Your Mind" },
  { pattern: "What [Group] Don't Want You to Know About [Topic]", example: "What Pro Gamers Don't Want You to Know About Aiming" },
  { pattern: "The Truth About [Trending Topic]", example: "The Truth About TikTok's New Algorithm" },
  { pattern: "[Action] vs [Action]: Which is Better?", example: "Fortnite vs Apex Legends: Which is Better?" },
];

const BEST_POSTING_TIMES = [
  { day: "Weekdays", times: "2-4 PM, 5-7 PM (after school)", reason: "Kids are home and online" },
  { day: "Weekends", times: "9-11 AM, 2-5 PM", reason: "All-day browsing time" },
  { day: "Fridays", times: "3-8 PM", reason: "Weekend excitement starts!" },
];

export default function ViralOptimizer() {
  const [title, setTitle] = useState("");
  const [optimizedTitle, setOptimizedTitle] = useState("");
  const [titleScore, setTitleScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const analyzeTitle = () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a title to analyze" });
      return;
    }

    let score = 0;
    const newSuggestions: string[] = [];
    let improved = title;

    // Check for numbers
    if (/\d+/.test(title)) {
      score += 20;
    } else {
      newSuggestions.push("Add numbers (e.g., '5 Tips' or 'Top 10')");
      improved = `5 ${improved}`;
    }

    // Check for emotional words
    const emotionalWords = /amazing|epic|insane|crazy|shocking|unbelievable|secret|banned|viral/i;
    if (emotionalWords.test(title)) {
      score += 20;
    } else {
      newSuggestions.push("Add an emotional word like 'EPIC', 'INSANE', or 'SHOCKING'");
    }

    // Check length
    if (title.length >= 40 && title.length <= 70) {
      score += 20;
    } else if (title.length < 40) {
      newSuggestions.push("Make title longer (40-70 characters is ideal)");
    } else {
      newSuggestions.push("Make title shorter (40-70 characters is ideal)");
    }

    // Check for capital letters
    if (/[A-Z]{2,}/.test(title)) {
      score += 15;
    } else {
      newSuggestions.push("Use CAPS for emphasis on key words");
      improved = improved.replace(/\b(epic|amazing|insane|crazy|new|best|top)\b/gi, (match) => match.toUpperCase());
    }

    // Check for question or call to action
    if (/\?|!/.test(title)) {
      score += 15;
    } else {
      newSuggestions.push("Add a question (?) or exclamation (!) for impact");
      improved += "!";
    }

    // Check for trending keywords
    const trendingKeywords = /minecraft|roblox|fortnite|tiktok|shorts|hack|secret|tutorial/i;
    if (trendingKeywords.test(title)) {
      score += 10;
    } else {
      newSuggestions.push("Include trending keywords like 'Minecraft', 'TikTok', 'Hack', etc.");
    }

    setTitleScore(score);
    setSuggestions(newSuggestions);
    setOptimizedTitle(improved);
  };

  const generateViralTitle = () => {
    const formula = VIRAL_FORMULAS[Math.floor(Math.random() * VIRAL_FORMULAS.length)];
    const topic = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
    const randomTopic = topic.topics[Math.floor(Math.random() * topic.topics.length)];

    const examples = [
      `I Tried ${randomTopic} for 24 Hours!`,
      `5 ${randomTopic} Secrets You NEED to Know!`,
      `The TRUTH About ${randomTopic}`,
      `${randomTopic} vs Everything Else - Who Wins?`,
      `CRAZY ${randomTopic} Hacks That Actually Work!`,
    ];

    const generated = examples[Math.floor(Math.random() * examples.length)];
    setTitle(generated);
    analyzeTitle();
  };

  const getScoreColor = () => {
    if (titleScore >= 80) return "text-green-400";
    if (titleScore >= 60) return "text-yellow-400";
    if (titleScore >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreLabel = () => {
    if (titleScore >= 80) return "Viral Potential!";
    if (titleScore >= 60) return "Pretty Good";
    if (titleScore >= 40) return "Needs Work";
    return "Not Great";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="heading-display text-4xl mb-2">🚀 Viral Content Optimizer</h1>
        <p className="text-gray-400">Make your videos stand out and go viral!</p>
      </div>

      {/* Title Optimizer */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Title Analyzer</CardTitle>
          <CardDescription>Get your title's viral score and optimization tips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Your Video Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your video title..."
              className="mt-2"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={analyzeTitle}>Analyze Title</Button>
            <Button onClick={generateViralTitle} variant="secondary">
              Generate Viral Title
            </Button>
          </div>

          {titleScore > 0 && (
            <div className="space-y-4 pt-4 border-t-2 border-[hsl(240,10%,20%)]">
              <div className="text-center">
                <div className={`text-6xl font-display ${getScoreColor()}`}>{titleScore}/100</div>
                <div className="text-xl font-semibold mt-2">{getScoreLabel()}</div>
              </div>

              {suggestions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">💡 Suggestions to Improve:</h4>
                  <ul className="space-y-2">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[hsl(320,100%,50%)]">→</span>
                        <span className="text-sm">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {optimizedTitle && optimizedTitle !== title && (
                <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                  <h4 className="font-semibold mb-2">✨ Optimized Version:</h4>
                  <p className="text-[hsl(180,100%,50%)]">{optimizedTitle}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <div>
        <h2 className="font-display text-2xl mb-4">🔥 Trending Topics Right Now</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRENDING_TOPICS.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1 bg-[hsl(320,100%,50%)] rounded-full text-sm font-semibold cursor-pointer hover:bg-[hsl(320,100%,60%)]"
                      onClick={() => setTitle(`${topic} - `)}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Viral Formulas */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Proven Viral Title Formulas</CardTitle>
          <CardDescription>Click any formula to use it as a template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {VIRAL_FORMULAS.map((formula, i) => (
              <div
                key={i}
                className="p-4 bg-[hsl(240,10%,15%)] rounded-lg cursor-pointer hover:bg-[hsl(240,10%,20%)] transition-colors"
                onClick={() => setTitle(formula.pattern)}
              >
                <div className="font-semibold text-[hsl(180,100%,50%)] mb-1">{formula.pattern}</div>
                <div className="text-sm text-gray-400">Example: {formula.example}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Posting Times */}
      <Card>
        <CardHeader>
          <CardTitle>⏰ Best Times to Post</CardTitle>
          <CardDescription>When your audience is most active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {BEST_POSTING_TIMES.map((time, i) => (
              <div key={i} className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-[hsl(320,100%,50%)]">{time.day}</div>
                  <div className="text-sm font-semibold">{time.times}</div>
                </div>
                <div className="text-sm text-gray-400">{time.reason}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Viral Tips */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Proven Viral Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Hook in First 3 Seconds</h4>
              <p className="text-sm text-gray-400">
                Start with action, not intros. Show the best part first!
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Ask Viewers to Engage</h4>
              <p className="text-sm text-gray-400">
                "Comment which one is your favorite!" increases engagement
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Use Pattern Interrupts</h4>
              <p className="text-sm text-gray-400">
                Change camera angles, add sound effects, keep it dynamic
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Post Consistently</h4>
              <p className="text-sm text-gray-400">
                Same day, same time each week builds audience expectations
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Ride Trends Early</h4>
              <p className="text-sm text-gray-400">
                Jump on trending topics within 24-48 hours for max views
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Create Series</h4>
              <p className="text-sm text-gray-400">
                "Part 1", "Day 1" keeps viewers coming back for more
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Optimize Thumbnail</h4>
              <p className="text-sm text-gray-400">
                Bright colors, big text, expressive faces = more clicks
              </p>
            </div>
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">✓ Study Your Analytics</h4>
              <p className="text-sm text-gray-400">
                See which videos perform best and make more like them
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hashtag Generator */}
      <Card>
        <CardHeader>
          <CardTitle>#️⃣ Smart Hashtag Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-[hsl(240,10%,15%)] rounded-lg">
              <h4 className="font-semibold mb-2">Mix Big + Small Hashtags:</h4>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-[hsl(320,100%,50%)] rounded text-sm">#Gaming (Huge)</span>
                <span className="px-3 py-1 bg-[hsl(180,100%,50%)] rounded text-sm">#MinecraftTips (Medium)</span>
                <span className="px-3 py-1 bg-[hsl(50,100%,50%)] rounded text-sm text-black">#BeginnerMinecraft (Small)</span>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Use 3-5 hashtags: 1 huge, 2 medium, 2 specific to your niche
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
