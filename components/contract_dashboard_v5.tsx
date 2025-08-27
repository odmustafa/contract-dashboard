"use client";

import React, { useState } from 'react';
import { Download, FileText, Send, Check, Edit3, Eye, Users, Settings, X } from 'lucide-react';
import jsPDF from 'jspdf';

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const ContractDashboard = () => {
  const [activeTab, setActiveTab] = useState('builder');

  // Convex queries and mutations
  const allContracts = useQuery(api.contracts.getContracts) || [];
  const createContract = useMutation(api.contracts.createContract);
  const updateContractStatus = useMutation(api.contracts.updateContractStatus);
  const [contractData, setContractData] = useState({
    // Client Information
    clientName: '',
    clientCompany: '',
    clientAddress: '',
    clientCity: '',
    clientState: '',
    clientZip: '',
    clientEmail: '',
    clientPhone: '',

    // Project Information
    contractDate: new Date().toISOString().split('T')[0],
    projectName: '',
    contractNumber: '',
    projectDescription: '',
    totalCost: '',

    // Service Selection
    services: {
      websiteDesign: false,
      websiteDevelopment: false,
      websiteMaintenance: false,
      additionalServices: false
    },

    // Detailed Services
    designServices: {
      uiuxConsultation: false,
      customMockups: false,
      responsiveDesign: false,
      brandIntegration: false
    },

    developmentServices: {
      frontendDev: false,
      backendDev: false,
      cmsIntegration: false,
      ecommerce: false,
      database: false,
      apiDev: false,
      thirdPartyIntegration: false
    },

    maintenanceServices: {
      regularUpdates: false,
      contentUpdates: false,
      performanceMonitoring: false,
      backupRecovery: false,
      technicalSupport: false
    },

    additionalServicesDetail: {
      domainRegistration: false,
      hostingSetup: false,
      sslCertificate: false,
      seoOptimization: false,
      analyticsSetup: false,
      training: false
    },

    // Timeline
    milestones: [
      { name: 'Project Kickoff', description: 'Initial consultation & requirements gathering', deliverable: 'Project brief & wireframes', dueDate: '', payment: '25' },
      { name: 'Design Phase', description: 'Visual design & client approval', deliverable: 'Design mockups', dueDate: '', payment: '25' },
      { name: 'Development Phase', description: 'Core functionality development', deliverable: 'Beta version', dueDate: '', payment: '25' },
      { name: 'Launch & Delivery', description: 'Final testing, launch, training', deliverable: 'Live website & documentation', dueDate: '', payment: '25' }
    ],

    // Payment Terms
    depositAmount: '',
    finalAmount: '',
    maintenanceFee: '',
    hourlyRate: '',
    paymentTerms: '30',

    // Sections to include
    includedSections: {
      projectOverview: true,
      timeline: true,
      paymentTerms: true,
      clientResponsibilities: true,
      elgatoaiResponsibilities: true,
      intellectualProperty: true,
      confidentiality: true,
      warranty: true,
      changeManagement: true,
      termination: true,
      disputeResolution: true,
      generalProvisions: true
    }
  });

  // Computed values from Convex data
  const generatedContracts = allContracts.filter(contract => contract.status === 'draft');
  const signingContracts = allContracts.filter(contract => contract.status === 'sent_for_signing');
  const signedContracts = allContracts.filter(contract => contract.status === 'signed');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; contract: any }>({ isOpen: false, contract: null });

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setContractData(prev => ({
        ...prev,
        [parent]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setContractData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleMilestoneChange = (index: number, field: string, value: string) => {
    const newMilestones = [...contractData.milestones];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newMilestones[index] as any)[field] = value;
    setContractData(prev => ({
      ...prev,
      milestones: newMilestones
    }));
  };

  const generateContractId = () => {
    return 'CTR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateMilestonesHTML = (milestones: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return milestones.map((milestone: any, index: number) => `
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h4 style="color: #374151; margin-bottom: 10px;">${index + 1}. ${milestone.name}</h4>
        <p><strong>Description:</strong> ${milestone.description}</p>
        <p><strong>Deliverable:</strong> ${milestone.deliverable}</p>
        <p><strong>Payment:</strong> ${milestone.payment}% of total project cost</p>
        ${milestone.dueDate ? `<p><strong>Due Date:</strong> ${milestone.dueDate}</p>` : ''}
      </div>
    `).join('');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateContractContent = (data: any) => {
    const selectedServices = [];

    // Collect selected services
    if (data.services.websiteDesign) {
      const designDetails = [];
      if (data.designServices.uiuxConsultation) designDetails.push("UI/UX Design Consultation");
      if (data.designServices.customMockups) designDetails.push("Custom Design Mockups");
      if (data.designServices.responsiveDesign) designDetails.push("Responsive Design");
      if (data.designServices.brandIntegration) designDetails.push("Brand Integration");
      selectedServices.push(`Website Design${designDetails.length > 0 ? ` (${designDetails.join(', ')})` : ''}`);
    }

    if (data.services.websiteDevelopment) {
      const devDetails = [];
      if (data.developmentServices.frontendDev) devDetails.push("Frontend Development");
      if (data.developmentServices.backendDev) devDetails.push("Backend Development");
      if (data.developmentServices.cmsIntegration) devDetails.push("CMS Integration");
      if (data.developmentServices.ecommerce) devDetails.push("E-commerce Functionality");
      selectedServices.push(`Website Development${devDetails.length > 0 ? ` (${devDetails.join(', ')})` : ''}`);
    }

    if (data.services.websiteMaintenance) {
      const maintenanceDetails = [];
      if (data.maintenanceServices.regularUpdates) maintenanceDetails.push("Regular Updates & Security Patches");
      if (data.maintenanceServices.contentUpdates) maintenanceDetails.push("Content Updates");
      if (data.maintenanceServices.performanceMonitoring) maintenanceDetails.push("Performance Monitoring");
      selectedServices.push(`Website Maintenance${maintenanceDetails.length > 0 ? ` (${maintenanceDetails.join(', ')})` : ''}`);
    }

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">WEB DEVELOPMENT SERVICE AGREEMENT</h1>
          <p style="color: #666; font-size: 14px;">Contract ID: ${data.contractNumber || 'N/A'}</p>
          <p style="color: #666; font-size: 14px;">Date: ${new Date(data.contractDate).toLocaleDateString()}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PARTIES</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 20px;">
            <div>
              <h3 style="color: #374151; margin-bottom: 10px;">Service Provider:</h3>
              <p><strong>elgAtoAi</strong><br>
              Dallas, TX<br>
              Email: odmustafa@gmail.com</p>
            </div>
            <div>
              <h3 style="color: #374151; margin-bottom: 10px;">Client:</h3>
              <p><strong>${data.clientName}</strong><br>
              ${data.clientCompany ? `${data.clientCompany}<br>` : ''}
              ${data.clientAddress ? `${data.clientAddress}<br>` : ''}
              ${data.clientCity ? `${data.clientCity}, ` : ''}${data.clientState} ${data.clientZip}<br>
              Email: ${data.clientEmail}<br>
              Phone: ${data.clientPhone}</p>
            </div>
          </div>
        </div>

        ${data.includedSections.projectOverview ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PROJECT OVERVIEW</h2>
          <h3 style="color: #374151; margin-top: 20px;">Project Name:</h3>
          <p>${data.projectName}</p>

          <h3 style="color: #374151; margin-top: 20px;">Project Description:</h3>
          <p>${data.projectDescription || 'No description provided.'}</p>

          <h3 style="color: #374151; margin-top: 20px;">Services Included:</h3>
          <ul style="margin-left: 20px;">
            ${selectedServices.map(service => `<li>${service}</li>`).join('')}
          </ul>

          <h3 style="color: #374151; margin-top: 20px;">Total Project Cost:</h3>
          <p style="font-size: 18px; font-weight: bold; color: #059669;">$${data.totalCost}</p>
        </div>
        ` : ''}

        ${data.includedSections.timeline ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PROJECT TIMELINE & MILESTONES</h2>
          <div style="margin-top: 20px;">
            ${generateMilestonesHTML(data.milestones)}
          </div>
        </div>
        ` : ''}

        ${data.includedSections.paymentTerms ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PAYMENT TERMS</h2>
          <div style="margin-top: 20px;">
            <p><strong>Total Project Cost:</strong> $${data.totalCost}</p>
            <p><strong>Payment Schedule:</strong> Payments are due according to the milestone schedule outlined above.</p>
            <p><strong>Payment Terms:</strong> Net ${data.paymentTerms} days from invoice date.</p>
            <p><strong>Late Payment:</strong> A late fee of 1.5% per month may be applied to overdue amounts.</p>
            <p><strong>Payment Methods:</strong> Check, ACH transfer, or other mutually agreed upon methods.</p>
          </div>
        </div>
        ` : ''}

        ${data.includedSections.clientResponsibilities ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">CLIENT RESPONSIBILITIES</h2>
          <ul style="margin-left: 20px; margin-top: 20px;">
            <li>Provide all necessary content, materials, and information in a timely manner</li>
            <li>Respond to requests for feedback and approval within 5 business days</li>
            <li>Provide access to existing systems, accounts, and platforms as needed</li>
            <li>Make payments according to the agreed schedule</li>
            <li>Communicate any changes or concerns promptly</li>
          </ul>
        </div>
        ` : ''}

        ${data.includedSections.elgatoaiResponsibilities ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">ELGATOAI RESPONSIBILITIES</h2>
          <ul style="margin-left: 20px; margin-top: 20px;">
            <li>Deliver services according to the agreed timeline and specifications</li>
            <li>Provide regular updates on project progress</li>
            <li>Ensure all work meets professional industry standards</li>
            <li>Provide documentation and training as specified</li>
            <li>Maintain confidentiality of client information</li>
            <li>Provide post-launch support as outlined in the agreement</li>
          </ul>
        </div>
        ` : ''}

        ${data.includedSections.intellectualProperty ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">INTELLECTUAL PROPERTY</h2>
          <p style="margin-top: 20px;">Upon full payment of all fees, the Client will own all custom work product created specifically for this project. elgAtoAi retains rights to general methodologies, techniques, and any pre-existing intellectual property. Third-party components remain subject to their respective licenses.</p>
        </div>
        ` : ''}

        ${data.includedSections.warranty ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">WARRANTY & SUPPORT</h2>
          <p style="margin-top: 20px;">elgAtoAi warrants that all services will be performed in a professional manner. We provide a 30-day warranty period for bug fixes on delivered work. This warranty does not cover issues arising from client modifications, third-party changes, or hosting environment changes.</p>
        </div>
        ` : ''}

        ${data.includedSections.termination ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #000000 !important; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">TERMINATION</h2>
          <p style="margin-top: 20px;">Either party may terminate this agreement with 30 days written notice. In case of termination, the Client will pay for all work completed up to the termination date. All deliverables completed and paid for will be provided to the Client.</p>
        </div>
        ` : ''}

        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #e5e7eb;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
            <div>
              <h3 style="color: #374151; margin-bottom: 20px;">Client Signature:</h3>
              <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 10px; height: 30px;"></div>
              <p style="font-size: 12px;">Date: _______________</p>
              <p style="font-size: 14px; margin-top: 10px;">${data.clientName}</p>
            </div>
            <div>
              <h3 style="color: #374151; margin-bottom: 20px;">Service Provider:</h3>
              <div style="border-bottom: 1px solid #000; width: 200px; margin-bottom: 10px; height: 30px;"></div>
              <p style="font-size: 12px;">Date: _______________</p>
              <p style="font-size: 14px; margin-top: 10px;">elgAtoAi</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const generateContract = async () => {
    const contractId = generateContractId();
    const contractContent = generateContractContent(contractData);

    try {
      await createContract({
        contractId,
        clientName: contractData.clientName,
        clientCompany: contractData.clientCompany,
        clientAddress: contractData.clientAddress,
        clientCity: contractData.clientCity,
        clientState: contractData.clientState,
        clientZip: contractData.clientZip,
        clientEmail: contractData.clientEmail,
        clientPhone: contractData.clientPhone,
        contractDate: contractData.contractDate,
        projectName: contractData.projectName,
        contractNumber: contractData.contractNumber,
        projectDescription: contractData.projectDescription,
        totalCost: contractData.totalCost,
        services: contractData.services,
        designServices: contractData.designServices,
        developmentServices: contractData.developmentServices,
        maintenanceServices: contractData.maintenanceServices,
        additionalServicesDetail: contractData.additionalServicesDetail,
        milestones: contractData.milestones,
        depositAmount: contractData.depositAmount,
        finalAmount: contractData.finalAmount,
        maintenanceFee: contractData.maintenanceFee,
        hourlyRate: contractData.hourlyRate,
        paymentTerms: contractData.paymentTerms,
        includedSections: contractData.includedSections,
        signableUrl: `https://contracts.elgatoai.com/sign/${contractId}`,
        content: contractContent,
        createdDate: new Date().toLocaleDateString(),
      });

      setActiveTab('contracts');
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract. Please try again.');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openPreview = (contract: any) => {
    setPreviewModal({ isOpen: true, contract });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, contract: null });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadPDF = async (contract: any) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 25;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;
      let pageNumber = 1;

      // Helper function to add text with word wrapping
      const addText = (text: string, x: number, y: number, options: { fontSize?: number; fontStyle?: string; maxWidth?: number; align?: string } = {}) => {
        const fontSize = options.fontSize || 12;
        const fontStyle = options.fontStyle || 'normal';
        const maxWidth = options.maxWidth || contentWidth;
        const align = options.align || 'left';

        pdf.setFontSize(fontSize);
        pdf.setFont('times', fontStyle);

        const lines = pdf.splitTextToSize(text, maxWidth);

        if (align === 'center') {
          lines.forEach((line: string, index: number) => {
            const textWidth = pdf.getTextWidth(line);
            const xPos = (pageWidth - textWidth) / 2;
            pdf.text(line, xPos, y + (index * fontSize * 0.4));
          });
        } else {
          pdf.text(lines, x, y);
        }

        return y + (lines.length * fontSize * 0.4); // Return new Y position
      };

      // Helper function to start a new page
      const newPage = () => {
        pdf.addPage();
        pageNumber++;
        currentY = margin;
      };

      // Helper function to add a heading (H2 always starts new page)
      const addHeading = (text: string, level: number = 1) => {
        if (level === 2) {
          newPage();
        } else if (currentY > pageHeight - 50) {
          newPage();
        }

        const fontSize = level === 1 ? 16 : level === 2 ? 14 : 12;
        const fontStyle = 'bold';

        currentY += level === 1 ? 15 : 10;
        currentY = addText(text, margin, currentY, { fontSize, fontStyle });
        currentY += 8;

        // Add underline for h2
        if (level === 2) {
          pdf.setLineWidth(0.5);
          pdf.line(margin, currentY - 3, pageWidth - margin, currentY - 3);
          currentY += 8;
        }
      };

      // Helper function to add a paragraph
      const addParagraph = (text: string, options: { fontSize?: number; fontStyle?: string; align?: string } = {}) => {
        if (currentY > pageHeight - 40) {
          newPage();
        }

        currentY = addText(text, margin, currentY, { fontSize: 12, ...options });
        currentY += 6;
      };

      // Helper function to add a list
      const addList = (items: string[]) => {
        items.forEach(item => {
          if (currentY > pageHeight - 30) {
            newPage();
          }
          currentY = addText(`• ${item}`, margin + 5, currentY, { fontSize: 12 });
          currentY += 4;
        });
        currentY += 6;
      };

      // Get contract data
      const data = contract.data || contract;

      // COVER PAGE
      currentY = 30;

      // Logo placeholder - moved to top left
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, currentY, 50, 25, 'F');
      pdf.setFontSize(9);
      pdf.setFont('times', 'normal');
      pdf.text('elgAtoAi Logo', margin + 12, currentY + 15);

      currentY += 50;

      // Main title - moved up and made smaller
      addText('WEB DEVELOPMENT SERVICE AGREEMENT', 0, currentY, {
        fontSize: 14,
        fontStyle: 'bold',
        align: 'center'
      });
      currentY += 20;

      // Contract Information Section - moved up and made more compact
      addText('CONTRACT INFORMATION', margin, currentY, { fontSize: 12, fontStyle: 'bold' });
      currentY += 10;

      addText(`Project Name: ${data.projectName}`, margin, currentY, { fontSize: 10 });
      currentY += 4;
      addText(`Contract Number: ${data.contractId || data.contractNumber || 'N/A'}`, margin, currentY, { fontSize: 10 });
      currentY += 4;
      addText(`Contract Date: ${new Date(data.contractDate).toLocaleDateString()}`, margin, currentY, { fontSize: 10 });
      currentY += 4;
      addText(`Date Created: ${data.createdDate || new Date().toLocaleDateString()}`, margin, currentY, { fontSize: 10 });
      currentY += 4;
      addText(`Date Sent: ${data.sentDate || '_____________'}`, margin, currentY, { fontSize: 10 });
      currentY += 4;
      addText(`Date Signed: ${data.signedDate || '_____________'}`, margin, currentY, { fontSize: 10 });

      currentY += 15;

      // Parties Information Section - moved up and made more compact
      addText('PARTIES INVOLVED', margin, currentY, { fontSize: 12, fontStyle: 'bold' });
      currentY += 10;

      // Two columns for parties
      const colWidth = contentWidth / 2 - 5;
      addText('Service Provider:', margin, currentY, { fontSize: 10, fontStyle: 'bold' });
      addText('Client:', margin + colWidth + 10, currentY, { fontSize: 10, fontStyle: 'bold' });
      currentY += 6;

      // Service provider info
      addText('elgAtoAi', margin, currentY, { fontSize: 9 });
      currentY += 3;
      addText('Dallas, TX', margin, currentY, { fontSize: 9 });
      currentY += 3;
      addText('odmustafa@gmail.com', margin, currentY, { fontSize: 9 });

      // Reset Y for client info (align with service provider)
      const clientStartY = currentY - 6;
      let clientY = clientStartY;

      addText(`${data.clientName}`, margin + colWidth + 10, clientY, { fontSize: 9 });
      clientY += 3;
      if (data.clientCompany) {
        addText(`${data.clientCompany}`, margin + colWidth + 10, clientY, { fontSize: 9 });
        clientY += 3;
      }
      addText(`${data.clientEmail}`, margin + colWidth + 10, clientY, { fontSize: 9 });

      currentY += 20;

      // Confidentiality Notice Section - moved to bottom
      addText('CONFIDENTIALITY NOTICE', 0, currentY, {
        fontSize: 11,
        fontStyle: 'bold',
        align: 'center'
      });
      currentY += 10;

      addText('This document contains confidential and proprietary information. Any unauthorized review, use, disclosure, or distribution is prohibited. If you have received this document in error, please contact the sender immediately and destroy all copies.', margin, currentY, { fontSize: 9 });

      // TABLE OF CONTENTS PAGE
      newPage();
      currentY += 20;

      addText('TABLE OF CONTENTS', 0, currentY, {
        fontSize: 16,
        fontStyle: 'bold',
        align: 'center'
      });
      currentY += 30;

      const tocItems = [
        { title: 'Confidentiality Agreement', page: 3 },
        { title: 'Parties', page: 4 },
        { title: 'Project Overview', page: 4 },
        { title: 'Project Timeline & Milestones', page: 5 },
        { title: 'Payment Terms', page: 6 },
        { title: 'Client Responsibilities', page: 7 },
        { title: 'elgAtoAi Responsibilities', page: 7 },
        { title: 'Intellectual Property', page: 8 },
        { title: 'Warranty & Support', page: 8 },
        { title: 'Termination', page: 9 },
        { title: 'Signatures', page: 9 }
      ];

      tocItems.forEach(item => {
        pdf.setFont('times', 'normal');
        pdf.text(item.title, margin, currentY);

        // Add dots
        const titleWidth = pdf.getTextWidth(item.title);
        const pageNumWidth = pdf.getTextWidth(item.page.toString());
        const dotsWidth = contentWidth - titleWidth - pageNumWidth - 10;
        const numDots = Math.floor(dotsWidth / 3);
        const dots = '.'.repeat(numDots);

        pdf.text(dots, margin + titleWidth + 5, currentY);
        pdf.text(item.page.toString(), pageWidth - margin - pageNumWidth, currentY);
        currentY += 8;
      });

      // CONFIDENTIALITY AGREEMENT PAGE
      newPage();
      currentY += 20;

      addText('CONFIDENTIALITY AGREEMENT', 0, currentY, {
        fontSize: 16,
        fontStyle: 'bold',
        align: 'center'
      });
      currentY += 25;

      addParagraph('This Confidentiality Agreement ("Agreement") is entered into between elgAtoAi ("Service Provider") and the Client identified in this contract ("Client") to protect confidential information that may be disclosed during the course of this project.');

      addParagraph('1. CONFIDENTIAL INFORMATION: Any and all information, data, materials, products, technology, computer programs, specifications, manuals, business plans, software, marketing plans, financial information, or other information disclosed by either party, whether orally, in writing, or in any other form.');

      addParagraph('2. OBLIGATIONS: Both parties agree to: (a) Hold all confidential information in strict confidence; (b) Not disclose confidential information to third parties without written consent; (c) Use confidential information solely for the purposes of this project; (d) Take reasonable precautions to protect confidential information.');

      addParagraph('3. TERM: This agreement shall remain in effect for the duration of the project and for three (3) years thereafter.');

      addParagraph('4. RETURN OF MATERIALS: Upon termination of this agreement, both parties shall return or destroy all confidential information and materials.');

      currentY += 20;

      // Signature section for confidentiality
      addText('SIGNATURES', margin, currentY, { fontSize: 12, fontStyle: 'bold' });
      currentY += 20;

      // Two columns for signatures
      addText('Client Signature:', margin, currentY, { fontSize: 11, fontStyle: 'bold' });
      addText('Service Provider:', margin + 90, currentY, { fontSize: 11, fontStyle: 'bold' });
      currentY += 20;

      pdf.line(margin, currentY, margin + 70, currentY);
      pdf.line(margin + 90, currentY, margin + 160, currentY);
      currentY += 15;

      addText('Date: _______________', margin, currentY, { fontSize: 10 });
      addText('Date: _______________', margin + 90, currentY, { fontSize: 10 });

      // CONTRACT CONTENT STARTS HERE
      newPage();

      // Parties Section
      addHeading('PARTIES', 2);

      addParagraph('This Web Development Service Agreement ("Agreement") is entered into between:', { fontStyle: 'bold' });
      currentY += 5;

      addParagraph('Service Provider:', { fontStyle: 'bold', fontSize: 12 });
      addParagraph('elgAtoAi\nDallas, TX\nEmail: odmustafa@gmail.com', { fontSize: 12 });
      currentY += 8;

      addParagraph('Client:', { fontStyle: 'bold', fontSize: 12 });
      let clientInfo = data.clientName;
      if (data.clientCompany) clientInfo += `\n${data.clientCompany}`;
      if (data.clientAddress) clientInfo += `\n${data.clientAddress}`;
      if (data.clientCity || data.clientState || data.clientZip) {
        clientInfo += `\n${data.clientCity ? data.clientCity + ', ' : ''}${data.clientState || ''} ${data.clientZip || ''}`;
      }
      clientInfo += `\nEmail: ${data.clientEmail}\nPhone: ${data.clientPhone}`;
      addParagraph(clientInfo, { fontSize: 12 });

      // Project Overview
      if (data.includedSections?.projectOverview !== false) {
        addHeading('PROJECT OVERVIEW', 2);

        addParagraph('Project Name:', { fontStyle: 'bold', fontSize: 12 });
        addParagraph(data.projectName, { fontSize: 12 });
        currentY += 5;

        if (data.projectDescription) {
          addParagraph('Project Description:', { fontStyle: 'bold', fontSize: 12 });
          addParagraph(data.projectDescription, { fontSize: 12 });
          currentY += 5;
        }

        // Services
        const selectedServices = [];
        if (data.services?.websiteDesign) {
          const designDetails = [];
          if (data.designServices?.uiuxConsultation) designDetails.push("UI/UX Design Consultation");
          if (data.designServices?.customMockups) designDetails.push("Custom Design Mockups");
          if (data.designServices?.responsiveDesign) designDetails.push("Responsive Design");
          if (data.designServices?.brandIntegration) designDetails.push("Brand Integration");
          selectedServices.push(`Website Design${designDetails.length > 0 ? ` (${designDetails.join(', ')})` : ''}`);
        }
        if (data.services?.websiteDevelopment) {
          const devDetails = [];
          if (data.developmentServices?.frontendDev) devDetails.push("Frontend Development");
          if (data.developmentServices?.backendDev) devDetails.push("Backend Development");
          if (data.developmentServices?.cmsIntegration) devDetails.push("CMS Integration");
          if (data.developmentServices?.ecommerce) devDetails.push("E-commerce Functionality");
          selectedServices.push(`Website Development${devDetails.length > 0 ? ` (${devDetails.join(', ')})` : ''}`);
        }
        if (data.services?.websiteMaintenance) {
          const maintenanceDetails = [];
          if (data.maintenanceServices?.regularUpdates) maintenanceDetails.push("Regular Updates & Security Patches");
          if (data.maintenanceServices?.contentUpdates) maintenanceDetails.push("Content Updates");
          if (data.maintenanceServices?.performanceMonitoring) maintenanceDetails.push("Performance Monitoring");
          selectedServices.push(`Website Maintenance${maintenanceDetails.length > 0 ? ` (${maintenanceDetails.join(', ')})` : ''}`);
        }

        if (selectedServices.length > 0) {
          addParagraph('Services Included:', { fontStyle: 'bold', fontSize: 12 });
          addList(selectedServices);
        }

        addParagraph('Total Project Cost:', { fontStyle: 'bold', fontSize: 12 });
        addParagraph(`$${data.totalCost}`, { fontSize: 14, fontStyle: 'bold' });
      }

      // Timeline & Milestones
      if (data.includedSections?.timeline !== false && data.milestones) {
        addHeading('PROJECT TIMELINE & MILESTONES', 2);
        data.milestones.forEach((milestone: { name: string; description: string; deliverable: string; payment: string; dueDate?: string }, index: number) => {
          addParagraph(`Milestone ${index + 1}: ${milestone.name}`, { fontStyle: 'bold', fontSize: 12 });
          addParagraph(`Description: ${milestone.description}`, { fontSize: 12 });
          addParagraph(`Deliverable: ${milestone.deliverable}`, { fontSize: 12 });
          addParagraph(`Payment: ${milestone.payment}% of total project cost`, { fontSize: 12 });
          if (milestone.dueDate) {
            addParagraph(`Due Date: ${milestone.dueDate}`, { fontSize: 12 });
          }
          currentY += 8;
        });
      }

      // Payment Terms
      if (data.includedSections?.paymentTerms !== false) {
        addHeading('PAYMENT TERMS', 2);
        addParagraph(`Total Project Cost: $${data.totalCost}`, { fontStyle: 'bold', fontSize: 12 });
        addParagraph('Payment Schedule: Payments are due according to the milestone schedule outlined above.', { fontSize: 12 });
        addParagraph(`Payment Terms: Net ${data.paymentTerms || '30'} days from invoice date.`, { fontSize: 12 });
        addParagraph('Late Payment: A late fee of 1.5% per month may be applied to overdue amounts.', { fontSize: 12 });
        addParagraph('Payment Methods: Check, ACH transfer, or other mutually agreed upon methods.', { fontSize: 12 });
      }

      // Client Responsibilities
      if (data.includedSections?.clientResponsibilities !== false) {
        addHeading('CLIENT RESPONSIBILITIES', 2);
        addParagraph('The Client agrees to the following responsibilities:', { fontSize: 12 });
        const clientResponsibilities = [
          'Provide all necessary content, materials, and information in a timely manner',
          'Respond to requests for feedback and approval within 5 business days',
          'Provide access to existing systems, accounts, and platforms as needed',
          'Make payments according to the agreed schedule',
          'Communicate any changes or concerns promptly'
        ];
        addList(clientResponsibilities);
      }

      // elgAtoAi Responsibilities
      if (data.includedSections?.elgatoaiResponsibilities !== false) {
        addHeading('ELGATOAI RESPONSIBILITIES', 2);
        addParagraph('elgAtoAi agrees to the following responsibilities:', { fontSize: 12 });
        const elgatoaiResponsibilities = [
          'Deliver services according to the agreed timeline and specifications',
          'Provide regular updates on project progress',
          'Ensure all work meets professional industry standards',
          'Provide documentation and training as specified',
          'Maintain confidentiality of client information',
          'Provide post-launch support as outlined in the agreement'
        ];
        addList(elgatoaiResponsibilities);
      }

      // Intellectual Property
      if (data.includedSections?.intellectualProperty !== false) {
        addHeading('INTELLECTUAL PROPERTY', 2);
        addParagraph('Upon full payment of all fees, the Client will own all custom work product created specifically for this project. elgAtoAi retains rights to general methodologies, techniques, and any pre-existing intellectual property. Third-party components remain subject to their respective licenses.', { fontSize: 12 });
      }

      // Warranty & Support
      if (data.includedSections?.warranty !== false) {
        addHeading('WARRANTY & SUPPORT', 2);
        addParagraph('elgAtoAi warrants that all services will be performed in a professional manner. We provide a 30-day warranty period for bug fixes on delivered work. This warranty does not cover issues arising from client modifications, third-party changes, or hosting environment changes.', { fontSize: 12 });
      }

      // Termination
      if (data.includedSections?.termination !== false) {
        addHeading('TERMINATION', 2);
        addParagraph('Either party may terminate this agreement with 30 days written notice. In case of termination, the Client will pay for all work completed up to the termination date. All deliverables completed and paid for will be provided to the Client.', { fontSize: 12 });
      }

      // Signatures
      addHeading('SIGNATURES', 2);
      addParagraph('By signing below, both parties agree to the terms and conditions outlined in this agreement.', { fontSize: 12 });
      currentY += 15;

      // Two columns for signatures
      addText('CLIENT', margin, currentY, { fontSize: 12, fontStyle: 'bold' });
      addText('SERVICE PROVIDER', margin + 90, currentY, { fontSize: 12, fontStyle: 'bold' });
      currentY += 25;

      pdf.setLineWidth(1);
      pdf.line(margin, currentY, margin + 70, currentY);
      pdf.line(margin + 90, currentY, margin + 160, currentY);
      currentY += 8;

      addText(`${data.clientName}`, margin, currentY, { fontSize: 11 });
      addText('elgAtoAi', margin + 90, currentY, { fontSize: 11 });
      currentY += 15;

      addText('Date: _______________', margin, currentY, { fontSize: 10 });
      addText('Date: _______________', margin + 90, currentY, { fontSize: 10 });

      // Add page numbers to all pages after all content is generated
      const totalPagesActual = pageNumber;

      // Go through each page and add page numbers
      for (let i = 1; i <= totalPagesActual; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setFont('times', 'normal');

        // Clear any existing text in the footer area first
        pdf.setFillColor(255, 255, 255);
        pdf.rect(pageWidth - margin - 30, pageHeight - 20, 30, 10, 'F');

        // Add the page number
        const pageText = `${i} of ${totalPagesActual}`;
        const textWidth = pdf.getTextWidth(pageText);
        pdf.text(pageText, pageWidth - margin - textWidth, pageHeight - 15);
      }

      // Download
      pdf.save(`Contract-${contract.contractId || contract.id || 'document'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const sendForSigning = async (contractId: string) => {
    const contract = allContracts.find(c => c.contractId === contractId);
    if (contract) {
      try {
        await updateContractStatus({
          id: contract._id,
          status: 'sent_for_signing',
          sentDate: new Date().toLocaleDateString(),
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
        });

        setTimeout(() => {
          alert(`Contract sent to ${contract.clientEmail} and odmustafa@gmail.com`);
        }, 1000);
      } catch (error) {
        console.error('Error updating contract status:', error);
        alert('Error sending contract. Please try again.');
      }
    }
  };

  const simulateSignature = async (contractId: string) => {
    const contract = allContracts.find(c => c.contractId === contractId);
    if (contract) {
      try {
        await updateContractStatus({
          id: contract._id,
          status: 'signed',
          signedDate: new Date().toLocaleDateString()
        });

        setTimeout(() => {
          alert(`Contract signed! Notifications sent to client and odmustafa@gmail.com`);
        }, 1000);
      } catch (error) {
        console.error('Error updating contract status:', error);
        alert('Error signing contract. Please try again.');
      }
    }
  };

  const ServiceCheckbox = ({ label, checked, onChange, description }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
  }) => (
    <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <div className="flex-1">
        <label className="font-medium text-gray-900">{label}</label>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
    </div>
  );

  const renderContractBuilder = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Edit3 className="mr-2" size={20} />
          Contract Builder
        </h2>

        {/* Client Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Users className="mr-2" size={18} />
            Client Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
              <input
                type="text"
                value={contractData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={contractData.clientCompany}
                onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC Corporation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={contractData.clientEmail}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={contractData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <FileText className="mr-2" size={18} />
            Project Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                value={contractData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company Website Redesign"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost ($)</label>
              <input
                type="number"
                value={contractData.totalCost}
                onChange={(e) => handleInputChange('totalCost', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
            <textarea
              value={contractData.projectDescription}
              onChange={(e) => handleInputChange('projectDescription', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Complete website redesign including new branding, responsive design, and modern functionality..."
            />
          </div>
        </div>

        {/* Services Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Settings className="mr-2" size={18} />
            Services to Include
          </h3>

          <div className="space-y-4 mb-6">
            <ServiceCheckbox
              label="Website Design"
              checked={contractData.services.websiteDesign}
              onChange={(checked) => handleInputChange('services.websiteDesign', checked)}
              description="UI/UX design, mockups, responsive design, brand integration"
            />

            {contractData.services.websiteDesign && (
              <div className="ml-8 space-y-2 p-4 bg-gray-50 rounded-lg">
                <ServiceCheckbox
                  label="UI/UX Design Consultation"
                  checked={contractData.designServices.uiuxConsultation}
                  onChange={(checked) => handleInputChange('designServices.uiuxConsultation', checked)}
                />
                <ServiceCheckbox
                  label="Custom Design Mockups"
                  checked={contractData.designServices.customMockups}
                  onChange={(checked) => handleInputChange('designServices.customMockups', checked)}
                />
                <ServiceCheckbox
                  label="Responsive Design"
                  checked={contractData.designServices.responsiveDesign}
                  onChange={(checked) => handleInputChange('designServices.responsiveDesign', checked)}
                />
                <ServiceCheckbox
                  label="Brand Integration"
                  checked={contractData.designServices.brandIntegration}
                  onChange={(checked) => handleInputChange('designServices.brandIntegration', checked)}
                />
              </div>
            )}

            <ServiceCheckbox
              label="Website Development"
              checked={contractData.services.websiteDevelopment}
              onChange={(checked) => handleInputChange('services.websiteDevelopment', checked)}
              description="Frontend/backend development, CMS integration, database design"
            />

            {contractData.services.websiteDevelopment && (
              <div className="ml-8 space-y-2 p-4 bg-gray-50 rounded-lg">
                <ServiceCheckbox
                  label="Frontend Development"
                  checked={contractData.developmentServices.frontendDev}
                  onChange={(checked) => handleInputChange('developmentServices.frontendDev', checked)}
                />
                <ServiceCheckbox
                  label="Backend Development"
                  checked={contractData.developmentServices.backendDev}
                  onChange={(checked) => handleInputChange('developmentServices.backendDev', checked)}
                />
                <ServiceCheckbox
                  label="CMS Integration"
                  checked={contractData.developmentServices.cmsIntegration}
                  onChange={(checked) => handleInputChange('developmentServices.cmsIntegration', checked)}
                />
                <ServiceCheckbox
                  label="E-commerce Functionality"
                  checked={contractData.developmentServices.ecommerce}
                  onChange={(checked) => handleInputChange('developmentServices.ecommerce', checked)}
                />
              </div>
            )}

            <ServiceCheckbox
              label="Website Maintenance"
              checked={contractData.services.websiteMaintenance}
              onChange={(checked) => handleInputChange('services.websiteMaintenance', checked)}
              description="Regular updates, monitoring, technical support, backups"
            />

            {contractData.services.websiteMaintenance && (
              <div className="ml-8 space-y-2 p-4 bg-gray-50 rounded-lg">
                <ServiceCheckbox
                  label="Regular Updates & Security Patches"
                  checked={contractData.maintenanceServices.regularUpdates}
                  onChange={(checked) => handleInputChange('maintenanceServices.regularUpdates', checked)}
                />
                <ServiceCheckbox
                  label="Content Updates"
                  checked={contractData.maintenanceServices.contentUpdates}
                  onChange={(checked) => handleInputChange('maintenanceServices.contentUpdates', checked)}
                />
                <ServiceCheckbox
                  label="Performance Monitoring"
                  checked={contractData.maintenanceServices.performanceMonitoring}
                  onChange={(checked) => handleInputChange('maintenanceServices.performanceMonitoring', checked)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            onClick={generateContract}
            disabled={!contractData.clientName || !contractData.projectName}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            <span>Generate Contract</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderGeneratedContracts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <FileText className="mr-2" size={20} />
          Generated Contracts
        </h2>

        {generatedContracts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No contracts generated yet.</p>
            <p className="text-sm">Use the Contract Builder to create your first contract.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {generatedContracts.map(contract => (
              <div key={contract._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{contract.projectName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${contract.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        contract.status === 'sent_for_signing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                        {contract.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Client: {contract.clientName}</p>
                    <p className="text-gray-600 mb-1">Contract ID: {contract.contractId}</p>
                    <p className="text-gray-600 mb-1">Total: ${contract.totalCost}</p>
                    <p className="text-gray-600 text-sm">Created: {contract.createdDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openPreview(contract)}
                      className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye size={16} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => downloadPDF(contract)}
                      className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>
                    {contract.status === 'draft' && (
                      <button
                        onClick={() => sendForSigning(contract.contractId)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <Send size={16} />
                        <span>Send for Signing</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSigningPortal = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Users className="mr-2" size={20} />
          Contracts Pending Signature
        </h2>

        {signingContracts.filter(c => c.status === 'sent_for_signing').length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No contracts pending signature.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {signingContracts.filter(c => c.status === 'sent_for_signing').map(contract => (
              <div key={contract._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{contract.projectName}</h3>
                    <p className="text-gray-600 mb-1">Client: {contract.clientName}</p>
                    <p className="text-gray-600 mb-1">Signing URL:
                      <a href={contract.signableUrl} className="text-blue-600 hover:underline ml-2 text-sm">
                        {contract.signableUrl}
                      </a>
                    </p>
                    <p className="text-gray-600 mb-1">Sent: {contract.sentDate}</p>
                    <p className="text-gray-600 text-sm">Expires: {contract.expirationDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => simulateSignature(contract.contractId)}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      <Check size={16} />
                      <span>Simulate Signature</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSignedContracts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center">
          <Check className="mr-2" size={20} />
          Signed Contracts
        </h2>

        {signingContracts.filter(c => c.status === 'signed').length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Check size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No signed contracts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {signedContracts.map(contract => (
              <div key={contract._id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{contract.projectName}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        SIGNED
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Client: {contract.clientName}</p>
                    <p className="text-gray-600 mb-1">Contract ID: {contract.contractId}</p>
                    <p className="text-gray-600 mb-1">Total: ${contract.totalCost}</p>
                    <p className="text-gray-600 mb-1">Signed: {contract.signedDate}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openPreview(contract)}
                      className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => downloadPDF(contract)}
                      className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPreviewModal = () => {
    if (!previewModal.isOpen || !previewModal.contract) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
            <h2 className="text-xl font-semibold">Contract Preview - {previewModal.contract.projectName}</h2>
            <button
              onClick={closePreview}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            <div
              className="contract-content-isolated"
              dangerouslySetInnerHTML={{
                __html: previewModal.contract.content || generateContractContent(previewModal.contract.data)
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 flex-shrink-0">
            <button
              onClick={() => downloadPDF(previewModal.contract)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download size={16} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={closePreview}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">eA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">elgAtoAi</h1>
                <p className="text-gray-600 text-sm">Contract Management Dashboard</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">Dallas, TX</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'builder', label: 'Contract Builder', icon: Edit3 },
              { id: 'contracts', label: 'Generated Contracts', icon: FileText },
              { id: 'signing', label: 'E-Signing Portal', icon: Users },
              { id: 'signed', label: 'Signed Contracts', icon: Check }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'builder' && renderContractBuilder()}
        {activeTab === 'contracts' && renderGeneratedContracts()}
        {activeTab === 'signing' && renderSigningPortal()}
        {activeTab === 'signed' && renderSignedContracts()}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 sm:bottom-6">
        <button
          onClick={() => setActiveTab('builder')}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="New Contract"
        >
          <Edit3 size={24} />
        </button>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-4 sm:space-x-6">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Draft: {generatedContracts.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Pending: {signingContracts.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Signed: {signedContracts.length}</span>
              </span>
            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
              Auto-notifications • odmustafa@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {renderPreviewModal()}
    </div>
  );
};

// export default ContractDashboard;

export default function Home() {
  return <ContractDashboard />
}