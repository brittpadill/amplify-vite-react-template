import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Users, Building2, Phone, Mail, FileText } from "lucide-react";
import { MOCK_CUSTOMERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Customers() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return MOCK_CUSTOMERS;
    return MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-muted-foreground mt-0.5">
            {MOCK_CUSTOMERS.length} customer{MOCK_CUSTOMERS.length !== 1 ? "s" : ""} on record
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search customers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl shadow-sm py-20 text-center text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No customers found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {filtered.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">
                    {customer.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  {customer.company && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {customer.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5 text-sm mb-4">
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  {customer.phone || "—"}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  {customer.email}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{customer.totalEstimates} estimate{customer.totalEstimates !== 1 ? "s" : ""}</span>
                </div>
                {customer.recentProjectIds.length > 0 && (
                  <div className={cn(
                    "ml-auto px-2 py-0.5 rounded-full text-xs font-semibold",
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  )}>
                    Active Project
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
