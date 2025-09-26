# Client Assets Directory

This directory contains all client-specific assets organized by client folders. Each client has their own subdirectory with their branding materials.

## Directory Structure

```
assets/
├── dons-burlingame/
│   └── dons-burlingame-logo.png
├── harlem-cigar/
│   └── harlem-cigar-logo.png
├── michaels-tobacco/
│   └── michaels-logo.png
├── 1st-round-ammo/
│   └── 1st-round-ammo-logo.png
└── README.md
```

## How Client Assets Are Handled

### 1. **Asset Organization**

- Each client has a dedicated folder: `/assets/{client-id}/`
- Assets are named consistently: `{client-id}-logo.png`
- All assets are imported in `clientData.tsx` and referenced by client ID

### 2. **Dynamic Asset Loading**

The new dynamic client system automatically loads the correct assets based on the client ID:

```tsx
// In clientData.tsx
import donsBurlingameLogo from "@sms-hub/ui/assets/dons-burlingame-logo.png";
import harlemCigarLogo from "@sms-hub/ui/assets/harlem-cigar-logo.png";
// ... other imports

export const clientData = {
  donsbt: {
    logo: donsBurlingameLogo,
    // ... other data
  },
  harlemCigar: {
    logo: harlemCigarLogo,
    // ... other data
  },
};
```

### 3. **Adding New Client Assets**

To add assets for a new client:

1. **Create client folder**: `/assets/new-client/`
2. **Add assets**: `new-client-logo.png`, etc.
3. **Import in clientData.tsx**:
   ```tsx
   import newClientLogo from "@sms-hub/ui/assets/new-client-logo.png";
   ```
4. **Add to clientData object**:
   ```tsx
   newClient: {
     id: "newClient",
     logo: newClientLogo,
     // ... other data
   }
   ```

### 4. **Asset Guidelines**

#### **Logo Requirements**

- **Format**: PNG with transparent background
- **Size**: Minimum 400x400px, scalable vector preferred
- **Naming**: `{client-id}-logo.png`
- **Quality**: High resolution for web and print use

#### **File Organization**

- Keep assets in client-specific folders
- Use descriptive, consistent naming
- Include brand guidelines in client folders if needed
- Maintain version control for asset updates

### 5. **Current Clients**

| Client           | Folder              | Logo File                  | Industry              |
| ---------------- | ------------------- | -------------------------- | --------------------- |
| Dons Burlingame  | `dons-burlingame/`  | `dons-burlingame-logo.png` | Cigars & Tobacco      |
| Harlem Cigar     | `harlem-cigar/`     | `harlem-cigar-logo.png`    | Premium Cigars        |
| Michaels Tobacco | `michaels-tobacco/` | `michaels-logo.png`        | Cigar & Tobacco       |
| 1st Round Ammo   | `1st-round-ammo/`   | `1st-round-ammo-logo.png`  | Ammunition & Firearms |

### 6. **Usage in Components**

Assets are automatically used in the dynamic client system:

```tsx
// ClientPage.tsx automatically uses the correct logo
<ClientPageTemplate
  clientLogo={client.logo} // Automatically loads correct asset
  // ... other props
/>
```

This system ensures:

- **Consistent branding** across all client pages
- **Easy maintenance** - update assets in one place
- **Scalable structure** - add new clients without code changes
- **Type safety** - TypeScript ensures correct asset references
