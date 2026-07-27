import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Search,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Upload,
  Zap,
  ThumbsUp,
  Download,
  FilePlus,
} from "lucide-react";
import {
  useEstimates,
  MOCK_ACTIVITY,
  formatCurrency,
  formatDate,
  statusBadgeClass,
  type EstimateStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay = 0,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm"
    >
      <div className={cn("p-3 rounded-lg shrink-0", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-tight">{value}</p>
      </div>
    </motion.div>
  );
}

// ─── Activity icon ────────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, React.ElementType> = {
    plan_uploaded: Upload,
    estimate_generated: Zap,
    estimate_approved: ThumbsUp,
    estimate_exported: Download,
    estimate_created: FilePlus,
  };
  const Icon = map[type] ?? FileText;
  return <Icon className="w-4 h-4" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EstimatesDashboard() {
  const { estimates } = useEstimates();
  const [search, setSearch] = useState("");

  // Stat calculations
  const active = estimates.filter(
    (e) => e.status === "Draft" || e.status === "Processing" || e.status === "Complete"
  ).length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const completedThisMonth = estimates.filter(
    (e) =>
      (e.status === "Approved" || e.status === "Complete") &&
      new Date(e.updatedAt) >= startOfMonth
  ).length;

  const pendingReview = estimates.filter((e) => e.status === "Complete").length;

  const approved = estimates.filter(
    (e) => e.status === "Approved" && e.estimatedTotal > 0
  );
  const avgValue =
    approved.length > 0
      ? Math.round(
          approved.reduce((sum, e) => sum + e.estimatedTotal, 0) / approved.length
        )
      : 0;

  // Filtered estimates table
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return estimates;
    return estimates.filter(
      (e) =>
        e.customerName.toLowerCase().includes(q) ||
        e.projectAddress.toLowerCase().includes(q) ||
        e.projectName.toLowerCase().includes(q)
    );
  }, [estimates, search]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Plumbing Estimator
          </h1>
          <p className="text-muted-foreground mt-0.5">
            Manage estimates, upload plans, and review completed estimates.
          </p>
        </div>
        <Link href="/estimates/new">
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors">
            <PlusCircle className="w-5 h-5" />
            New Estimate
          </button>
        </Link>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Active Estimates"
          value={active}
          icon={FileText}
          color="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
          delay={0}
        />
        <StatCard
          label="Completed This Month"
          value={completedThisMonth}
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          delay={0.05}
        />
        <StatCard
          label="Pending Review"
          value={pendingReview}
          icon={Clock}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
          delay={0.1}
        />
        <StatCard
          label="Avg Estimate Value"
          value={formatCurrency(avgValue)}
          icon={TrendingUp}
          color="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
          delay={0.15}
        />
      </div>

      {/* ── Estimates table + Activity feed ─────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Estimates table ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden"
        >
          {/* Table header + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Estimates</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search by customer, project, address…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-muted border border-border rounded-lg w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No estimates found</p>
              <p className="text-sm mt-1">Try a different search or create a new estimate.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Project</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Updated</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((estimate) => (
                    <tr
                      key={estimate.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link href={`/estimates/${estimate.id}`}>
                          <span className="font-medium text-foreground hover:text-primary cursor-pointer">
                            {estimate.customerName}
                          </span>
                        </Link>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {estimate.projectAddress}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground max-w-[180px] truncate">
                        {estimate.projectName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold",
                            statusBadgeClass(estimate.status as EstimateStatus)
                          )}
                        >
                          {estimate.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">
                        {formatDate(estimate.updatedAt)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {estimate.estimatedTotal > 0
                          ? formatCurrency(estimate.estimatedTotal)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* ── Recent activity ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Activity</h2>
          </div>
          <ul className="divide-y divide-border">
            {MOCK_ACTIVITY.slice(0, 7).map((event) => (
              <li key={event.id} className="px-4 py-3 flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <ActivityIcon type={event.type} />
                </div>
                <div>
                  <p className="text-sm text-foreground leading-snug">{event.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(event.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
