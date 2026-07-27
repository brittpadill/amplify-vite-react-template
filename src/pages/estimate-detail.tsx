import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  MapPin,
  Phone,
  Mail,
  Building2,
  Pencil,
  Copy,
  Download,
  FolderPlus,
  CheckCircle2,
  Clock,
  Upload,
} from "lucide-react";
import {
  useEstimates,
  MOCK_ACTIVITY,
  formatCurrency,
  formatDate,
  statusBadgeClass,
  calcEstimateTotal,
  type EstimateStatus,
  type LineItem,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Section table ────────────────────────────────────────────────────────────

function SectionTable({
  title,
  items,
}: {
  title: string;
  items: LineItem[];
}) {
  if (items.length === 0) return null;
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                Description
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
                Qty
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">
                Unit Cost
              </th>
              <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 text-foreground">{item.description}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-2.5 text-right text-muted-foreground hidden sm:table-cell">
                  {formatCurrency(item.unitCost)}
                </td>
                <td className="px-4 py-2.5 text-right font-medium text-foreground">
                  {formatCurrency(item.quantity * item.unitCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 border-t border-border">
              <td
                colSpan={3}
                className="px-4 py-2.5 font-semibold text-foreground text-sm"
              >
                Subtotal
              </td>
              <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                {formatCurrency(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ─── Activity icon ────────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: string }) {
  const map: Record<string, React.ElementType> = {
    plan_uploaded: Upload,
    estimate_generated: CheckCircle2,
    estimate_approved: CheckCircle2,
    estimate_exported: Download,
    estimate_created: FileText,
  };
  const Icon = map[type] ?? Clock;
  return <Icon className="w-3.5 h-3.5" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EstimateDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { estimates } = useEstimates();

  const estimate = estimates.find((e) => e.id === id);

  if (!estimate) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4 text-center">
        <FileText className="w-12 h-12 text-muted-foreground opacity-30" />
        <h2 className="text-xl font-semibold">Estimate not found</h2>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() => setLocation("/")}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const { sections } = estimate;
  const matSubtotal = sections.materials.reduce(
    (s, i) => s + i.quantity * i.unitCost,
    0
  );
  const fixSubtotal = sections.fixtures.reduce(
    (s, i) => s + i.quantity * i.unitCost,
    0
  );
  const labSubtotal = sections.labor.reduce(
    (s, i) => s + i.quantity * i.unitCost,
    0
  );
  const eqSubtotal = sections.equipment.reduce(
    (s, i) => s + i.quantity * i.unitCost,
    0
  );
  const subtotal = matSubtotal + fixSubtotal + labSubtotal + eqSubtotal;
  const markupAmt = subtotal * (sections.markupPercent / 100);
  const taxAmt = (subtotal + markupAmt) * (sections.taxPercent / 100);
  const total = calcEstimateTotal(sections);

  // Activity events for this estimate
  const activity = MOCK_ACTIVITY.filter((a) => a.estimateId === id);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </button>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">
              {estimate.projectName}
            </h1>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                statusBadgeClass(estimate.status as EstimateStatus)
              )}
            >
              {estimate.status}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {estimate.projectAddress}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <button className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted/60 transition-colors">
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted/60 transition-colors">
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted/60 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
            <FolderPlus className="w-4 h-4" />
            Convert to Project
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & project info */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-xl shadow-sm p-5"
          >
            <h2 className="font-semibold text-foreground mb-4">Customer & Project</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Customer</p>
                <p className="font-semibold text-foreground">{estimate.customerName}</p>
                {estimate.companyName && (
                  <p className="text-muted-foreground flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> {estimate.companyName}
                  </p>
                )}
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> {estimate.phone || "—"}
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {estimate.email}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Project</p>
                <p className="font-semibold text-foreground">{estimate.projectName}</p>
                <p className="text-muted-foreground">{estimate.projectType}</p>
                <p className="text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  {estimate.projectAddress}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Plans */}
          {estimate.plans.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5"
            >
              <h2 className="font-semibold text-foreground mb-3">Uploaded Plans</h2>
              <ul className="space-y-2">
                {estimate.plans.map((plan) => (
                  <li
                    key={plan}
                    className="flex items-center gap-3 bg-muted/40 border border-border rounded-lg px-4 py-2.5"
                  >
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{plan}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Line items */}
          {subtotal > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-5"
            >
              <h2 className="font-semibold text-foreground">Estimate Breakdown</h2>
              <SectionTable title="Materials" items={sections.materials} />
              <SectionTable title="Fixtures" items={sections.fixtures} />
              <SectionTable title="Labor" items={sections.labor} />
              <SectionTable title="Equipment" items={sections.equipment} />

              {/* Totals */}
              <div className="bg-card border border-border rounded-lg divide-y divide-border mt-4">
                <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
                  <span>Markup ({sections.markupPercent}%)</span>
                  <span>{formatCurrency(markupAmt)}</span>
                </div>
                <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
                  <span>Tax ({sections.taxPercent}%)</span>
                  <span>{formatCurrency(taxAmt)}</span>
                </div>
                <div className="flex justify-between px-4 py-3 font-bold text-base text-foreground">
                  <span>Grand Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-border rounded-xl shadow-sm p-10 text-center text-muted-foreground"
            >
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">AI is processing this estimate</p>
              <p className="text-sm mt-1">Check back shortly for the full breakdown.</p>
            </motion.div>
          )}

          {/* Notes */}
          {estimate.notes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5"
            >
              <h2 className="font-semibold text-foreground mb-2">Notes</h2>
              <p className="text-sm text-muted-foreground">{estimate.notes}</p>
            </motion.div>
          )}
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Summary card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card border border-border rounded-xl shadow-sm p-5"
          >
            <h2 className="font-semibold text-foreground mb-4">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    statusBadgeClass(estimate.status as EstimateStatus)
                  )}
                >
                  {estimate.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span className="text-foreground">{formatDate(estimate.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span className="text-foreground">{formatDate(estimate.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Project Type</span>
                <span className="text-foreground text-right max-w-[140px] truncate">
                  {estimate.projectType}
                </span>
              </div>
              {total > 0 && (
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary text-base">
                    {formatCurrency(total)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Activity */}
          {activity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Activity</h2>
              </div>
              <ul className="divide-y divide-border">
                {activity.map((event) => (
                  <li key={event.id} className="px-4 py-3 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <ActivityIcon type={event.type} />
                    </div>
                    <div>
                      <p className="text-xs text-foreground leading-snug">{event.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(event.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
