# Auto Lead Collector — Production-Ready SaaS Application

**Auto Lead Collector** is an enterprise SaaS web platform built for freelancers, agencies, marketers, and sales teams to discover, filter, score, validate, and organize **publicly available business leads** in full compliance with global privacy regulations (GDPR, CCPA, CAN-SPAM, CASL).

---

## 🚀 Key Features

### 1. Full Advanced Multi-Filter Lead Search Engine (28 Dimensions)
- **Business & Niche**: Niche, Industry, Business Category, Subcategory, Business Type (Agency, Company, Freelancer, Store, Organization), Business Model (B2B, B2C), Business Stage (Startup, Established), Location Type (Local, Online, Hybrid).
- **Geographic & Location**: Country, Multiple Countries, Country Groups (North America, Europe, Asia Pacific, MENA), State / Region, City, District, Area, ZIP Code, Service Area.
- **Website & Tech Stack**: Website Available / Not Available, HTTPS / SSL Encryption, CMS / Platform (WordPress, Shopify, Wix, Squarespace, Webflow, Custom), Custom Domain vs. Free Subdomain.
- **Public Business Email**: Public Business Email Found, Email Type (Business Domain, Public Business Gmail, Public Business Outlook, Public Business Yahoo), Department (General, Info, Contact, Sales, Marketing, Support, Management).
- **Email Validation & Technical Signals**: Valid, Invalid, Risky, Unknown, Disposable domain blocker, Role-based address detection, Mail Exchange (MX) and DNS reachability checks.
- **Transparent Lead Scoring (0–100)**: Itemized point breakdown explaining *"Why this lead received this score"*, with quality tiers: High Quality (75+), Medium Quality (45–74), Low Quality (<45).
- **Company Size & Status**: Solo, Freelancer, 1–10, 11–50, 51–200, 201–500, 500+, Active, Inactive.
- **Multi-Channel Contact**: Phone, Contact Form, Verified Social Profiles (LinkedIn, Facebook, X / Twitter).
- **Deduplication Engine**: Normalized matching across company legal suffixes, domain URLs, and email addresses with canonical linking.
- **Search Query & Keywords**: Full text search, exact phrase matching, include and exclude keywords.
- **Visual Smart Combination Builder**: Compound **AND / OR / NOT** logic tree builder with recursive nested grouping.
- **Saved Filter Presets & Quick Filter Pills**: One-click toggles and custom preset management.
- **Real-Time Dynamic Result Counter**: Displays live counts of matching leads, websites, emails, valid MX, and duplicates removed.

---

### 2. 🛡 Public Business Data Compliance System
- **Strict Public Data Mandate**: Collects only publicly published business contact details. Strictly zero tolerance for private inboxes, hacked records, paywalls, or sensitive personal data.
- **Mandatory Compliance Confirmation Charter**: Enforces a 14-point legal confirmation modal before automated discovery pipelines can execute.
- **Traceability Guarantee**: Retains immutable Source URLs, Source Types, First Discovered, and Last Checked timestamps for full auditability.
- **Privacy Opt-Out Portal**: Self-service exclusion webform enabling businesses to permanently remove their email, domain, or company name from all discovery pipelines.
- **Live Compliance Audit Logging**: Tracks every search query and opt-out match against global exclusion registries.

---

### 3. Analytics, Export & Developer Automation
- **Executive SaaS Dashboard**: 6 KPI cards, 5 interactive SVG charts (Trend line, Country breakdown, Niche breakdown, Validation Donut, Quality histogram), and recent discovery feeds.
- **Export Center**: Background export generator supporting Microsoft Excel (.XLSX) and CSV formats with customizable column selection and progress stages.
- **REST API Automation Portal**: API Key generator with secret masking, token bucket rate limits, usage metrics, and interactive documentation with curl / JavaScript snippets.

---

## 🛠 Technology Architecture

- **Frontend**: React 18, TypeScript, Vite, Lucide React icons, Vanilla CSS Design System with dark/light theme switching and micro-animations.
- **Backend**: Node.js v20+, Express, TypeScript, REST API with CORS and security middlewares.
- **Database**: Relational repository preloaded with 420+ realistic synthetic public business leads across 20+ niches and 22 global metropolitan cities.
- **Engines & Services**:
  - `FilterEngine`: 28-dimension filtering and recursive AND/OR/NOT logic tree evaluator.
  - `LeadScoringService`: Explainable 7-factor transparent scoring algorithm.
  - `EmailValidator`: RFC 5322 syntax validation, DNS/MX technical signals, disposable domain blacklist, and role-based prefix detection.
  - `DeduplicationService`: Multi-key normalizer for company names, domains, and emails.
  - `ComplianceService`: Rules validator, exclusion registry, and audit logger.
  - `ExportService`: XLSX and CSV spreadsheet streaming generator.

---

## 🏃 Getting Started & Local Setup

### Prerequisites
- Node.js (v18 or v20+) installed on the machine.

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd 21-Email-Collect-Website

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Running Locally

```bash
# Build both server and client
npm run build --prefix server
npm run build --prefix client

# Start the unified production server
cd server
npm start
# Server will run at http://localhost:5000
```

For hot-reloading development:
```bash
# In terminal 1 (Backend API):
cd server && npm run dev

# In terminal 2 (Vite Frontend):
cd client && npm run dev
```

---

## 🧪 Running Automated Tests

```bash
# Run server service test suite
cd server
npm test
```

Test coverage includes:
- Deduplication name and domain normalization
- Email validation (syntax, disposable, role-based)
- Lead scoring point addition and breakdown explanation
- 28-dimension filter matching
- AND / OR / NOT compound logic tree evaluation
- Privacy opt-out exclusion enforcement

---

## 📜 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service healthcheck |
| `GET` | `/api/dashboard/stats` | KPI cards and chart aggregations |
| `POST` | `/api/filter-count` | Real-time matching leads counter |
| `POST` | `/api/leads/query` | Paginated, filtered, and sorted leads |
| `POST` | `/api/search/execute` | Execute 16-step lead discovery pipeline |
| `GET` | `/api/leads/:id` | Lead dossier and score breakdown |
| `PATCH` | `/api/leads/:id` | Update lead tags, notes, or saved status |
| `POST` | `/api/validate-email` | Single or bulk email technical validation |
| `GET` | `/api/presets` | Get saved filter presets |
| `POST` | `/api/presets` | Save new filter preset |
| `POST` | `/api/export` | Generate CSV / XLSX download stream |
| `GET` | `/api/api-keys` | List API keys and usage stats |
| `POST` | `/api/api-keys` | Generate new API secret key |
| `GET` | `/api/compliance/audit` | Compliance logs and opt-out registry |
| `POST` | `/api/compliance/opt-out` | Submit privacy removal request |
| `GET` | `/api/system/health` | Server telemetry and adapter statuses |

---

## ⚖️ Legal & Privacy Disclaimer
*Auto Lead Collector is engineered exclusively for discovering publicly listed business contact information from legitimate directories and business websites. It is strictly forbidden to use this software for harvesting private, non-public, or sensitive personal data, nor may it be used for unsolicited mass spam.*
