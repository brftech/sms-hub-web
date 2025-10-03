# Sales Dashboard

The Sales Dashboard (formerly Admin Dashboard) provides secure, hub-specific access to leads management and sales analytics for the SMS Hub application.

## Features

- **Hub-Specific Filtering**: All data automatically filtered by current hub
- **Sales Statistics**: View leads, email subscribers, SMS subscribers, and conversion rates
- **Subscription Monitoring**: Track customer subscriptions and tier usage
- **Leads Management**: Full CRUD operations with hub-branded UI elements
- **Data Export**: Export leads and subscriber data as JSON files
- **Branded UI**: "Add Lead" and action buttons styled with hub-specific colors
- **Recent Activity**: Monitor recent leads and activity by hub
- **Security Controls**: Secure access control for production environments
- **Responsive Design**: Optimized layout for desktop and mobile

## Subscription Tiers Monitored

The admin dashboard can monitor customers across all subscription tiers:

- **Starter ($79/month)**: 200 SMS/month, 50 contacts, 1 user
- **Core ($179/month)**: 1,500 SMS/month, 500 contacts, 3 users
- **Elite ($349/month)**: 8,000 SMS/month, 3,000 contacts, unlimited users
- **Enterprise**: 50,000+ SMS/month, unlimited features
- **VIP**: Unlimited everything

Dashboard displays subscription_tier and subscription_status from the customers table.

## Access Methods

### Development Environment

- Admin dashboard is automatically accessible in development mode
- No authentication required
- Floating admin button appears in bottom-left corner

### Production Environment

- Requires admin access code for authentication
- Access via URL parameter: `?admin=YOUR_ACCESS_CODE`
- Or use the floating admin button to enter access code
- Authentication token expires after 24 hours

## Environment Variables

Add to your `.env` file:

```bash
# Admin Dashboard Access
VITE_ADMIN_ACCESS_CODE=your_secure_admin_code_here
```

## Security Features

1. **Access Code Protection**: Admin access requires a secure code
2. **Token Expiration**: Authentication tokens expire after 24 hours
3. **Sensitive Data Masking**: Option to hide sensitive information
4. **URL Security**: Admin codes are removed from URL after authentication
5. **Production Restrictions**: Full authentication required in production

## Usage

### Accessing the Dashboard

1. **Development**: Click the red shield button in bottom-left corner
2. **Production**:
   - Visit `https://yoursite.com?admin=YOUR_ACCESS_CODE`
   - Or click the red shield button and enter access code when prompted

### Sales Dashboard Features

- **Hub Selection**: Switch between hubs to view hub-specific data
- **Sales Statistics Cards**: View key metrics (Total Leads, Email Subscribers, SMS Subscribers, Conversion Rate)
- **Leads Management**: Create, read, update, and delete leads with hub-branded UI
- **Filter by Timeframe**: View recent leads (24h, 7d, 30d, all time)
- **Add Lead Button**: Hub-branded button positioned next to section header
- **Export Data**: Download leads and subscriber data as JSON
- **Responsive Layout**: Optimized for all screen sizes
- **Debug Float**: Minimized by default for cleaner interface

## Hub-Specific Data

All data in the Sales Dashboard is automatically filtered by the current hub:

- **Leads**: Only shows leads for the selected hub
- **Customers**: Customer records with subscription tier and status
- **Email Subscribers**: Hub-specific email marketing lists
- **SMS Subscribers**: Hub-specific SMS marketing lists
- **Statistics**: Calculated per hub (conversion rates, totals, etc.)
- **Messages**: SMS message history and delivery status
- **Campaigns**: Marketing campaign information

## Security Considerations

- Keep the admin access code secure and change it regularly
- Monitor admin access logs if available
- Consider implementing additional security measures for sensitive environments
- Admin access tokens are stored in localStorage and expire automatically

## Troubleshooting

### Access Issues

- Verify the admin access code is correct
- Check if the token has expired (24-hour limit)
- Ensure environment variables are properly set

### Data Loading Issues

- Check Supabase connection and credentials
- Verify database table permissions
- Check browser console for error messages

## Development Notes

- Sales Dashboard is built with React 19 and TypeScript
- Uses Supabase for database connectivity with hub-specific filtering
- All queries include `hub_id` for proper multi-tenant data isolation
- Branded UI elements use hub-specific color schemes from `@sms-hub/utils`
- Implements responsive design for mobile and desktop
- Follows accessibility best practices
- Uses simple console-based logging (no external logger package)

## UI Branding

The Sales Dashboard implements hub-specific branding:

- **Gnymble** (Hub 1): Orange accent colors on buttons and highlights
- **PercyTech** (Hub 0): Red accent colors on buttons and highlights
- **PercyMD** (Hub 2): Red accent colors on buttons and highlights
- **PercyText** (Hub 3): Purple accent colors on buttons and highlights

All "Add Lead" buttons and modal action buttons use the current hub's color scheme for a consistent branded experience.
