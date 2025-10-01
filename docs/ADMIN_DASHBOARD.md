# Admin Dashboard

The Admin Dashboard provides secure access to database information and management tools for the SMS Hub application.

## Features

- **Database Statistics**: View table counts and record statistics
- **User Management**: Monitor user accounts and activity
- **Subscription Monitoring**: Track customer subscriptions and tier usage
- **Message Monitoring**: Track SMS message delivery and status
- **Data Export**: Export database tables as JSON files
- **Security Controls**: Hide/show sensitive data
- **Authentication**: Secure access control for production environments

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

### Dashboard Features

- **Refresh Data**: Click the refresh button to update all statistics
- **Export Data**: Click export buttons to download table data as JSON
- **Toggle Sensitive Data**: Use the eye icon to show/hide sensitive information
- **View Recent Activity**: Monitor recent users and messages

## Database Tables Monitored

- **Profiles**: User accounts and authentication data
- **Customers**: Customer records with subscription tier and status
- **Messages**: SMS message history and delivery status
- **Campaigns**: Marketing campaign information
- **Leads**: Lead capture and management
- **Subscribers**: Email and SMS subscriber lists

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

- Admin dashboard is built with React and TypeScript
- Uses Supabase for database connectivity
- Implements responsive design for mobile and desktop
- Follows accessibility best practices
