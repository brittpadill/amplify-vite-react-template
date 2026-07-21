import { Switch, Route, Router as WouterRouter } from "wouter";
import { Authenticator, useAuthenticator} from "@aws-amplify/ui-react";
import { UserProfile } from "@/components/user-profile";
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
    <Authenticator>
      {({ signOut, user }) => (
        <>
          <div className="flex justify-end p-4 border-b">
            <span className="mr-4">
              Welcome {user?.signInDetails?.loginId}
            </span>

            <button
              className="border rounded px-4 py-2"
              onClick={signOut}
            >
              Sign Out
            </button>
          </div>

          <UserProfile />
          
          <ThemeProvider
            defaultTheme="system"
            storageKey="project-tracker-theme"
          >
            <ProjectProvider>
              <WouterRouter>
                <Layout>
                  <Router />
                </Layout>
              </WouterRouter>
            </ProjectProvider>
          </ThemeProvider>
        </>
      )}
    </Authenticator>
  );
}

export default App;
