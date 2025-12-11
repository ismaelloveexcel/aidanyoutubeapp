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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/ideas" component={Ideas} />
        <Route path="/script" component={Script} />
        <Route path="/thumbnail" component={Thumbnail} />
        <Route path="/soundboard" component={Soundboard} />
        <Route path="/templates" component={Templates} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
