import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new contract
export const createContract = mutation({
  args: {
    contractId: v.string(),
    clientName: v.string(),
    clientCompany: v.optional(v.string()),
    clientAddress: v.optional(v.string()),
    clientCity: v.optional(v.string()),
    clientState: v.optional(v.string()),
    clientZip: v.optional(v.string()),
    clientEmail: v.string(),
    clientPhone: v.optional(v.string()),
    contractDate: v.string(),
    projectName: v.string(),
    contractNumber: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    totalCost: v.string(),
    services: v.object({
      websiteDesign: v.boolean(),
      websiteDevelopment: v.boolean(),
      websiteMaintenance: v.boolean(),
      additionalServices: v.boolean(),
    }),
    designServices: v.object({
      uiuxConsultation: v.boolean(),
      customMockups: v.boolean(),
      responsiveDesign: v.boolean(),
      brandIntegration: v.boolean(),
    }),
    developmentServices: v.object({
      frontendDev: v.boolean(),
      backendDev: v.boolean(),
      cmsIntegration: v.boolean(),
      ecommerce: v.boolean(),
      database: v.optional(v.boolean()),
      apiDev: v.optional(v.boolean()),
      thirdPartyIntegration: v.optional(v.boolean()),
    }),
    maintenanceServices: v.object({
      regularUpdates: v.boolean(),
      contentUpdates: v.boolean(),
      performanceMonitoring: v.boolean(),
      backupRecovery: v.optional(v.boolean()),
      technicalSupport: v.optional(v.boolean()),
    }),
    additionalServicesDetail: v.optional(v.object({
      domainRegistration: v.boolean(),
      hostingSetup: v.boolean(),
      sslCertificate: v.boolean(),
      seoOptimization: v.boolean(),
      analyticsSetup: v.boolean(),
      training: v.boolean(),
    })),
    milestones: v.array(v.object({
      name: v.string(),
      description: v.string(),
      deliverable: v.string(),
      dueDate: v.optional(v.string()),
      payment: v.string(),
    })),
    depositAmount: v.optional(v.string()),
    finalAmount: v.optional(v.string()),
    maintenanceFee: v.optional(v.string()),
    hourlyRate: v.optional(v.string()),
    paymentTerms: v.string(),
    includedSections: v.object({
      projectOverview: v.boolean(),
      timeline: v.boolean(),
      paymentTerms: v.boolean(),
      clientResponsibilities: v.boolean(),
      elgatoaiResponsibilities: v.boolean(),
      intellectualProperty: v.boolean(),
      confidentiality: v.boolean(),
      warranty: v.boolean(),
      changeManagement: v.boolean(),
      termination: v.boolean(),
      disputeResolution: v.boolean(),
      generalProvisions: v.boolean(),
    }),
    signableUrl: v.string(),
    content: v.string(),
    createdDate: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const contractId = await ctx.db.insert("contracts", {
      ...args,
      status: "draft" as const,
      createdAt: now,
      updatedAt: now,
    });
    
    return contractId;
  },
});

// Get all contracts
export const getContracts = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("contracts")
      .order("desc")
      .collect();
  },
});

// Get contracts by status
export const getContractsByStatus = query({
  args: { status: v.union(v.literal("draft"), v.literal("sent_for_signing"), v.literal("signed")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contracts")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

// Get a specific contract by ID
export const getContractById = query({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update contract status
export const updateContractStatus = mutation({
  args: {
    id: v.id("contracts"),
    status: v.union(v.literal("draft"), v.literal("sent_for_signing"), v.literal("signed")),
    sentDate: v.optional(v.string()),
    signedDate: v.optional(v.string()),
    expirationDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, sentDate, signedDate, expirationDate } = args;
    
    const updateData: any = {
      status,
      updatedAt: Date.now(),
    };
    
    if (sentDate) updateData.sentDate = sentDate;
    if (signedDate) updateData.signedDate = signedDate;
    if (expirationDate) updateData.expirationDate = expirationDate;
    
    await ctx.db.patch(id, updateData);
  },
});

// Delete a contract
export const deleteContract = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
