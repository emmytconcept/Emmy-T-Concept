// ==============================================================================
// EMMY-T CONCEPT — UI Design Tokens & System Status Dictionaries
// All dynamic data (Company Details, Social Links, Portfolio Categories, Services,
// Testimonials, Content) are managed dynamically via Supabase and Admin Settings.
// ==============================================================================

export const BRAND_COLORS = {
  black: "#080808",
  gold: "#d9a323",
  silver: "#c6c8cc",
  white: "#ffffff",
}

export const ORDER_STATUSES = {
  new_enquiry: { label: "New Enquiry", bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  awaiting_quotation: { label: "Awaiting Quote", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  quotation_sent: { label: "Quote Sent", bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  awaiting_payment: { label: "Awaiting Payment", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  in_production: { label: "In Production", bg: "bg-[#d9a323]/15", text: "text-[#d9a323]", border: "border-[#d9a323]/40" },
  ready_for_collection: { label: "Ready for Pickup", bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/30" },
  dispatched: { label: "Dispatched", bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  completed: { label: "Completed", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  cancelled: { label: "Cancelled", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
}
