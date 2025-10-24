# 🔑 Admin Accounts Documentation

## 📋 Available Admin Accounts

### 1. Super Admin Account
- **Email:** `admin@clashtournaments.com`
- **Username:** `admin`
- **Password:** `password123`
- **Role:** `SUPER_ADMIN`
- **Name:** Super Admin User
- **Permissions:** Full system access including:
  - User management (all roles)
  - System configuration
  - Database management
  - All admin features
  - Can create other admins

### 2. Regular Admin Account ⭐
- **Email:** `administrator@clashtournaments.com`
- **Username:** `administrator`
- **Password:** `password123`
- **Role:** `ADMIN`
- **Name:** Admin User
- **Permissions:** Administrative access including:
  - Tournament management
  - User management (non-admin users)
  - Payment management
  - Clan management
  - Service management
  - Most admin features
  - ❌ Cannot manage other admins
  - ❌ Cannot access system configuration

### 3. Moderator Account
- **Email:** `moderator@clashtournaments.com`
- **Username:** `moderator`
- **Password:** `password123`
- **Role:** `MODERATOR`
- **Name:** Moderator User
- **Permissions:** Limited administrative access:
  - Content moderation
  - User support
  - Tournament monitoring
  - Basic admin functions
  - ❌ Cannot manage users
  - ❌ Cannot access payments

## 🎯 Usage Recommendations

### For Development & Testing:
- Use **Regular Admin** (`administrator@clashtournaments.com`) for most admin testing
- Use **Super Admin** only when you need full system access
- Use **Moderator** for testing content moderation features

### For Production:
- Create separate admin accounts for different roles
- Use strong, unique passwords
- Enable 2FA where possible
- Regularly review admin access

## 🚀 Quick Access

### Regular Admin (Recommended for most use cases)
```bash
Email: administrator@clashtournaments.com
Password: password123
```

### Super Admin (Full system access)
```bash
Email: admin@clashtournaments.com
Password: password123
```

## 📱 Accessing Admin Features

1. **Login** with admin credentials
2. **Navigate** to `/admin` for admin dashboard
3. **Access** different admin sections:
   - `/admin/users` - User management
   - `/admin/tournaments` - Tournament management
   - `/admin/payments` - Payment management
   - `/admin/clans` - Clan management
   - `/admin/settings` - System settings (Super Admin only)

## 🔐 Security Notes

- **Never use these passwords in production!**
- **Change passwords before deploying to production**
- **Use strong, unique passwords**
- **Enable additional security measures**
- **Regularly review admin access logs**

## 🛠️ Creating Additional Admins

### Method 1: Use Super Admin Account
1. Login as Super Admin
2. Go to `/admin/users`
3. Create new user with ADMIN role

### Method 2: Use Script
```bash
node scripts/create-admin.js
```

### Method 3: Modify Seed File
Edit `prisma/seed.ts` and add more admin users, then run:
```bash
npm run db:seed
```

## 📊 Role Comparison

| Feature | Super Admin | Admin | Moderator |
|---------|-------------|-------|-----------|
| User Management | ✅ All | ✅ Non-admin | ❌ |
| Tournament Management | ✅ | ✅ | ✅ Monitor |
| Payment Management | ✅ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ |
| Admin Management | ✅ | ❌ | ❌ |
| Content Moderation | ✅ | ✅ | ✅ |
| Analytics | ✅ | ✅ | Limited |

## 🎉 Ready to Use!

Your regular admin account is now ready for use:
- **Email:** administrator@clashtournaments.com
- **Password:** password123
- **Role:** ADMIN (Regular)

This account provides most admin functionality while maintaining appropriate security boundaries!