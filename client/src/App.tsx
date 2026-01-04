import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CreatorProfileProvider } from "@/lib/creator-profile";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Ideas from "@/pages/ideas";
import Script from "@/pages/script";
import Thumbnail from "@/pages/thumbnail";
import Soundboard from "@/pages/soundboard";
import Templates from "@/pages/templates";
import VideoRecorder from "@/pages/recorder";
import ViralOptimizer from "@/pages/viral-optimizer";
import YouTubeUpload from "@/pages/youtube-upload";
import VideoEditor from "@/pages/editor";
import Progress from "@/pages/progress";
import Analytics from "@/pages/analytics";
import Calendar from "@/pages/calendar";
import MultiPlatform from "@/pages/multi-platform";
import AIAssistant from "@/pages/ai-assistant";
import Login from "@/pages/login";
import Roadmap from "@/pages/roadmap";
import Repository from "@/pages/repository";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/roadmap" component={Roadmap} />
            <Route path="/ideas" component={Ideas} />
            <Route path="/script" component={Script} />
            <Route path="/templates" component={Templates} />
            <Route path="/thumbnail" component={Thumbnail} />
            <Route path="/soundboard" component={Soundboard} />
            <Route path="/recorder" component={VideoRecorder} />
            <Route path="/editor" component={VideoEditor} />
            <Route path="/viral-optimizer" component={ViralOptimizer} />
            <Route path="/youtube-upload" component={YouTubeUpload} />
            <Route path="/progress" component={Progress} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/multi-platform" component={MultiPlatform} />
            <Route path="/ai-assistant" component={AIAssistant} />
            <Route path="/repository" component={Repository} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CreatorProfileProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CreatorProfileProvider>
    </QueryClientProvider>
  );
}

export default App;
