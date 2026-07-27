import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
  User,
  Bell,
  Palette,
  Puzzle,
  Save,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring";

function Section({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
    >
      <div className="flex items-start gap-3 p-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

export default function Settings() {
  const { user } = useAuthenticator();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    estimateComplete: true,
    newComment: true,
    weeklyDigest: false,
    exportReady: true,
  });

  const email = user?.signInDetails?.loginId ?? "";

  const themeOptions: { value: "light" | "dark" | "system"; label: string; icon: React.ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-0.5">
          Manage your profile, preferences, and integrations.
        </p>
      </div>

      {/* Profile */}
      <Section
        icon={User}
        title="Profile"
        description="Your account information."
        delay={0}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              className={cn(inputCls, "text-muted-foreground")}
              value={email}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Email is managed through your AWS Cognito account.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Display Name</label>
            <input className={inputCls} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Company</label>
            <input className={inputCls} placeholder="Your plumbing company" />
          </div>
          <div className="flex justify-end">
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </div>
        </div>
      </Section>

      {/* Theme */}
      <Section
        icon={Palette}
        title="Appearance"
        description="Choose how the app looks."
        delay={0.05}
      >
        <div className="flex gap-3">
          {themeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(
                "flex-1 flex flex-col items-center gap-2 py-3 rounded-lg border-2 transition-colors text-sm font-medium",
                theme === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              <opt.icon className="w-5 h-5" />
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section
        icon={Bell}
        title="Notifications"
        description="Choose which events trigger notifications."
        delay={0.1}
      >
        <div className="space-y-4">
          {(
            [
              { key: "estimateComplete", label: "Estimate processing complete" },
              { key: "newComment", label: "New comment on an estimate or project" },
              { key: "weeklyDigest", label: "Weekly summary digest" },
              { key: "exportReady", label: "Export PDF ready" },
            ] as const
          ).map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{label}</span>
              <button
                role="switch"
                aria-checked={notifications[key]}
                onClick={() =>
                  setNotifications((n) => ({ ...n, [key]: !n[key] }))
                }
                className={cn(
                  "relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none",
                  notifications[key] ? "bg-primary" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                    notifications[key] ? "translate-x-5" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Integrations (future) */}
      <Section
        icon={Puzzle}
        title="Integrations"
        description="Connect backend services — available in a future release."
        delay={0.15}
      >
        <div className="space-y-3">
          {[
            { name: "Amazon S3", desc: "Plan storage and document hosting", soon: true },
            { name: "Amazon Textract", desc: "OCR for uploaded plan files", soon: true },
            { name: "Amazon Bedrock (AI)", desc: "AI-powered estimate generation", soon: true },
            { name: "API Gateway / Lambda", desc: "Real-time estimate backend", soon: true },
            { name: "Amazon RDS PostgreSQL", desc: "Persistent data storage", soon: true },
          ].map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{integration.name}</p>
                <p className="text-xs text-muted-foreground">{integration.desc}</p>
              </div>
              {integration.soon && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-muted text-muted-foreground border border-border">
                  Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
