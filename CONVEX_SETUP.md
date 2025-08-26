# Convex Database Setup Guide

This project uses Convex as the backend database for persistent contract storage. Follow this guide to set up Convex for both development and production.

## Development Setup (Already Configured)

The project is already configured for local development:

1. **Convex is installed** and configured
2. **Local backend** runs on `http://127.0.0.1:3210`
3. **Dashboard** available at `http://127.0.0.1:6790/?d=anonymous-contract-dashboard`
4. **Environment variables** are set in `.env.local`

### Running Development Environment

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start Next.js development server
npm run dev
```

## Production Setup

For production deployment, you'll need to:

### 1. Create a Convex Account

```bash
npx convex login
```

### 2. Create Production Deployment

```bash
npx convex deploy --prod
```

### 3. Update Environment Variables

After creating a production deployment, update your environment variables:

**For Vercel:**
1. Go to your Vercel project settings
2. Add these environment variables:
   - `CONVEX_DEPLOYMENT`: Your production deployment name
   - `NEXT_PUBLIC_CONVEX_URL`: Your production Convex URL

**For other platforms:**
Update your `.env.production` or platform-specific environment configuration.

## Database Schema

The contracts table includes:

### Core Fields
- `contractId`: Unique contract identifier
- `status`: "draft" | "sent_for_signing" | "signed"
- `content`: Generated HTML contract content

### Client Information
- `clientName`, `clientEmail`, `clientPhone`
- `clientCompany`, `clientAddress`, `clientCity`, `clientState`, `clientZip`

### Project Details
- `projectName`, `projectDescription`, `totalCost`
- `contractDate`, `contractNumber`

### Services & Configuration
- `services`: Selected service categories
- `designServices`, `developmentServices`, `maintenanceServices`
- `milestones`: Project timeline and payments
- `includedSections`: Contract sections to include

### Timestamps
- `createdAt`, `updatedAt`, `createdDate`
- `sentDate`, `signedDate`, `expirationDate`

## Available Functions

### Queries
- `getContracts()`: Get all contracts
- `getContractsByStatus(status)`: Filter by status
- `getContractById(id)`: Get specific contract

### Mutations
- `createContract(data)`: Create new contract
- `updateContractStatus(id, status, dates)`: Update contract status
- `deleteContract(id)`: Delete contract

## Features

✅ **Persistent Storage**: Contracts survive page refreshes  
✅ **Real-time Updates**: Changes sync across all tabs  
✅ **Status Management**: Draft → Sent for Signing → Signed workflow  
✅ **Search & Filtering**: Efficient queries with indexes  
✅ **Type Safety**: Full TypeScript support  

## Troubleshooting

### Local Development Issues

1. **Port 3210 in use**: Kill existing Convex process
   ```bash
   lsof -ti:3210 | xargs kill
   npx convex dev
   ```

2. **Functions not updating**: Check Convex terminal for errors

3. **Environment variables**: Ensure `.env.local` has correct URLs

### Production Issues

1. **Deployment fails**: Check Convex dashboard for errors
2. **Environment variables**: Verify production URLs are correct
3. **CORS issues**: Ensure domain is whitelisted in Convex dashboard

## Dashboard Access

- **Development**: http://127.0.0.1:6790/?d=anonymous-contract-dashboard
- **Production**: Available through Convex dashboard after login

## Support

- Convex Documentation: https://docs.convex.dev
- Community: https://convex.dev/community
- Support: support@convex.dev
