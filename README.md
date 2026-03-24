# MoCampaign — Peer-to-Peer Fundraising Platform

A production-grade peer-to-peer fundraising platform built with **Next.js 14**, **TypeScript**, and **AWS serverless infrastructure**. Fundraisers can create campaign pages, share them publicly, and accept donations — all backed by DynamoDB with a clean, domain-driven architecture.

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Frontend       | Next.js 14 (App Router), React 18, Tailwind CSS |
| Language       | TypeScript (strict mode)                        |
| Backend API    | Next.js API Routes / AWS Lambda + API Gateway   |
| Database       | Amazon DynamoDB                                 |
| Storage        | Amazon S3                                       |
| Auth           | JWT (HS256) via `jose`                          |
| Infrastructure | AWS CloudFormation / CDK                        |
| CI/CD          | GitHub Actions                                  |
| Testing        | Jest, React Testing Library                     |
| CMS (planned)  | Sanity CMS                                      |

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Next.js App Router                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐  │
│  │ Server     │  │ Client     │  │ API Routes         │  │
│  │ Components │  │ Components │  │ (thin controllers) │  │
│  └────────────┘  └────────────┘  └────────┬───────────┘  │
│                                           │              │
│                                  ┌────────▼───────────┐  │
│                                  │ Service Layer      │  │
│                                  │ (business logic)   │  │
│                                  └────────┬───────────┘  │
│                                           │              │
│                                  ┌────────▼───────────┐  │
│                                  │ Repository Layer   │  │
│                                  │ (data access)      │  │
│                                  └────────┬───────────┘  │
└──────────────────────────────────────────┼───────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │  AWS DynamoDB / S3      │
                              └─────────────────────────┘
```

### Design Decisions

- **Domain-driven layering** — API routes are thin request/response handlers. All business logic lives in the **service layer**, which calls the **repository layer** for data access. This makes the codebase testable and easy to refactor.
- **Repository pattern** — DynamoDB access is fully abstracted. Switching to a different database would only require replacing the repository implementations.
- **Server components by default** — Client components are used only where interactivity is required (forms, auth state). Everything else is server-rendered for performance and SEO.
- **Centralised config** — All environment variables are accessed through `src/config/env.ts`, which validates required vars at startup rather than letting them fail silently at runtime.

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API route handlers
│   │   ├── campaigns/            # Campaign CRUD
│   │   ├── donations/            # Donation processing
│   │   └── users/                # Auth & profiles
│   ├── campaigns/[id]/           # Public campaign page
│   ├── campaigns/create/         # Campaign creation form
│   ├── dashboard/                # Fundraiser dashboard
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # Shared React components
│   └── ui/                       # Base UI components
├── config/                       # Environment configuration
├── lib/                          # Shared utilities
│   ├── api/                      # API client (for client components)
│   ├── auth/                     # JWT, password hashing, middleware
│   ├── db/                       # DynamoDB client
│   └── utils/                    # ID generation, API helpers
├── repositories/                 # Data access layer (DynamoDB)
├── services/                     # Business logic layer
└── types/                        # TypeScript type definitions

infrastructure/                   # AWS CloudFormation / CDK templates
__tests__/                        # Test suites
├── unit/                         # Service & utility tests
├── integration/                  # End-to-end API tests
└── components/                   # React component tests
.github/workflows/                # CI/CD pipeline
```

## API Endpoints

### Users

| Method | Endpoint              | Auth | Description        |
| ------ | --------------------- | ---- | ------------------ |
| POST   | `/api/users/register` | No   | Create new account |
| POST   | `/api/users/login`    | No   | Login, get JWT     |
| GET    | `/api/users/profile`  | Yes  | Get user profile   |

### Campaigns

| Method | Endpoint              | Auth | Description             |
| ------ | --------------------- | ---- | ----------------------- |
| GET    | `/api/campaigns`      | No   | List active campaigns   |
| POST   | `/api/campaigns`      | Yes  | Create a campaign       |
| GET    | `/api/campaigns/:id`  | No   | Get campaign details    |
| PATCH  | `/api/campaigns/:id`  | Yes  | Update own campaign     |

### Donations

| Method | Endpoint                             | Auth | Description                |
| ------ | ------------------------------------ | ---- | -------------------------- |
| GET    | `/api/donations?campaignId=:id`      | No   | List donations by campaign |
| POST   | `/api/donations`                     | No   | Make a donation            |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- AWS CLI (for DynamoDB local or deployed)
- Docker (optional, for DynamoDB Local)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/grishmadahal1/Fundraising-Campaign-Platform.git
   cd Fundraising-Campaign-Platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Start DynamoDB Local** (optional — for local development without AWS)

   ```bash
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start development server          |
| `npm run build`      | Production build                  |
| `npm run start`      | Start production server           |
| `npm run lint`       | Run ESLint                        |
| `npm run type-check` | Run TypeScript compiler check     |
| `npm run test`       | Run Jest test suite               |
| `npm run test:watch` | Run tests in watch mode           |
| `npm run test:coverage` | Run tests with coverage report |

## AWS Infrastructure

The platform is designed to run on AWS serverless infrastructure:

- **DynamoDB** — Three tables (`users`, `campaigns`, `donations`) with GSIs for query patterns
- **S3** — Asset storage for campaign images
- **Lambda + API Gateway** — Serverless API deployment (alternative to Next.js API routes)
- **CloudFormation** — Infrastructure as code in `infrastructure/`

See `infrastructure/` for CloudFormation templates and deployment instructions.

## Roadmap

- [x] Project scaffold and architecture
- [ ] Homepage (SSR)
- [ ] Authentication (register + login)
- [ ] Campaign creation and public pages
- [ ] Donation form and processing
- [ ] Fundraiser dashboard
- [ ] GitHub Actions CI/CD pipeline
- [ ] AWS CloudFormation infrastructure
- [ ] Test suite (unit, component, integration)
- [ ] Sanity CMS integration
