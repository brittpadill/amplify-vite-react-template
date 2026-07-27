import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Upload,
  Cpu,
  ClipboardCheck,
  CheckCircle2,
  X,
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import { useEstimates, calcEstimateTotal, formatCurrency, type EstimateSection } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { label: "Customer Info", icon: User },
  { label: "Upload Plans", icon: Upload },
  { label: "AI Processing", icon: Cpu },
  { label: "Review", icon: ClipboardCheck },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors",
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground bg-card"
                )}
              >
                {done ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  active ? "text-primary" : done ? "text-primary/80" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 sm:w-20 mx-1 sm:mx-2 mt-[-18px] sm:mt-[-10px] transition-colors",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Step 1: Customer info ────────────────────────────────────────────────────

type CustomerInfo = {
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  projectName: string;
  projectAddress: string;
  projectType: string;
};

const PROJECT_TYPES = [
  "Residential Remodel",
  "New Construction",
  "Service & Repair",
  "Commercial",
  "Multi-Family",
  "Other",
];

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground";

function StepCustomerInfo({
  data,
  onChange,
}: {
  data: CustomerInfo;
  onChange: (d: CustomerInfo) => void;
}) {
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});

  const set = (key: keyof CustomerInfo, value: string) =>
    onChange({ ...data, [key]: value });

  const validate = () => {
    const e: Partial<CustomerInfo> = {};
    if (!data.customerName.trim()) e.customerName = "Required";
    if (!data.email.trim()) e.email = "Required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) e.email = "Invalid email";
    if (!data.projectName.trim()) e.projectName = "Required";
    if (!data.projectAddress.trim()) e.projectAddress = "Required";
    if (!data.projectType) e.projectType = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Expose validate via ref pattern — simpler: return it
  (StepCustomerInfo as any).__validate = validate;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Customer Information</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Enter the customer and project details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Customer Name *" error={errors.customerName}>
          <input
            className={cn(inputCls, errors.customerName && "border-destructive")}
            placeholder="Jane Smith"
            value={data.customerName}
            onChange={(e) => set("customerName", e.target.value)}
          />
        </Field>
        <Field label="Company Name">
          <input
            className={inputCls}
            placeholder="ABC Contractors (optional)"
            value={data.companyName}
            onChange={(e) => set("companyName", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <input
            className={inputCls}
            placeholder="(503) 555-0100"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="Email *" error={errors.email}>
          <input
            className={cn(inputCls, errors.email && "border-destructive")}
            placeholder="jane@example.com"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
      </div>

      <div className="border-t border-border pt-4 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Project Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Project Name *" error={errors.projectName}>
            <input
              className={cn(inputCls, errors.projectName && "border-destructive")}
              placeholder="Kitchen & Bath Remodel"
              value={data.projectName}
              onChange={(e) => set("projectName", e.target.value)}
            />
          </Field>
          <Field label="Project Type *" error={errors.projectType}>
            <select
              className={cn(inputCls, errors.projectType && "border-destructive")}
              value={data.projectType}
              onChange={(e) => set("projectType", e.target.value)}
            >
              <option value="">Select type…</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project Address *" error={errors.projectAddress}>
            <input
              className={cn(
                inputCls,
                "sm:col-span-2",
                errors.projectAddress && "border-destructive"
              )}
              placeholder="1234 Main St, Portland, OR 97201"
              value={data.projectAddress}
              onChange={(e) => set("projectAddress", e.target.value)}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Upload plans ─────────────────────────────────────────────────────

type UploadedFile = {
  name: string;
  size: number;
  type: string;
};

const SUPPORTED_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const SUPPORTED_EXT = ".pdf, .png, .jpg, .jpeg";

function StepUploadPlans({
  files,
  onChange,
}: {
  files: UploadedFile[];
  onChange: (f: UploadedFile[]) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const valid = Array.from(incoming)
        .filter((f) => SUPPORTED_TYPES.includes(f.type))
        .map((f) => ({ name: f.name, size: f.size, type: f.type }));
      onChange([...files, ...valid]);
    },
    [files, onChange]
  );

  const remove = (idx: number) => onChange(files.filter((_, i) => i !== idx));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Upload Plans</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Upload floor plans, blueprints, or photos. Supported: PDF, PNG, JPG.
        </p>
      </div>

      {/* Drop zone */}
      <label
        className={cn(
          "block border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/60 hover:bg-muted/40"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
      >
        <input
          type="file"
          accept={SUPPORTED_EXT}
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium text-foreground">
          Drag & drop files here, or{" "}
          <span className="text-primary">browse</span>
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          PDF, PNG, JPG supported &mdash; DWG/DXF coming soon
        </p>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li
              key={i}
              className="flex items-center gap-3 bg-muted/40 border border-border rounded-lg px-4 py-3"
            >
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(f.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">
        You can skip this step and upload plans later from the estimate detail page.
      </p>
    </div>
  );
}

// ─── Step 3: AI processing ────────────────────────────────────────────────────

const PROCESSING_STEPS = [
  "Analyzing plans...",
  "Detecting fixtures...",
  "Calculating pipe lengths...",
  "Generating material list...",
  "Estimating labor...",
];

function StepProcessing({ done }: { done: boolean }) {
  const [stepIdx] = useState(() => (done ? PROCESSING_STEPS.length : 0));
  const [current, setCurrent] = useState(done ? PROCESSING_STEPS.length : 0);

  // Auto-advance through steps for visual effect
  useState(() => {
    if (done) return;
    const interval = setInterval(() => {
      setCurrent((c) => {
        if (c >= PROCESSING_STEPS.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  });

  const progress = done ? 100 : Math.round((current / PROCESSING_STEPS.length) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI Processing</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Our AI is analyzing your plans to generate a detailed estimate.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-foreground">
            {done || current >= PROCESSING_STEPS.length
              ? "Complete!"
              : PROCESSING_STEPS[current] ?? "Starting..."}
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-3 rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step list */}
      <ul className="space-y-3">
        {PROCESSING_STEPS.map((step, i) => {
          const isComplete = i < current || done;
          const isActive = i === current && !done;
          return (
            <li key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isComplete
                    ? "bg-primary text-primary-foreground"
                    : isActive
                    ? "border-2 border-primary"
                    : "border-2 border-border"
                )}
              >
                {isComplete && <Check className="w-3 h-3" />}
                {isActive && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isComplete
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ul>

      {(done || current >= PROCESSING_STEPS.length) && (
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-5 h-5" />
          Estimate ready for review!
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Estimate review ──────────────────────────────────────────────────

const MOCK_REVIEW_SECTIONS: EstimateSection = {
  materials: [
    { id: "rm1", description: "1/2\" Copper Pipe (100 ft)", quantity: 2, unit: "roll", unitCost: 210 },
    { id: "rm2", description: "3/4\" Copper Pipe (50 ft)", quantity: 1, unit: "roll", unitCost: 145 },
    { id: "rm3", description: "Copper Fittings Assortment", quantity: 1, unit: "lot", unitCost: 340 },
    { id: "rm4", description: "Shut-off Valves", quantity: 6, unit: "ea", unitCost: 32 },
  ],
  fixtures: [
    { id: "rf1", description: "Kitchen Sink (undermount)", quantity: 1, unit: "ea", unitCost: 420 },
    { id: "rf2", description: "Kitchen Faucet", quantity: 1, unit: "ea", unitCost: 285 },
    { id: "rf3", description: "Shower Valve & Trim", quantity: 1, unit: "ea", unitCost: 540 },
  ],
  labor: [
    { id: "rl1", description: "Rough-in Plumbing", quantity: 12, unit: "hr", unitCost: 95 },
    { id: "rl2", description: "Fixture Installation", quantity: 8, unit: "hr", unitCost: 95 },
  ],
  equipment: [
    { id: "req1", description: "Torch Kit Consumables", quantity: 1, unit: "lot", unitCost: 85 },
  ],
  markupPercent: 18,
  taxPercent: 8.5,
};

function ReviewTable({
  title,
  items,
}: {
  title: string;
  items: { id: string; description: string; quantity: number; unit: string; unitCost: number }[];
}) {
  if (items.length === 0) return null;
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      <div className="bg-muted/30 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 text-muted-foreground font-medium">Description</th>
              <th className="text-right px-3 py-2 text-muted-foreground font-medium">Qty</th>
              <th className="text-right px-3 py-2 text-muted-foreground font-medium hidden sm:table-cell">Unit Cost</th>
              <th className="text-right px-3 py-2 text-muted-foreground font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2 text-foreground">{item.description}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground hidden sm:table-cell">
                  {formatCurrency(item.unitCost)}
                </td>
                <td className="px-3 py-2 text-right font-medium text-foreground">
                  {formatCurrency(item.quantity * item.unitCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/50">
              <td colSpan={3} className="px-3 py-2 text-sm font-semibold text-foreground">
                Subtotal
              </td>
              <td className="px-3 py-2 text-right font-semibold text-foreground">
                {formatCurrency(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function StepReview({ customer }: { customer: CustomerInfo }) {
  const sections = MOCK_REVIEW_SECTIONS;
  const total = calcEstimateTotal(sections);

  const matSubtotal = sections.materials.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const fixSubtotal = sections.fixtures.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const labSubtotal = sections.labor.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const eqSubtotal = sections.equipment.reduce((s, i) => s + i.quantity * i.unitCost, 0);
  const subtotal = matSubtotal + fixSubtotal + labSubtotal + eqSubtotal;
  const markupAmt = subtotal * (sections.markupPercent / 100);
  const taxAmt = (subtotal + markupAmt) * (sections.taxPercent / 100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Estimate Review</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Review the AI-generated estimate for {customer.projectName || "this project"}.
        </p>
      </div>

      <ReviewTable title="Materials" items={sections.materials} />
      <ReviewTable title="Fixtures" items={sections.fixtures} />
      <ReviewTable title="Labor" items={sections.labor} />
      <ReviewTable title="Equipment" items={sections.equipment} />

      {/* Totals */}
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
          <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
          <span>Markup ({sections.markupPercent}%)</span>
          <span>{formatCurrency(markupAmt)}</span>
        </div>
        <div className="flex justify-between px-4 py-2.5 text-sm text-muted-foreground">
          <span>Tax ({sections.taxPercent}%)</span>
          <span>{formatCurrency(taxAmt)}</span>
        </div>
        <div className="flex justify-between px-4 py-3 font-bold text-foreground text-base">
          <span>Grand Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Wizard shell ─────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function NewEstimate() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [processingDone, setProcessingDone] = useState(false);
  const [, setLocation] = useLocation();
  const { addEstimate } = useEstimates();

  const [customer, setCustomer] = useState<CustomerInfo>({
    customerName: "",
    companyName: "",
    phone: "",
    email: "",
    projectName: "",
    projectAddress: "",
    projectType: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const goNext = () => {
    if (step === 0) {
      // Trigger validation on step 1
      const validate = (StepCustomerInfo as any).__validate;
      if (validate && !validate()) return;
    }

    if (step === 1) {
      // Move to processing — simulate async AI
      setDir(1);
      setStep(2);
      setProcessingDone(false);
      setTimeout(() => setProcessingDone(true), 3800);
      return;
    }

    if (step === 2 && !processingDone) return; // block until done

    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSave = () => {
    const sections = MOCK_REVIEW_SECTIONS;
    const total = calcEstimateTotal(sections);
    const estimate = addEstimate({
      ...customer,
      status: "Complete",
      estimatedTotal: total,
      sections,
      notes: "",
      plans: files.map((f) => f.name),
    });
    setLocation(`/estimates/${estimate.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back to dashboard */}
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Estimates
      </button>

      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <StepIndicator current={step} />

        {/* Animated step content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <StepCustomerInfo data={customer} onChange={setCustomer} />
              )}
              {step === 1 && (
                <StepUploadPlans files={files} onChange={setFiles} />
              )}
              {step === 2 && <StepProcessing done={processingDone} />}
              {step === 3 && <StepReview customer={customer} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={step === 2 && !processingDone}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              {step === 2 ? (processingDone ? "Review Estimate" : "Processing…") : "Next"}
              {step !== 2 && <ArrowRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Estimate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
