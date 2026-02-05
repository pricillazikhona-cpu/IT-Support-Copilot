
import { SOP } from './types';

export const SYSTEM_INSTRUCTION = `
You are a Tier-1 IT Support Copilot. Your goal is to help users troubleshoot IT issues using the company's Standard Operating Procedures (SOPs).

Workflows you implement based on official SOPs:
1. Password Resets & Account Lockouts (Security)
2. VPN Configuration & Wi-Fi Troubleshooting (Network)
3. Printer Setup & Clearing Paper Jams (Hardware)
4. Outlook Email Setup & Software Installation (Software)
5. Device Compliance & 2FA Setup (Security/Compliance)

When providing solutions:
- Be professional, concise, and follow the exact steps outlined in the SOPs.
- Always check the "Escalation" field in the SOP data. If a specific escalation condition is met (e.g., "email does not arrive within 10 minutes"), inform the user and offer to create a ticket.
- If a resolution is not possible after following the steps, or if the user indicates failure, you must offer to classify the issue for escalation.
- When asked to classify or when escalation is needed, output a JSON object with: category, priority, urgency, recommendedTeam, summary.
`;

export const KNOWLEDGE_BASE_DATA: SOP[] = [
  {
    id: 'sop-1',
    title: 'Password Reset SOP',
    category: 'Security',
    purpose: 'Guide users through resetting their account password securely.',
    steps: [
      'Navigate to the company login portal.',
      'Click Forgot Password.',
      'Enter your username or email.',
      'Check your email for a reset link.',
      'Follow the link and create a new password.',
      'Log in with the new password.'
    ],
    escalation: 'If the reset email does not arrive within 10 minutes, escalate to IT Support Tier-2.',
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-2',
    title: 'VPN Configuration SOP',
    category: 'Network',
    purpose: 'Establish a secure remote connection to the corporate network.',
    steps: [
      'Open the VPN client.',
      'Enter the VPN server address.',
      'Log in with company credentials.',
      'Verify connection status shows Connected.',
      'Test access to internal resources.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-3',
    title: 'Printer Setup SOP',
    category: 'Hardware',
    purpose: 'Install and configure network printers for office use.',
    steps: [
      'Connect printer to power and network.',
      'On PC, go to Settings → Devices → Printers & Scanners.',
      'Click Add a printer.',
      'Select the printer from the list.',
      'Install drivers if prompted.',
      'Print a test page.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-4',
    title: 'Outlook Email Setup SOP',
    category: 'Software',
    purpose: 'Configure Microsoft Outlook for company email accounts.',
    steps: [
      'Open Outlook.',
      'Go to File → Add Account.',
      'Enter company email address.',
      'Enter password when prompted.',
      'Allow auto-configuration to be completed.',
      'Send a test email.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-5',
    title: 'Device Compliance SOP',
    category: 'Security',
    purpose: 'Ensure personal and company devices meet security standards.',
    steps: [
      'Open Company Portal app.',
      'Sign in with company credentials.',
      'Check compliance status.',
      'Resolve flagged issues (update OS, enable encryption).',
      'Re-sync device.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-6',
    title: 'Account Lockout SOP',
    category: 'Security',
    purpose: 'Process for unlocking domain accounts for authenticated users.',
    steps: [
      'Verify user identity via security questions.',
      'Unlock account in Active Directory.',
      'Reset password if required.',
      'Inform user of new login credentials.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-7',
    title: 'Software Installation SOP',
    category: 'Software',
    purpose: 'Standard procedure for installing approved enterprise applications.',
    steps: [
      'Open Company Portal or approved software center.',
      'Search for required application.',
      'Click Install.',
      'Wait for installation to be completed.',
      'Verify application launches correctly.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-8',
    title: 'Wi-Fi Troubleshooting SOP',
    category: 'Network',
    purpose: 'Diagnose and resolve wireless connectivity issues.',
    steps: [
      'Check Wi-Fi is enabled on device.',
      'Verify connection to correct SSID.',
      'Forget and reconnect to network.',
      'Restart router if at home.',
      'Test connectivity with another device.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-9',
    title: 'Printer Jam SOP',
    category: 'Hardware',
    purpose: 'Safely clear mechanical paper obstructions from office printers.',
    steps: [
      'Turn off printer.',
      'Open printer access panels.',
      'Remove jammed paper carefully.',
      'Close panels and restart printer.',
      'Print a test page.'
    ],
    lastUpdated: '2024-05-20'
  },
  {
    id: 'sop-10',
    title: 'Two-Factor Authentication (2FA) Setup SOP',
    category: 'Security',
    purpose: 'Enable multi-factor authentication for enhanced account security.',
    steps: [
      'Log in to company account settings.',
      'Navigate to Security → Two-Factor Authentication.',
      'Choose method (SMS, Authenticator App).',
      'Register device.',
      'Test login with 2FA enabled.'
    ],
    lastUpdated: '2024-05-20'
  }
];
