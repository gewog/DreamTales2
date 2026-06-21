import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LockProvider } from "@/contexts/lock-context";

import Home from "@/pages/home";
import Reading from "@/pages/reading";
import Favorites from "@/pages/favorites";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();
const ADMIN_KEY_STORAGE = "dreamtales_admin_api_key";

setAuthTokenGetter(() => sessionStorage.getItem(ADMIN_KEY_STORAGE));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/tale/:id" component={Reading} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LockProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </LockProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
