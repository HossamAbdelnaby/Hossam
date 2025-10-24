#!/bin/bash

# Database Management Script
# This script helps manage the database seeding process

echo "🗄️  Database Management Script"
echo "============================="
echo ""

# Function to show menu
show_menu() {
    echo "Please choose an option:"
    echo "1) Reset Database & Seed"
    echo "2) Seed Only (No Reset)"
    echo "3) Reset Only (No Seed)"
    echo "4) Generate Prisma Client"
    echo "5) Push Schema Changes"
    echo "6) Show Database Status"
    echo "7) Exit"
    echo ""
}

# Function to reset and seed
reset_and_seed() {
    echo "🧹 Resetting database and seeding..."
    npm run db:reset
    npm run db:seed
    echo "✅ Database reset and seeded successfully!"
}

# Function to seed only
seed_only() {
    echo "🌱 Seeding database..."
    npm run db:seed
    echo "✅ Database seeded successfully!"
}

# Function to reset only
reset_only() {
    echo "🧹 Resetting database..."
    npm run db:reset
    echo "✅ Database reset successfully!"
}

# Function to generate client
generate_client() {
    echo "🔧 Generating Prisma client..."
    npm run db:generate
    echo "✅ Prisma client generated successfully!"
}

# Function to push schema
push_schema() {
    echo "📤 Pushing schema changes..."
    npm run db:push
    echo "✅ Schema changes pushed successfully!"
}

# Function to show status
show_status() {
    echo "📊 Database Status:"
    echo "=================="
    
    if [ -f "db/custom.db" ]; then
        echo "✅ Database file exists"
        echo "📁 Location: db/custom.db"
        echo "📏 Size: $(du -h db/custom.db | cut -f1)"
    else
        echo "❌ Database file not found"
    fi
    
    echo ""
    echo "🔑 Login Credentials:"
    echo "Admin: admin@clashtournaments.com / password123"
    echo "Moderator: moderator@clashtournaments.com / password123"
    echo "User: john.doe@example.com / password123"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice (1-7): " choice
    
    case $choice in
        1)
            reset_and_seed
            echo ""
            ;;
        2)
            seed_only
            echo ""
            ;;
        3)
            reset_only
            echo ""
            ;;
        4)
            generate_client
            echo ""
            ;;
        5)
            push_schema
            echo ""
            ;;
        6)
            show_status
            echo ""
            ;;
        7)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1-7."
            echo ""
            ;;
    esac
done