#!/bin/bash

# Database Backup Script for SMS Hub
# This script creates a backup of your Supabase database before reset

echo "🔵 SMS Hub Database Backup Script"
echo "================================"

# Set variables
PROJECT_ID="vgpovgpwqkjnpnrjelyg"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./database-backups"
BACKUP_FILE="${BACKUP_DIR}/sms-hub-backup-${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

echo "📊 Creating database backup..."
echo "Project ID: ${PROJECT_ID}"
echo "Backup file: ${BACKUP_FILE}"
echo ""

# Option 1: Using Supabase CLI (recommended)
echo "🔹 Option 1: Using Supabase CLI"
echo "Run this command to create a backup:"
echo ""
echo "supabase db dump --project-ref ${PROJECT_ID} > ${BACKUP_FILE}"
echo ""

# Option 2: Using pg_dump directly (requires connection string)
echo "🔹 Option 2: Using pg_dump directly"
echo "If you have the database connection string, run:"
echo ""
echo "pg_dump 'your-connection-string' > ${BACKUP_FILE}"
echo ""

# Option 3: Export specific tables as CSV
echo "🔹 Option 3: Export critical tables as CSV (manual process)"
echo "1. Go to: https://supabase.com/dashboard/project/${PROJECT_ID}/editor"
echo "2. Run these queries and export as CSV:"
echo ""
echo "-- Export user profiles"
echo "SELECT * FROM user_profiles;"
echo ""
echo "-- Export companies"
echo "SELECT * FROM companies;"
echo ""
echo "-- Export customers"
echo "SELECT * FROM customers;"
echo ""
echo "-- Export phone numbers"
echo "SELECT * FROM phone_numbers;"
echo ""
echo "-- Export messages"
echo "SELECT * FROM messages;"
echo ""

echo "⚠️  IMPORTANT: Choose one of the above methods to create your backup"
echo "⚠️  After backup is complete, verify the backup file exists and has content"
echo ""
echo "✅ Once backup is verified, you can proceed with database reset"