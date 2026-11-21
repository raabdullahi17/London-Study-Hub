// =============================================================
// App: providers + shell + flat route table.
// =============================================================
import { type ReactNode } from "react";
import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/layout/app-shell";
import { StudyStoreProvider } from "@/store/study-store";
import SpacesPage from "@/pages/spaces";
import GroupsPage from "@/pages/groups";
import PeoplePage from "@/pages/people";
import SessionsPage from "@/pages/sessions";
import ProfilePage from "@/pages/profile";
import JoinPage from "@/pages/join";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppShell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={SpacesPage} />
          <Route path="/groups" component={GroupsPage} />
          <Route path="/people" component={PeoplePage} />
          <Route path="/sessions" component={SessionsPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/join" component={JoinPage} />
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </AppShell>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <StudyStoreProvider>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </StudyStoreProvider>
  );
}

export default App;
