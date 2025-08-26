import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contracts: defineTable({
    // Contract identification
    contractId: v.string(),
    
    // Client Information
    clientName: v.string(),
    clientCompany: v.optional(v.string()),
    clientAddress: v.optional(v.string()),
    clientCity: v.optional(v.string()),
    clientState: v.optional(v.string()),
    clientZip: v.optional(v.string()),
    clientEmail: v.string(),
    clientPhone: v.optional(v.string()),
    
    // Project Information
    contractDate: v.string(),
    projectName: v.string(),
    contractNumber: v.optional(v.string()),
    projectDescription: v.optional(v.string()),
    totalCost: v.string(),
    
    // Service Selection
    services: v.object({
      websiteDesign: v.boolean(),
      websiteDevelopment: v.boolean(),
      websiteMaintenance: v.boolean(),
      additionalServices: v.boolean(),
    }),
    
    // Detailed Services
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
    
    // Timeline
    milestones: v.array(v.object({
      name: v.string(),
      description: v.string(),
      deliverable: v.string(),
      dueDate: v.optional(v.string()),
      payment: v.string(),
    })),
    
    // Payment Terms
    depositAmount: v.optional(v.string()),
    finalAmount: v.optional(v.string()),
    maintenanceFee: v.optional(v.string()),
    hourlyRate: v.optional(v.string()),
    paymentTerms: v.string(),
    
    // Sections to include
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
    
    // Contract status and metadata
    status: v.union(v.literal("draft"), v.literal("sent_for_signing"), v.literal("signed")),
    signableUrl: v.string(),
    content: v.string(), // Generated HTML content
    
    // Timestamps
    createdDate: v.string(),
    sentDate: v.optional(v.string()),
    signedDate: v.optional(v.string()),
    expirationDate: v.optional(v.string()),
    
    // System timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_client", ["clientEmail"])
    .index("by_contract_id", ["contractId"])
    .index("by_created_at", ["createdAt"]),
});
