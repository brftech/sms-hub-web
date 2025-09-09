# Clients Folder - Web App

This folder contains client-specific information, assets, and utilities for the Web app.

## Structure

```
clients/
├── assets/           # Client-specific asset files (logos, images, etc.)
├── types/           # TypeScript type definitions
├── utils/           # Utility functions for client management
├── data/            # Client data and configurations
└── README.md        # This documentation
```

## Usage

### Importing Types

```typescript
import { Client, ClientConfig, ClientAsset } from "@/clients";
```

### Using Utilities

```typescript
import { getClientById, getClientAssetPath, validateClient } from "@/clients";
```

### Accessing Client Data

```typescript
import { CLIENTS, getClientAssets } from "@/clients";

const gnymbleClient = getClientById(CLIENTS, "gnymble");
const gnymbleAssets = getClientAssets("gnymble");
```

## Client Assets

Client assets should be stored in the `assets/` directory and organized by client ID:

```
assets/
├── gnymble/
│   ├── gnymble-text-logo.svg
│   ├── gnymble-icon-logo.svg
│   └── gnymble-main-logo.png
├── percytech/
│   ├── percytech-text-logo.svg
│   └── percytech-icon-logo.svg
└── percymd/
    ├── percymd-text-logo.svg
    └── percymd-icon-logo.svg
```

## Adding New Clients

1. Add client data to `data/index.ts`
2. Add client assets to the `assets/` directory
3. Update the `CLIENT_ASSETS` object in `data/index.ts`
4. Test the client integration

## Features

- **Type Safety**: Full TypeScript support for all client data
- **Asset Management**: Utilities for handling client assets
- **Validation**: Client data validation helpers
- **Branding**: Client-specific branding configurations
- **Optimization**: Image optimization utilities

## Integration with Web App

The clients folder is designed to work seamlessly with the Web app's existing hub system and can be easily integrated with:

- Hub switching functionality
- Dynamic theming based on client
- Client-specific content rendering
- Asset optimization and loading
