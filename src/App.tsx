import { Switch, Route, Router as WouterRouter } from "wouter";
import { Authenticator } from "@aws-amplify/ui-react";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { EstimateProvider, ProjectProvider } from "@/lib/mock-data";

// Pages
import EstimatesDashboard from "@/pages/estimates-dashboard";
import NewEstimate from "@/pages/new-estimate";
import EstimateHistory from "@/pages/estimate-history";
import EstimateDetail from "@/pages/estimate-detail";
import Customers from "@/pages/customers";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Estimates — primary workflow */}
      <Route path="/" component={EstimatesDashboard} />
      <Route path="/estimates/new" component={NewEstimate} />
      <Route path="/estimates/history" component={EstimateHistory} />
      <Route path="/estimates/:id" component={EstimateDetail} />

      {/* Customers */}
      <Route path="/customers" component={Customers} />

      {/* Projects — secondary workflow */}
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />

      {/* Settings */}
      <Route path="/settings" component={Settings} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <Authenticator>
      {() => (
        <ThemeProvider defaultTheme="system" storageKey="plumbing-estimator-theme">
          <EstimateProvider>
            <ProjectProvider>
              <WouterRouter>
                <Layout>
                  <Router />
                </Layout>
              </WouterRouter>
            </ProjectProvider>
          </EstimateProvider>
        </ThemeProvider>
      )}
    </Authenticator>
  );
}
