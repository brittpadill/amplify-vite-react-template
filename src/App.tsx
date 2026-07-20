import { Switch, Route, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { ProjectProvider } from "@/lib/mock-data";

import Dashboard from "@/pages/dashboard";
import ProjectDetail from "@/pages/project-detail";
import NewProject from "@/pages/new-project";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/projects/new" component={NewProject} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="project-tracker-theme">
      <ProjectProvider>
        <WouterRouter>
          <Layout>
            <Router />
          </Layout>
        </WouterRouter>
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;
