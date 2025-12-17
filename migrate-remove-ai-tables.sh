#!/bin/bash

# Migration Script for Removing ai_logs and ai_variants
# This script applies the database migration to remove the tables

echo "=========================================="
echo "AI Logs and Variants Removal Migration"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with DATABASE_URL before running this migration."
    echo ""
    echo "Example:"
    echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/next_hire_local\""
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ Error: DATABASE_URL not found in .env file!"
    echo "Please add DATABASE_URL to your .env file."
    exit 1
fi

echo "✓ .env file found with DATABASE_URL"
echo ""

# Show migration details
echo "This migration will:"
echo "  - Drop the ai_logs table"
echo "  - Drop the ai_variants table"
echo "  - Remove all foreign key constraints"
echo ""

# Confirm before proceeding
read -p "Do you want to proceed with the migration? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Migration cancelled."
    exit 0
fi

echo ""
echo "Applying migration..."
echo ""

# Apply the migration
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ Migration completed successfully!"
    echo "=========================================="
    echo ""
    echo "Tables removed:"
    echo "  - ai_logs"
    echo "  - ai_variants"
    echo ""
    echo "AI usage tracking is now handled by the analytics table."
    echo "See AI_REMOVAL_SUMMARY.md for full details."
else
    echo ""
    echo "=========================================="
    echo "❌ Migration failed!"
    echo "=========================================="
    echo ""
    echo "Please check the error message above and:"
    echo "  1. Verify your DATABASE_URL is correct"
    echo "  2. Ensure the database is running"
    echo "  3. Check database user permissions"
    exit 1
fi

