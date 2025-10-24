# Database Seeding

This directory contains the database seeding script for the Clash of Clans Tournament Platform.

## 📁 Files

- `seed.ts` - Main seeding script that populates the database with sample data

## 🚀 Usage

### Run the Seed Script

```bash
npm run db:seed
```

### Reset and Seed Database

```bash
npm run db:reset
npm run db:seed
```

## 📊 Data Created

The seed script creates the following data:

### 👥 Users (9 total)
- **Admin Users:**
  - `admin@clashtournaments.com` / `password123` (Super Admin)
  - `administrator@clashtournaments.com` / `password123` (Regular Admin)
  - `moderator@clashtournaments.com` / `password123` (Moderator)

- **Regular Users:**
  - `john.doe@example.com` / `password123` (Tournament Organizer)
  - `sarah.smith@example.com` / `password123` (Clan Leader)
  - `mike.wilson@example.com` / `password123` (Pusher/Player for Hire)
  - `emma.brown@example.com` / `password123` (CWL Manager)
  - `alex.johnson@example.com` / `password123` (Team Captain)
  - `lisa.davis@example.com` / `password123` (Base Designer)

### 💰 Tournament Packages (4 total)
- **Free Package** ($0) - Basic features for beginners
- **Graphics Package** ($29) - Professional tournaments with custom graphics
- **Discord Package** ($49) - Complete solution with Discord integration
- **Full Management** ($99) - Premium experience with complete support

### ⚔️ Pushers (3 total)
- Mike Wilson - 5400 trophies, $50 per session
- Emma Brown - 6200 trophies, $75 per session
- Lisa Davis - 4800 trophies, $40 per session

### 🏰 Clans (3 total)
- **Elite Warriors** - Level 3 CWL, $20 payment, 2 members needed
- **Dragon Legends** - Level 2 CWL, $15 payment, 3 members needed
- **Phoenix Rising** - Level 4 CWL, $25 payment, 5 members needed

### 🏆 Tournaments (4 total)
- **Weekend Warriors Championship** - $500 prize, Registration Open
- **Pro League Spring Split** - $2000 prize, Registration Open
- **Community Cup** - $100 prize, Free tournament, Registration Open
- **Masters Invitational** - $5000 prize, In Progress

### 🛠️ Services (4 total)
- Base Analysis & Review - $25
- Custom Base Design - $45
- Attack Strategy Training - $35
- War League Strategy - $100

### 👨‍👩‍👧‍👦 Teams (4 total)
- Elite Squad, Dragon Force, Phoenix Team, Warriors United

### 💬 Messages (3 total)
Sample chat messages between users and pushers

### 🔔 Notifications (4 total)
Various notification types (tournament updates, contracts, payments, etc.)

### 📰 News (3 total)
Sample news articles and announcements

### 💳 Payments (4 total)
Sample payment records for tournaments, services, and contracts

### 📋 Clan Applications (2 total)
Sample applications to join clans

## 🎯 Features Demonstrated

The seed data demonstrates all major platform features:

1. **User Management** - Different user roles and permissions
2. **Tournament System** - Various tournament types and statuses
3. **Pusher Services** - Player hiring marketplace
4. **Clan Management** - CWL clan recruitment and management
5. **Payment Processing** - Multiple payment methods and statuses
6. **Communication** - Chat system and notifications
7. **Service Marketplace** - Base analysis and coaching services
8. **Admin Features** - Configuration and logging

## 🛠️ Development Notes

- The seed script only cleans data in development environment
- All passwords are hashed using bcrypt
- Images referenced in the seed should be placed in `/public/uploads/`
- The script creates realistic relationships between all data entities
- Timestamps are set to show realistic data progression

## 🔄 Resetting Data

To completely reset the database and start fresh:

```bash
# Delete the database file
rm -f db/custom.db

# Push the schema and seed
npm run db:push
npm run db:seed
```

## 📝 Customization

You can modify the `seed.ts` file to:
- Add more sample data
- Change user credentials
- Modify tournament details
- Adjust pricing and payment information
- Create different scenarios for testing

## 🚨 Important

- **Never use these credentials in production!**
- This seed data is for development and testing only
- Always use strong, unique passwords in production
- Consider environment-specific seeding for different deployment stages