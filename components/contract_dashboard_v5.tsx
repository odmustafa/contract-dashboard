"use client";

import React, { useState } from 'react';
import { Download, FileText, Send, Check, Edit3, Eye, Users, Settings, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ContractDashboard = () => {
  const [activeTab, setActiveTab] = useState('builder');
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [generatedContracts, setGeneratedContracts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signingContracts, setSigningContracts] = useState<any[]>([]);
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PARTIES</h2>
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PROJECT OVERVIEW</h2>
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PROJECT TIMELINE & MILESTONES</h2>
          <div style="margin-top: 20px;">
            ${generateMilestonesHTML(data.milestones)}
          </div>
        </div>
        ` : ''}

        ${data.includedSections.paymentTerms ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PAYMENT TERMS</h2>
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">CLIENT RESPONSIBILITIES</h2>
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">ELGATOAI RESPONSIBILITIES</h2>
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
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">INTELLECTUAL PROPERTY</h2>
          <p style="margin-top: 20px;">Upon full payment of all fees, the Client will own all custom work product created specifically for this project. elgAtoAi retains rights to general methodologies, techniques, and any pre-existing intellectual property. Third-party components remain subject to their respective licenses.</p>
        </div>
        ` : ''}

        ${data.includedSections.warranty ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">WARRANTY & SUPPORT</h2>
          <p style="margin-top: 20px;">elgAtoAi warrants that all services will be performed in a professional manner. We provide a 30-day warranty period for bug fixes on delivered work. This warranty does not cover issues arising from client modifications, third-party changes, or hosting environment changes.</p>
        </div>
        ` : ''}

        ${data.includedSections.termination ? `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">TERMINATION</h2>
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

  const generateContract = () => {
    const contractId = generateContractId();
    const contractContent = generateContractContent(contractData);

    const newContract = {
      id: contractId,
      clientName: contractData.clientName,
      projectName: contractData.projectName,
      totalCost: contractData.totalCost,
      createdDate: new Date().toLocaleDateString(),
      status: 'draft',
      signableUrl: `https://contracts.elgatoai.com/sign/${contractId}`,
      data: contractData,
      content: contractContent
    };

    setGeneratedContracts(prev => [newContract, ...prev]);
    setActiveTab('contracts');
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
      // Create a temporary div to render the contract content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contract.content || generateContractContent(contract.data);
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(tempDiv);

      // Download
      pdf.save(`Contract-${contract.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const sendForSigning = (contractId: string) => {
    const contract = generatedContracts.find(c => c.id === contractId);
    if (contract) {
      const signingContract = {
        ...contract,
        status: 'sent_for_signing',
        sentDate: new Date().toLocaleDateString(),
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };

      setSigningContracts(prev => [signingContract, ...prev]);
      setGeneratedContracts(prev => prev.map(c =>
        c.id === contractId ? { ...c, status: 'sent_for_signing' } : c
      ));

      setTimeout(() => {
        alert(`Contract sent to ${contract.data.clientEmail} and odmustafa@gmail.com`);
      }, 1000);
    }
  };

  const simulateSignature = (contractId: string) => {
    setSigningContracts(prev => prev.map(c =>
      c.id === contractId ? { ...c, status: 'signed', signedDate: new Date().toLocaleDateString() } : c
    ));

    setTimeout(() => {
      alert(`Contract signed! Notifications sent to client and odmustafa@gmail.com`);
    }, 1000);
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
              <div key={contract.id} className="border rounded-lg p-4 hover:bg-gray-50">
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
                    <p className="text-gray-600 mb-1">Contract ID: {contract.id}</p>
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
                        onClick={() => sendForSigning(contract.id)}
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
              <div key={contract.id} className="border rounded-lg p-4">
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
                      onClick={() => simulateSignature(contract.id)}
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
            {signingContracts.filter(c => c.status === 'signed').map(contract => (
              <div key={contract.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{contract.projectName}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        SIGNED
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">Client: {contract.clientName}</p>
                    <p className="text-gray-600 mb-1">Contract ID: {contract.id}</p>
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
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-semibold">Contract Preview - {previewModal.contract.projectName}</h2>
            <button
              onClick={closePreview}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div
              dangerouslySetInnerHTML={{
                __html: previewModal.contract.content || generateContractContent(previewModal.contract.data)
              }}
            />
          </div>
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
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
                <span>Draft: {generatedContracts.filter(c => c.status === 'draft').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Pending: {signingContracts.filter(c => c.status === 'sent_for_signing').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Signed: {signingContracts.filter(c => c.status === 'signed').length}</span>
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