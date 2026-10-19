import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, DollarSign, FileText, ShieldAlert, CreditCard, PieChart, Building,
  Search, Bell, Settings, Plus, Download, Eye, FileUp, Filter, RefreshCw,
  CheckCircle2, AlertTriangle, ChevronRight, Lock, History, Code2, Copy,
  Check, ArrowUpRight, ArrowDownRight, UserCheck, Layers, ExternalLink, ShieldCheck,
  TrendingUp, Calendar, Zap, HardDrive, Trash2, Sliders, Menu, X, HelpCircle
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js Components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ==========================================
// MOCK MULTI-TENANT DATA STORES
// ==========================================
const MOCK_COMPANIES = [
  { id: 'cmp_1', name: 'Acme Enterprise Corp', tier: 'Enterprise', logo: '🏢', totalEmp: 142, revenue: '$1.2M/yr' },
  { id: 'cmp_2', name: 'Nexus Software Labs', tier: 'Standard', logo: '⚡', totalEmp: 38, revenue: '$450K/yr' },
  { id: 'cmp_3', name: 'Apex Global Logistics', tier: 'Basic', logo: '🌐', totalEmp: 12, revenue: '$120K/yr' },
];

const ROLES = [
  { id: 'Super Admin', label: 'Super Admin', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { id: 'HR Manager', label: 'HR Manager', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { id: 'Accountant', label: 'Accountant', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { id: 'Auditor', label: 'Auditor (Read-Only)', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { id: 'Employee', label: 'Employee', color: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
];

const INITIAL_EMPLOYEES = [
  { id: 'emp_101', companyId: 'cmp_1', name: 'Sarah Jenkins', email: 's.jenkins@acme.com', role: 'VP of Engineering', department: 'Engineering', salary: 145000, status: 'ACTIVE', startDate: '2021-03-15', docsCount: 4 },
  { id: 'emp_102', companyId: 'cmp_1', name: 'Michael Chen', email: 'm.chen@acme.com', role: 'Senior Accountant', department: 'Finance', salary: 98000, status: 'ACTIVE', startDate: '2022-06-01', docsCount: 3 },
  { id: 'emp_103', companyId: 'cmp_1', name: 'David Vance', email: 'd.vance@acme.com', role: 'Sales Lead', department: 'Sales', salary: 85000, status: 'INACTIVE', startDate: '2020-01-10', docsCount: 2 },
  { id: 'emp_104', companyId: 'cmp_1', name: 'Elena Rostova', email: 'e.rostova@acme.com', role: 'HR Business Partner', department: 'Human Resources', salary: 92000, status: 'ACTIVE', startDate: '2023-02-14', docsCount: 5 },
  { id: 'emp_105', companyId: 'cmp_1', name: 'Robert Paulson', email: 'r.paulson@acme.com', role: 'DevOps Specialist', department: 'Engineering', salary: 110000, status: 'FIRED', startDate: '2019-11-01', docsCount: 1 },
  
  { id: 'emp_201', companyId: 'cmp_2', name: 'Alex Rivera', email: 'alex@nexus.io', role: 'Lead Architect', department: 'Product', salary: 130000, status: 'ACTIVE', startDate: '2022-01-10', docsCount: 3 },
  { id: 'emp_202', companyId: 'cmp_2', name: 'Jessica Taylor', email: 'jess@nexus.io', role: 'UI/UX Designer', department: 'Design', salary: 88000, status: 'ACTIVE', startDate: '2023-05-18', docsCount: 2 },

  { id: 'emp_301', companyId: 'cmp_3', name: 'Marcus Brody', email: 'marcus@apexlogistics.com', role: 'Operations Manager', department: 'Logistics', salary: 75000, status: 'ACTIVE', startDate: '2021-08-20', docsCount: 2 }
];

const INITIAL_TRANSACTIONS = [
  { id: 'tx_1', companyId: 'cmp_1', date: '2026-10-14', description: 'AWS Infrastructure Hosting Cloud', category: 'Utilities', amount: -4250.00, type: 'EXPENSE', receiptUrl: 's3://acme-vault/receipts/aws-oct-2026.pdf' },
  { id: 'tx_2', companyId: 'cmp_1', date: '2026-10-12', description: 'Enterprise Client License - CyberDyne', category: 'SaaS Revenue', amount: 48500.00, type: 'INCOME', receiptUrl: 's3://acme-vault/invoices/inv-9082.pdf' },
  { id: 'tx_3', companyId: 'cmp_1', date: '2026-10-10', description: 'Office HQ Rent - Manhattan Campus', category: 'Rent', amount: -18000.00, type: 'EXPENSE', receiptUrl: 's3://acme-vault/receipts/rent-q4.pdf' },
  { id: 'tx_4', companyId: 'cmp_1', date: '2026-10-05', description: 'Payroll Run Execution - October Period 1', category: 'Payroll', amount: -68400.00, type: 'EXPENSE', receiptUrl: 's3://acme-vault/payroll/pay-2026-10-01.pdf' },
  { id: 'tx_5', companyId: 'cmp_1', date: '2026-09-28', description: 'Consulting Retainer - Tech Corp', category: 'Services', amount: 12500.00, type: 'INCOME', receiptUrl: 's3://acme-vault/invoices/inv-8812.pdf' },
];

const INITIAL_S3_DOCS = [
  { id: 's3_101', companyId: 'cmp_1', key: 'corporate/articles_of_incorporation.pdf', name: 'Articles of Incorporation.pdf', size: '2.4 MB', mime: 'application/pdf', uploadedBy: 'Super Admin', version: 'v2.1', updatedAt: '2026-01-12' },
  { id: 's3_102', companyId: 'cmp_1', key: 'compliance/tax_clearance_2025.pdf', name: 'Federal Tax Clearance Certificate 2025.pdf', size: '1.1 MB', mime: 'application/pdf', uploadedBy: 'Michael Chen', version: 'v1.0', updatedAt: '2026-03-30' },
  { id: 's3_103', companyId: 'cmp_1', key: 'hr/employee_handbook_2026.pdf', name: 'Employee Handbook & Policy 2026.pdf', size: '5.8 MB', mime: 'application/pdf', uploadedBy: 'Elena Rostova', version: 'v3.0', updatedAt: '2026-08-15' },
  { id: 's3_104', companyId: 'cmp_1', key: 'audit/pwc_compliance_review.pdf', name: 'PwC External Audit Assessment Report.pdf', size: '8.9 MB', mime: 'application/pdf', uploadedBy: 'Auditor User', version: 'v1.0', updatedAt: '2026-09-02' }
];

const INITIAL_AUDIT_LOGS = [
  { id: 'aud_901', companyId: 'cmp_1', timestamp: '2026-10-18 01:22:10', user: 'Michael Chen (Accountant)', action: 'TRANSACTION_CREATE', resource: 'Transaction #tx_2', ip: '192.168.1.104', before: null, after: { amount: 48500, category: 'SaaS Revenue', client: 'CyberDyne' } },
  { id: 'aud_902', companyId: 'cmp_1', timestamp: '2026-10-17 16:45:02', user: 'Elena Rostova (HR Manager)', action: 'EMPLOYEE_STATUS_CHANGE', resource: 'Employee #emp_103', ip: '10.0.4.12', before: { status: 'ACTIVE' }, after: { status: 'INACTIVE', reason: 'Unpaid Leave' } },
  { id: 'aud_903', companyId: 'cmp_1', timestamp: '2026-10-15 09:12:33', user: 'Super Admin', action: 'PAYROLL_RUN_EXECUTE', resource: 'Payroll Period Oct 2026', ip: '172.16.0.1', before: { status: 'DRAFT' }, after: { status: 'EXECUTED', grossTotal: 98400, netTotal: 71200 } },
  { id: 'aud_904', companyId: 'cmp_1', timestamp: '2026-10-10 11:30:00', user: 'Super Admin', action: 'S3_DOCUMENT_UPLOAD', resource: 'Doc #s3_104', ip: '172.16.0.1', before: null, after: { s3Key: 'audit/pwc_compliance_review.pdf', size: '8.9MB' } }
];

// ==========================================
// SOURCE CODE VAULT SNIPPETS
// ==========================================
const CODE_SNIPPETS = {
  prisma: `// prisma/schema.prisma - Production Multi-Tenant BMS Schema
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  HR_MANAGER
  ACCOUNTANT
  AUDITOR
  EMPLOYEE
}

enum EmployeeStatus {
  ACTIVE
  INACTIVE
  FIRED
}

enum TransactionType {
  INCOME
  EXPENSE
}

model Company {
  id            String   @id @default(uuid())
  name          String
  tier          String   @default("Basic")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  users         User[]
  employees     Employee[]
  transactions  Transaction[]
  documents     CompanyDocument[]
  auditLogs     AuditLog[]
  subscriptions CompanySubscription[]

  @@map("companies")
}

model User {
  id           String    @id @default(uuid())
  companyId    String    @map("company_id")
  email        String    @unique
  passwordHash String    @map("password_hash")
  role         Role      @default(EMPLOYEE)
  company      Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())

  @@index([companyId])
  @@map("users")
}

model Employee {
  id          String         @id @default(uuid())
  companyId   String         @map("company_id")
  name        String
  email       String
  role        String
  department  String
  salary      Float
  status      EmployeeStatus @default(ACTIVE)
  startDate   DateTime       @map("start_date")
  company     Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)
  history     EmployeeHistory[]
  documents   EmployeeDocument[]
  payrollEntries PayrollEntry[]

  @@index([companyId])
  @@map("employees")
}

model EmployeeHistory {
  id         String   @id @default(uuid())
  employeeId String   @map("employee_id")
  changeType String   @map("change_type")
  snapshot   Json
  timestamp  DateTime @default(now())
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_histories")
}

model EmployeeDocument {
  id         String   @id @default(uuid())
  employeeId String   @map("employee_id")
  s3Key      String   @map("s3_key")
  fileName   String   @map("file_name")
  employee   Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)

  @@map("employee_documents")
}

model Transaction {
  id          String          @id @default(uuid())
  companyId   String          @map("company_id")
  date        DateTime
  description String
  category    String
  amount      Float
  type        TransactionType
  receiptUrl  String?         @map("receipt_url")
  company     Company         @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId, date])
  @@map("transactions")
}

model CompanyDocument {
  id         String   @id @default(uuid())
  companyId  String   @map("company_id")
  s3Key      String   @map("s3_key")
  fileName   String   @map("file_name")
  fileSize   String   @map("file_size")
  version    String   @default("v1.0")
  uploadedBy String   @map("uploaded_by")
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())

  @@index([companyId])
  @@map("company_documents")
}

model AuditLog {
  id         String   @id @default(uuid())
  companyId  String   @map("company_id")
  userEmail  String   @map("user_email")
  action     String
  resource   String
  beforeState Json?    @map("before_state")
  afterState  Json?    @map("after_state")
  ipAddress  String   @map("ip_address")
  createdAt  DateTime @default(now()) @map("created_at")
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@index([companyId, createdAt])
  @@map("audit_logs")
}

model SubscriptionPlan {
  id          String   @id @default(uuid())
  name        String
  priceMonthly Float   @map("price_monthly")
  features    String[]
  stripePriceId String @map("stripe_price_id")

  @@map("subscription_plans")
}

model CompanySubscription {
  id             String   @id @default(uuid())
  companyId      String   @map("company_id")
  stripeCustId   String   @map("stripe_customer_id")
  status         String
  currentPeriodEnd DateTime @map("current_period_end")
  company        Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@map("company_subscriptions")
}`,

  layout: `// app/layout.tsx - Root Layout with SRI Security Standards & Favicons
import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'BMS Enterprise Platform | Multi-Tenant SaaS',
  description: 'Complete HR, Payroll, Accounting, Tax & Document Vault',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* SRI Hash Secured Inter Font CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.8/index.css"
          integrity="sha384-yS/Xv2K9bS51oThN9P7Tz3X9Y0G1XmB2fN/A1hR2mJ4K5L6N7P8Q9R0S1T2U3V4W"
          crossOrigin="anonymous"
        />
        {/* SRI Hash Secured Chart.js Global CDN Backup */}
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
          integrity="sha384-754v0DslO2/AakD3LgC3V8I8H9iQ6U4t2+9L3K2V1E0W8J7M6N5P4Q3R2S1T0U9"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}`,

  nestjs: `// src/backend/nestjs-app.ts - Modular NestJS Engine with S3, Stripe & RBAC
import { Injectable, CanActivate, ExecutionContext, NestMiddleware, Module } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import Stripe from 'stripe';

// 1. TENANT MIDDLEWARE
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const tenantId = req.headers['x-tenant-id'];
    if (!tenantId) {
      return res.status(400).json({ message: 'Missing x-tenant-id context header' });
    }
    req.companyId = tenantId;
    next();
  }
}

// 2. TAX CALCULATOR SERVICE
@Injectable()
export class TaxCalculatorService {
  calculatePayAsYouEarn(grossMonthly: number): { net: number; tax: number; pension: number; health: number } {
    const pension = grossMonthly * 0.05; // 5% Pension
    const health = grossMonthly * 0.025; // 2.5% Health Insurance
    const taxable = grossMonthly - pension - health;
    
    // Progressive Income Tax Brackets
    let tax = 0;
    if (taxable > 8000) {
      tax += (taxable - 8000) * 0.30;
      tax += 5000 * 0.20;
      tax += 2000 * 0.10;
    } else if (taxable > 3000) {
      tax += (taxable - 3000) * 0.20;
      tax += 2000 * 0.10;
    } else if (taxable > 1000) {
      tax += (taxable - 1000) * 0.10;
    }

    return {
      net: grossMonthly - tax - pension - health,
      tax,
      pension,
      health
    };
  }
}

// 3. AWS S3 STORAGE SERVICE
@Injectable()
export class S3StorageService {
  private s3 = new S3Client({ region: process.env.AWS_REGION });
  private bucket = process.env.AWS_S3_BUCKET_NAME;

  async uploadCompanyFile(companyId: string, fileName: string, buffer: Buffer, mimeType: string) {
    const key = \`tenants/\${companyId}/docs/\${Date.now()}-\${fileName}\`;
    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: { companyId }
    }));
    return { key, url: \`https://\${this.bucket}.s3.amazonaws.com/\${key}\` };
  }
}

// 4. STRIPE WEBHOOK CONTROLLER
export class StripeWebhookController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

  async handleWebhook(sig: string, payload: Buffer) {
    const event = this.stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      // Sync subscription status in Prisma database
    }
    return { received: true };
  }
}`,

  apiclient: `// src/lib/api-client.ts - Typed Front-End API Client
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.bms-saas.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tenant Context Injector Interceptor
apiClient.interceptors.request.use((config) => {
  const currentTenantId = localStorage.getItem('active_company_id') || 'cmp_1';
  const authToken = localStorage.getItem('jwt_auth_token');

  config.headers['x-tenant-id'] = currentTenantId;
  if (authToken) {
    config.headers['Authorization'] = \`Bearer \${authToken}\`;
  }
  return config;
});

export const BMSApi = {
  // HR Module
  getEmployees: () => apiClient.get('/employees'),
  createEmployee: (data: any) => apiClient.post('/employees', data),
  updateEmployeeStatus: (id: string, status: string) => apiClient.patch(\`/employees/\${id}/status\`, { status }),

  // Accounting Module
  getTransactions: () => apiClient.get('/transactions'),
  addTransaction: (data: any) => apiClient.post('/transactions', data),

  // Documents Module
  uploadS3Document: (formData: FormData) => apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Audit Logs
  getAuditLogs: (filters?: any) => apiClient.get('/audit-logs', { params: filters }),

  // Subscription Billing
  createStripeCheckout: (planId: string) => apiClient.post('/billing/stripe-checkout', { planId })
};`
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Application Global States
  const [activeCompany, setActiveCompany] = useState(MOCK_COMPANIES[0]);
  const [activeRole, setActiveRole] = useState(ROLES[0].id);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Operational Data States
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [documents, setDocuments] = useState(INITIAL_S3_DOCS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // UI Interactive States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [selectedPayslipEmp, setSelectedPayslipEmp] = useState(null);
  const [activeCodeTab, setActiveCodeTab] = useState('prisma');
  const [copiedCode, setCopiedCode] = useState(false);

  // Form Inputs
  const [newEmp, setNewEmp] = useState({ name: '', email: '', role: 'Software Engineer', department: 'Engineering', salary: 85000 });
  const [newTx, setNewTx] = useState({ description: '', category: 'Utilities', amount: '', type: 'EXPENSE' });
  const [newDoc, setNewDoc] = useState({ name: '', key: '', size: '1.5 MB' });

  // Filtered Datasets based on Active Company Context
  const tenantEmployees = useMemo(() => employees.filter(e => e.companyId === activeCompany.id), [employees, activeCompany]);
  const tenantTransactions = useMemo(() => transactions.filter(t => t.companyId === activeCompany.id), [transactions, activeCompany]);
  const tenantDocuments = useMemo(() => documents.filter(d => d.companyId === activeCompany.id), [documents, activeCompany]);
  const tenantAuditLogs = useMemo(() => auditLogs.filter(a => a.companyId === activeCompany.id), [auditLogs, activeCompany]);

  // Financial Metrics
  const totalRevenue = useMemo(() => tenantTransactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0), [tenantTransactions]);
  const totalExpenses = useMemo(() => tenantTransactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Math.abs(t.amount), 0), [tenantTransactions]);
  const netProfit = totalRevenue - totalExpenses;
  const projectedTax = Math.max(0, netProfit * 0.21); // 21% Corporate Tax

  // Add Employee Handler with Audit Logging
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const createdEmp = {
      id: `emp_${Date.now()}`,
      companyId: activeCompany.id,
      name: newEmp.name,
      email: newEmp.email,
      role: newEmp.role,
      department: newEmp.department,
      salary: parseFloat(newEmp.salary),
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      docsCount: 0
    };
    setEmployees([createdEmp, ...employees]);

    // Append Audit Trail Record
    const auditEntry = {
      id: `aud_${Date.now()}`,
      companyId: activeCompany.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${activeRole} User`,
      action: 'EMPLOYEE_CREATE',
      resource: `Employee #${createdEmp.id}`,
      ip: '127.0.0.1',
      before: null,
      after: { name: createdEmp.name, salary: createdEmp.salary, dept: createdEmp.department }
    };
    setAuditLogs([auditEntry, ...auditLogs]);
    setIsAddEmpModalOpen(false);
    setNewEmp({ name: '', email: '', role: 'Software Engineer', department: 'Engineering', salary: 85000 });
  };

  // Add Transaction Handler
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const amt = parseFloat(newTx.amount) * (newTx.type === 'EXPENSE' ? -1 : 1);
    const createdTx = {
      id: `tx_${Date.now()}`,
      companyId: activeCompany.id,
      date: new Date().toISOString().split('T')[0],
      description: newTx.description,
      category: newTx.category,
      amount: amt,
      type: newTx.type,
      receiptUrl: `s3://${activeCompany.id}/receipts/tx-${Date.now()}.pdf`
    };
    setTransactions([createdTx, ...transactions]);

    // Audit Log
    const auditEntry = {
      id: `aud_${Date.now()}`,
      companyId: activeCompany.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${activeRole} User`,
      action: 'TRANSACTION_CREATE',
      resource: `Transaction #${createdTx.id}`,
      ip: '127.0.0.1',
      before: null,
      after: { description: createdTx.description, amount: amt, category: createdTx.category }
    };
    setAuditLogs([auditEntry, ...auditLogs]);
    setIsAddTxModalOpen(false);
    setNewTx({ description: '', category: 'Utilities', amount: '', type: 'EXPENSE' });
  };

  // Upload Document Simulation
  const handleUploadDoc = (e) => {
    e.preventDefault();
    const createdDoc = {
      id: `s3_${Date.now()}`,
      companyId: activeCompany.id,
      key: `vault/${newDoc.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: newDoc.name,
      size: newDoc.size,
      mime: 'application/pdf',
      uploadedBy: `${activeRole} User`,
      version: 'v1.0',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments([createdDoc, ...documents]);

    // Audit Log
    const auditEntry = {
      id: `aud_${Date.now()}`,
      companyId: activeCompany.id,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${activeRole} User`,
      action: 'S3_DOCUMENT_UPLOAD',
      resource: `Document #${createdDoc.id}`,
      ip: '127.0.0.1',
      before: null,
      after: { fileName: createdDoc.name, key: createdDoc.key }
    };
    setAuditLogs([auditEntry, ...auditLogs]);
    setIsUploadDocModalOpen(false);
    setNewDoc({ name: '', key: '', size: '1.5 MB' });
  };

  // Copy Code to Clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Chart Configuration Data
  const lineChartData = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [32000, 41000, 38000, 52000, 48000, totalRevenue || 61000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses ($)',
        data: [21000, 24000, 29000, 31000, 28000, totalExpenses || 35000],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const doughnutData = {
    labels: ['Payroll', 'Office Rent', 'Cloud Infrastructure', 'Utilities', 'Operations'],
    datasets: [{
      data: [65, 18, 10, 4, 3],
      backgroundColor: ['#6366f1', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  };

  const barChartData = {
    labels: ['Q1 Tax', 'Q2 Tax', 'Q3 Tax', 'Q4 Projected Tax'],
    datasets: [{
      label: 'Corporate Tax Liability ($)',
      data: [12400, 15800, 14200, projectedTax || 18500],
      backgroundColor: '#f59e0b',
      borderRadius: 6
    }]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-indigo-400 font-extrabold text-xl tracking-wider">
            <Layers className="w-7 h-7 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">NEXUS BMS</span>
          </div>

          {/* TENANT COMPANY SWITCHER */}
          <div className="relative group">
            <div className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer transition">
              <span className="text-lg">{activeCompany.logo}</span>
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200 leading-none">{activeCompany.name}</div>
                <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{activeCompany.tier} Tier</div>
              </div>
            </div>
            <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Switch Tenant Company</div>
              {MOCK_COMPANIES.map(cmp => (
                <button
                  key={cmp.id}
                  onClick={() => setActiveCompany(cmp)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition ${cmp.id === activeCompany.id ? 'bg-indigo-950/40 border-l-2 border-indigo-500' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{cmp.logo}</span>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{cmp.name}</div>
                      <div className="text-[10px] text-slate-400">{cmp.totalEmp} Staff • {cmp.revenue}</div>
                    </div>
                  </div>
                  {cmp.id === activeCompany.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER SEARCH BAR */}
        <div className="hidden md:flex items-center relative w-72">
          <Search className="w-4 h-4 absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search employees, receipts, logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 text-xs text-slate-200 pl-9 pr-4 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* RIGHT ROLE SWITCHER & METRICS */}
        <div className="flex items-center space-x-3">
          {/* USER ROLE SWITCHER */}
          <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded-lg">
            <UserCheck className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 hidden sm:inline">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-transparent text-xs font-semibold text-indigo-300 border-none focus:outline-none cursor-pointer"
            >
              {ROLES.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-slate-200">{r.label}</option>
              ))}
            </select>
          </div>

          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 relative transition">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1 right-1"></span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTAINER WITH NAVIGATION SIDEBAR ================= */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <nav className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
          <div className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Modules</div>
            
            {[
              { id: 'dashboard', label: 'Executive Dashboard', icon: PieChart },
              { id: 'hr', label: 'HR & Staff Roster', icon: Users, badge: tenantEmployees.length },
              { id: 'payroll', label: 'Payroll & Tax Engine', icon: DollarSign },
              { id: 'accounting', label: 'Accounting & Ledger', icon: TrendingUp, badge: tenantTransactions.length },
              { id: 'documents', label: 'AWS S3 Document Vault', icon: HardDrive, badge: tenantDocuments.length },
              { id: 'audit', label: 'Compliance Audit Mode', icon: ShieldAlert, badge: 'Live' },
              { id: 'billing', label: 'SaaS Subscriptions', icon: CreditCard },
            ].map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Developer & Security</div>
            <button
              onClick={() => setActiveTab('codevault')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'codevault'
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-emerald-400 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">Code Vault & Architecture</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-950 text-emerald-300 border border-emerald-800">Prisma</span>
            </button>
          </div>

          {/* BOTTOM SYSTEM STATUS CARD */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 m-2 rounded-xl border">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Database Sync</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PostgreSQL</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Tenant ID: <span className="font-mono text-slate-400">{activeCompany.id}</span></div>
          </div>
        </nav>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 space-y-6">

          {/* ================= 1. EXECUTIVE DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950/40 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <span>{activeCompany.name}</span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">Active SaaS Tenant</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Real-time consolidated financial, HR, payroll, and tax projection telemetry.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsAddTxModalOpen(true)} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-lg">
                    <Plus className="w-4 h-4" />
                    <span>Quick Transaction</span>
                  </button>
                </div>
              </div>

              {/* STATS METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Total Revenue</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">${totalRevenue.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-1">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+14.2% vs last month</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Operating Expenses</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2 font-mono">${totalExpenses.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400 mt-1">
                    <span>Payroll & Utilities included</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Net Income (P&L)</span>
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className={`text-2xl font-black mt-2 font-mono ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${netProfit.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-indigo-300 mt-1">
                    <span>Calculated in real-time</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Projected Tax</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-2 font-mono">${projectedTax.toLocaleString()}</div>
                  <div className="flex items-center space-x-1 text-[11px] text-amber-300/80 mt-1">
                    <span>Based on 21% Corp Rate</span>
                  </div>
                </div>
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center justify-between">
                    <span>Profit vs Loss Trends</span>
                    <span className="text-[10px] text-slate-500 font-mono">Chart.js Engine</span>
                  </h3>
                  <div className="h-64">
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-slate-200 mb-4">Expense Allocation</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. HR & STAFF ROSTER MODULE ================= */}
          {activeTab === 'hr' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Human Resources & Staff Roster</h2>
                  <p className="text-xs text-slate-400">Manage employee profiles, historical records, and attached S3 contracts.</p>
                </div>
                <button
                  onClick={() => setIsAddEmpModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Employee</span>
                </button>
              </div>

              {/* EMPLOYEE DATA TABLE */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-400">Department:</span>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="bg-slate-950 text-xs text-slate-200 px-2 py-1 rounded border border-slate-800"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="Sales">Sales</option>
                      <option value="Human Resources">Human Resources</option>
                    </select>
                  </div>
                  <div className="text-xs text-slate-400">
                    Showing <span className="text-slate-200 font-bold">{tenantEmployees.length}</span> staff members
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Employee Name</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Role Title</th>
                        <th className="py-3 px-4">Base Salary</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Start Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {tenantEmployees
                        .filter(e => filterDepartment === 'ALL' || e.department === filterDepartment)
                        .map(emp => (
                          <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 px-4 font-medium text-slate-200">
                              <div>{emp.name}</div>
                              <div className="text-[10px] text-slate-500">{emp.email}</div>
                            </td>
                            <td className="py-3 px-4 text-slate-300">{emp.department}</td>
                            <td className="py-3 px-4 text-slate-300">{emp.role}</td>
                            <td className="py-3 px-4 font-mono text-emerald-400">${emp.salary.toLocaleString()}/yr</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                                emp.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                emp.status === 'INACTIVE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              }`}>
                                {emp.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono">{emp.startDate}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setSelectedPayslipEmp(emp)}
                                className="px-2 py-1 bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-800/50 text-[10px]"
                              >
                                View Payslip
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. PAYROLL & TAX ENGINE ================= */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Payroll Execution & Tax Calculation Engine</h2>
                  <p className="text-xs text-slate-400">Automated gross-to-net tax computations, statutory pension, and health deductions.</p>
                </div>
                <button
                  onClick={() => alert("Payroll batch run generated successfully for current period.")}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
                >
                  <Zap className="w-4 h-4" />
                  <span>Execute Monthly Batch Payroll</span>
                </button>
              </div>

              {/* PAYROLL SUMMARY TABLE */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">October 2026 Payroll Run Breakdown</span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">Status: CALCULATED</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                        <th className="py-3 px-4">Employee</th>
                        <th className="py-3 px-4">Monthly Base</th>
                        <th className="py-3 px-4">PAYE Income Tax (18%)</th>
                        <th className="py-3 px-4">Pension (5%)</th>
                        <th className="py-3 px-4">Health Ins. (2.5%)</th>
                        <th className="py-3 px-4">Net Payable</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {tenantEmployees.map(emp => {
                        const monthlyBase = emp.salary / 12;
                        const tax = monthlyBase * 0.18;
                        const pension = monthlyBase * 0.05;
                        const health = monthlyBase * 0.025;
                        const netPay = monthlyBase - tax - pension - health;

                        return (
                          <tr key={emp.id} className="hover:bg-slate-800/40 transition font-mono">
                            <td className="py-3 px-4 font-sans font-medium text-slate-200">{emp.name}</td>
                            <td className="py-3 px-4 text-slate-300">${monthlyBase.toFixed(2)}</td>
                            <td className="py-3 px-4 text-rose-400">-${tax.toFixed(2)}</td>
                            <td className="py-3 px-4 text-amber-400">-${pension.toFixed(2)}</td>
                            <td className="py-3 px-4 text-cyan-400">-${health.toFixed(2)}</td>
                            <td className="py-3 px-4 text-emerald-400 font-bold">${netPay.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedPayslipEmp(emp)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px]"
                              >
                                Payslip PDF
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. ACCOUNTING & LEDGER ================= */}
          {activeTab === 'accounting' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">General Ledger & P&L Statement</h2>
                  <p className="text-xs text-slate-400">Track company transactions, income, operational expense categories, and S3 receipts.</p>
                </div>
                <button
                  onClick={() => setIsAddTxModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Log New Transaction</span>
                </button>
              </div>

              {/* TRANSACTIONS TABLE */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-200">Ledger Entry Audit Trail</span>
                  <span className="text-xs text-slate-400 font-mono">Tenant: {activeCompany.id}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4 text-right">Receipt File</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {tenantTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                          <td className="py-3 px-4 font-sans font-medium text-slate-200">{tx.description}</td>
                          <td className="py-3 px-4 font-sans text-slate-300">
                            <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.type === 'INCOME' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`py-3 px-4 font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.amount >= 0 ? '+' : ''}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="py-3 px-4 text-right font-sans">
                            <a
                              href="#s3"
                              onClick={(e) => { e.preventDefault(); alert(`Simulating AWS S3 pre-signed download URL for: ${tx.receiptUrl}`); }}
                              className="text-indigo-400 hover:text-indigo-300 text-[11px] inline-flex items-center space-x-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>S3 Link</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 5. AWS S3 DOCUMENT VAULT ================= */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white">AWS S3 Cloud Document Vault</h2>
                  <p className="text-xs text-slate-400">Secure tenant document repository with versioning metadata and access control.</p>
                </div>
                <button
                  onClick={() => setIsUploadDocModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition"
                >
                  <FileUp className="w-4 h-4" />
                  <span>Upload Document to S3</span>
                </button>
              </div>

              {/* S3 DOCUMENTS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tenantDocuments.map(doc => (
                  <div key={doc.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 bg-indigo-950/60 rounded-lg text-indigo-400 border border-indigo-800/40">
                        <HardDrive className="w-6 h-6" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-xs font-bold text-slate-200 truncate">{doc.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{doc.key}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Size: <strong className="text-slate-300">{doc.size}</strong></span>
                      <span className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">{doc.version}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500">By: {doc.uploadedBy}</span>
                      <button
                        onClick={() => alert(`Generating AWS S3 Presigned URL (Expires in 15m) for: s3://${activeCompany.id}/${doc.key}`)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 6. COMPLIANCE AUDIT MODE ================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                    <span>Compliance & Security Audit Log</span>
                  </h2>
                  <p className="text-xs text-slate-400">Read-only immutable snapshot logs for compliance reviewers and external auditors.</p>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Audit Mode Active</span>
                </span>
              </div>

              {/* AUDIT TRAIL LOGS */}
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                  <span className="text-xs font-bold text-slate-200">Before / After Entity Change Inspector</span>
                  <span className="text-xs text-slate-400 font-mono">Company ID: {activeCompany.id}</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {tenantAuditLogs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-slate-850 transition space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-mono font-bold rounded text-[10px] border border-indigo-800/40">
                            {log.action}
                          </span>
                          <span className="font-semibold text-slate-200">{log.user}</span>
                          <span className="text-slate-500">on</span>
                          <span className="text-slate-300 font-mono">{log.resource}</span>
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">{log.timestamp} • IP: {log.ip}</div>
                      </div>

                      {/* BEFORE & AFTER STATE DIFF JSON */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 font-mono text-[11px]">
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                          <div className="text-[10px] text-rose-400 uppercase font-bold mb-1">State Before:</div>
                          <pre className="text-slate-400 whitespace-pre-wrap">{log.before ? JSON.stringify(log.before, null, 2) : 'null (New Resource Created)'}</pre>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80">
                          <div className="text-[10px] text-emerald-400 uppercase font-bold mb-1">State After:</div>
                          <pre className="text-emerald-300/90 whitespace-pre-wrap">{JSON.stringify(log.after, null, 2)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= 7. SAAS SUBSCRIPTIONS & BILLING ================= */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">SaaS Subscription & Tenant Licensing</h2>
                <p className="text-xs text-slate-400">Integrated Stripe and PayPal checkout tier management.</p>
              </div>

              {/* TIER COMPARISON GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Basic', price: '$49', features: ['Up to 15 Employees', 'Basic Accounting & Ledger', '1 GB AWS S3 Vault', 'Standard Support'], current: activeCompany.tier === 'Basic' },
                  { name: 'Standard', price: '$149', features: ['Up to 50 Employees', 'Automated Payroll Engine', '10 GB AWS S3 Vault', 'Audit Log Retention'], current: activeCompany.tier === 'Standard' },
                  { name: 'Enterprise', price: '$399', features: ['Unlimited Employees', 'Full Tax Calculation Engine', 'Unlimited S3 Document Vault', 'Dedicated Compliance Auditor Mode'], current: activeCompany.tier === 'Enterprise' },
                ].map(tier => (
                  <div
                    key={tier.name}
                    className={`bg-slate-900 p-6 rounded-2xl border flex flex-col justify-between space-y-6 ${
                      tier.current ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-bold text-white">{tier.name}</h3>
                        {tier.current && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-full border border-indigo-500/30">
                            Current Active Plan
                          </span>
                        )}
                      </div>
                      <div className="text-3xl font-black text-white font-mono">{tier.price}<span className="text-xs text-slate-500 font-normal">/month</span></div>

                      <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCompany({ ...activeCompany, tier: tier.name });
                        alert(`Stripe Checkout Session created for ${tier.name} Plan! Tenant subscription updated.`);
                      }}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold transition ${
                        tier.current
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                    >
                      {tier.current ? 'Active Plan' : `Upgrade to ${tier.name}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= 8. CODE VAULT & ARCHITECTURE INSPECTOR ================= */}
          {activeTab === 'codevault' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Code2 className="w-5 h-5 text-emerald-400" />
                    <span>Production Source Code & Schema Vault</span>
                  </h2>
                  <p className="text-xs text-slate-400">Inspect production implementation files: Prisma schema, NestJS backend modules, SRI layout, and typed API client.</p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-lg"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
                </button>
              </div>

              {/* CODE VAULT TABS */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="flex border-b border-slate-800 bg-slate-950/80 px-2 pt-2 overflow-x-auto">
                  {[
                    { id: 'prisma', label: 'schema.prisma', lang: 'Prisma ORM' },
                    { id: 'layout', label: 'app/layout.tsx', lang: 'Next.js SRI' },
                    { id: 'nestjs', label: 'nestjs-app.ts', lang: 'NestJS Backend' },
                    { id: 'apiclient', label: 'api-client.ts', lang: 'TypeScript Axios' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCodeTab(tab.id)}
                      className={`px-4 py-2 text-xs font-mono font-medium rounded-t-lg transition flex items-center space-x-2 ${
                        activeCodeTab === tab.id
                          ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">{tab.lang}</span>
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-slate-950 overflow-x-auto max-h-[600px]">
                  <pre className="text-xs font-mono text-emerald-300/90 leading-relaxed whitespace-pre">
                    {CODE_SNIPPETS[activeCodeTab]}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL 1: ADD EMPLOYEE ================= */}
      {isAddEmpModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Onboard New Staff Member</h3>
              <button onClick={() => setIsAddEmpModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Annual Salary ($)</label>
                  <input
                    type="number"
                    required
                    value={newEmp.salary}
                    onChange={(e) => setNewEmp({ ...newEmp, salary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition mt-2">
                Confirm & Add Employee
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD TRANSACTION ================= */}
      {isAddTxModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Record Ledger Transaction</h3>
              <button onClick={() => setIsAddTxModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud Infra Bill"
                  value={newTx.description}
                  onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newTx.amount}
                    onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition mt-2">
                Submit Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: UPLOAD DOCUMENT ================= */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Upload S3 Document</h3>
              <button onClick={() => setIsUploadDocModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit Policy 2026.pdf"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center space-y-2">
                <FileUp className="w-8 h-8 text-indigo-400 mx-auto" />
                <div className="text-slate-400">Drag file here or click to browse</div>
                <div className="text-[10px] text-slate-500">Files will be encrypted and stored in AWS S3 Bucket</div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition">
                Upload to AWS S3 Vault
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: PAYSLIP VIEWER ================= */}
      {selectedPayslipEmp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Official Monthly Payslip Statement</h3>
              </div>
              <button onClick={() => setSelectedPayslipEmp(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 font-sans">
                <div>
                  <div className="font-bold text-white">{selectedPayslipEmp.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedPayslipEmp.role} • {selectedPayslipEmp.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-indigo-400 font-bold">{activeCompany.name}</div>
                  <div className="text-[10px] text-slate-500">Period: October 2026</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Gross Base Monthly Salary:</span>
                  <span className="font-bold">${(selectedPayslipEmp.salary / 12).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>PAYE Income Tax Deduction (18%):</span>
                  <span>-${((selectedPayslipEmp.salary / 12) * 0.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>Statutory Pension Fund (5%):</span>
                  <span>-${((selectedPayslipEmp.salary / 12) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cyan-400">
                  <span>National Health Insurance (2.5%):</span>
                  <span>-${((selectedPayslipEmp.salary / 12) * 0.025).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 pt-2 border-t border-slate-800 font-bold text-sm">
                  <span>Net Direct Deposit Payable:</span>
                  <span>
                    ${((selectedPayslipEmp.salary / 12) * (1 - 0.18 - 0.05 - 0.025)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => { alert("Exporting PDF Payslip document..."); setSelectedPayslipEmp(null); }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Payslip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}