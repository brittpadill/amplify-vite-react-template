import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, FileText, ChevronRight } from "lucide-react";
import {
  useEstimates,
  formatCurrency,
  formatDate,
  statusBadgeClass,
  type EstimateStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: (EstimateStatus | "All")[] = [
  "All",
  "Draft",
  "Processing",
  "Complete",
  "Approved",
  "Archived",
];

export default function EstimateHistory() {
  const { estimates } = useEstimates();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EstimateStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return estimates.filter((e) => {
      const matchStatus =
        statusFilter === "All" || e.status === statusFilter;
      const matchSearch =
        !q ||
        e.customerName.toLowerCase().includes(q) ||
        e.projectName.toLowerCase().includes(q) ||
        e.projectAddress.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [estimates, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estimate History</h1>
        <p className="text-muted-foreground mt-0.5">
          All estimates across every status.
        </p>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search customer, project, address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Estimates list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No estimates found</p>
            <p className="text-sm mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((estimate) => (
              <li key={estimate.id}>
                <Link href={`/estimates/${estimate.id}`}>
                  <div className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{estimate.customerName}</p>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-semibold",
                            statusBadgeClass(estimate.status as EstimateStatus)
                          )}
                        >
                          {estimate.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{estimate.projectName}</p>
                      <p className="text-xs text-muted-foreground truncate">{estimate.projectAddress}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-foreground">
                        {estimate.estimatedTotal > 0
                          ? formatCurrency(estimate.estimatedTotal)
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(estimate.updatedAt)}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
