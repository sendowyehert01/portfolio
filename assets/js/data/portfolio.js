(() => {
  'use strict';

  // Portfolio content from assets/documents/regalang_resume.pdf.
  const EMAIL = 'rsndo.galang@gmail.com';
  // Virtual filenames are independent of document-relative asset URLs.
  const RESUME_FILE = 'regalang_resume.pdf';
  const RESUME_URL = 'assets/documents/regalang_resume.pdf';
  const projects = [
    {
      name: 'Records Management System', slug: 'records-management', type: 'Internal records routing', organisation: 'Governance Commission for GOCCs',
      summary: 'Led development of the agency’s internal Records Management System. Digitized routing for 1,000+ incoming, outgoing, internal, and acknowledgement receipts monthly, cutting manual processing by 70%.',
      tags: ['Records routing', 'Workflow digitization'],
      slides: [
        { title: 'System overview', metric: '1,000+', metricLabel: 'RECEIPTS ROUTED MONTHLY', headline: 'Digitizing agency records.', points: ['Incoming and outgoing records', 'Internal and acknowledgement receipts', 'Digitized document routing'] },
        { title: 'Impact & delivery', metric: '70%', metricLabel: 'LESS MANUAL PROCESSING', headline: 'Improving records workflows.', points: ['Replaced manual routing with an internal application', 'Handled 1,000+ receipts per month', 'Led development of the agency system'] }
      ]
    },
    {
      name: 'ServiceDesk Management System', slug: 'servicedesk-management', type: 'HR service requests', organisation: 'Governance Commission for GOCCs',
      summary: 'Led development of an internal ServiceDesk Management System for HR service requests from 400+ internal and external employees. The application replaced manual, email-based requests.',
      tags: ['HR services', 'Request management'],
      slides: [
        { title: 'System overview', metric: '400+', metricLabel: 'INTERNAL & EXTERNAL EMPLOYEES', headline: 'HR requests in one system.', points: ['Created an internal HR service request application', 'Served internal and external employees', 'Led development for the agency'] },
        { title: 'Impact & delivery', metric: 'HR', metricLabel: 'SERVICE REQUEST WORKFLOW', headline: 'Digitizing service requests.', points: ['Replaced manual email-based requests', 'Supported service requests for 400+ employees', 'Built an internal agency management system'] }
      ]
    },
    {
      name: 'GCG Website', slug: 'gcg-website', type: 'Public-facing agency website', organisation: 'Governance Commission for GOCCs',
      summary: 'Contributed 10+ pages, features, and modules to the agency’s public-facing website, streamlining access to services and centralizing scattered information. Improved performance and maintainability through modular code and API integration, and reduced walk-in inquiries.',
      tags: ['Public services', 'API integration'],
      slides: [
        { title: 'Website overview', metric: '10+', metricLabel: 'PAGES / FEATURES / MODULES', headline: 'Making services accessible.', points: ['Contributed to the public-facing agency website', 'Streamlined access to agency services', 'Centralized previously scattered information'] },
        { title: 'Impact & delivery', metric: 'API', metricLabel: 'INTEGRATION & MODULAR CODE', headline: 'Improving the agency website.', points: ['Enhanced website performance and maintainability', 'Used modular code structure and API integration', 'Reduced walk-in inquiries'] }
      ]
    },
    {
      name: 'Membership Management System', slug: 'membership-management', type: 'Membership data management', organisation: 'Automobile Association of the Philippines',
      summary: 'Led development of a Membership Management System that stores members’ personal data and replaces spreadsheet-based tracking. Also enhanced payment method integration as a Junior Full-Stack Software Developer.',
      tags: ['Member records', 'Payment integration'],
      slides: [
        { title: 'System overview', metric: 'Members', metricLabel: 'PERSONAL DATA MANAGEMENT', headline: 'Organizing membership data.', points: ['Designed a membership data application', 'Replaced spreadsheet-based tracking', 'Led development for the Automobile Association'] },
        { title: 'Impact & delivery', metric: 'Payments', metricLabel: 'PAYMENT METHOD INTEGRATION', headline: 'Connecting membership workflows.', points: ['Enhanced payment method integration', 'Developed the full-stack membership application', 'Centralized members’ personal data'] }
      ]
    }
  ];
  const stack = [
    { id: 'frontend', name: 'Frontend', tools: [['HTML', '5'], ['CSS', '3'], ['JavaScript', 'JS'], ['TypeScript', 'TS'], ['React.js', 'Re'], ['Next.js', 'N'], ['Alpine.js', 'Al'], ['Vue.js', 'V'], ['Bootstrap', 'B'], ['Tailwind CSS', 'TW']] },
    { id: 'backend', name: 'Backend', tools: [['Node.js', 'No'], ['Express.js', 'ex'], ['Nest.js', 'Ne'], ['PHP', 'php'], ['Laravel', 'La']] },
    { id: 'databases', name: 'Databases', tools: [['MongoDB', 'Mo'], ['MySQL', 'My']] },
    { id: 'tools-practices', name: 'Tools & practices', tools: [['Git', 'Gi'], ['Postman', 'Po'], ['JIRA', 'Ji'], ['QA Testing', 'QA'], ['Agile/Scrum', 'Ag'], ['AWS', 'AWS']] },
    { id: 'ai-tools', name: 'AI tools & practices', tools: [['ChatGPT', 'AI'], ['Claude', 'Cl'], ['Codex', 'Cx'], ['Windsurf', 'Wi'], ['AI-assisted coding', 'AI'], ['Prompt engineering', 'PE'], ['AI-powered debugging', 'DB'], ['Code optimization', 'CO']] }
  ];

  // Shared by the ordered classic scripts so file:// previews also work.
  window.RosendoOS = {
    portfolio: { EMAIL, RESUME_FILE, RESUME_URL, projects, stack }
  };
})();
