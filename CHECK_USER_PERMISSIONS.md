# 🔍 User Permission Check Guide

## 🚨 **Current Issue:**
The frontend is getting 401 Unauthorized errors even though users exist in the database.

## 📊 **Users in Database:**
From your database, I can see these users:
- **mavocha** - Role: Admin (should have access)
- **Pritech** - Role: Admin (should have access)  
- **benetsonjustine1@gmail.com** - Role: Student (no admin access)
- **georgechisebe08@gmail.com** - Role: Student (no admin access)

## 🧪 **Testing Steps:**

### **Step 1: Test Debug Endpoints**
Visit these URLs in your browser while logged in:

1. **Check User Info:**
   ```
   http://127.0.0.1:8000/users/debug/user-info/
   ```
   This will show your authentication status and role.

2. **Test Admin Access:**
   ```
   http://127.0.0.1:8000/users/debug/admin-test/
   ```
   This will test if you have admin permissions.

### **Step 2: Check JWT Token**
Open browser developer tools (F12) and check:
1. **Local Storage:** Look for 'token' key
2. **Network Tab:** Check if Authorization header is being sent

### **Step 3: Manual User Permission Fix**
If the users don't have proper permissions, run this in Django shell:

```bash
cd backend
python manage.py shell
```

```python
from users.models import User

# Check current users
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}, Role: {user.role}, Staff: {user.is_staff}, Superuser: {user.is_superuser}")

# Fix admin users
admin_users = ['mavocha', 'Pritech']
for username in admin_users:
    try:
        user = User.objects.get(username=username)
        user.role = 'admin'
        user.is_staff = True
        user.save()
        print(f"✅ Fixed {username}: role={user.role}, is_staff={user.is_staff}")
    except User.DoesNotExist:
        print(f"❌ User {username} not found")

# Verify changes
print("\n--- After Changes ---")
for user in User.objects.filter(username__in=admin_users):
    print(f"Username: {user.username}, Role: {user.role}, Staff: {user.is_staff}")
```

### **Step 4: Test API Endpoints**
After fixing permissions, test these URLs:

1. **Dashboard Stats:**
   ```
   http://127.0.0.1:8000/api/admin/dashboard/stats/
   ```

2. **System Health:**
   ```
   http://127.0.0.1:8000/api/admin/system/health/
   ```

3. **Recent Activity:**
   ```
   http://127.0.0.1:8000/api/admin/activity/recent/
   ```

## 🔧 **Expected Results:**

### **If User Has Admin Access:**
```json
{
    "authenticated": true,
    "username": "mavocha",
    "role": "admin",
    "is_staff": true,
    "is_admin_user": true
}
```

### **If User Lacks Admin Access:**
```json
{
    "error": "Admin access required",
    "user_role": "student",
    "is_staff": false,
    "is_superuser": false
}
```

## 🎯 **Quick Fix Commands:**

### **Make User Admin via Django Admin:**
1. Go to: `http://127.0.0.1:8000/admin/`
2. Login with superuser account
3. Go to Users → Select user → Edit
4. Set Role to "Admin" and check "Staff status"

### **Create Superuser (if needed):**
```bash
python manage.py createsuperuser
```

## 📞 **Still Having Issues?**

1. **Check the debug endpoints first** - they'll tell you exactly what's wrong
2. **Verify JWT token is being sent** in browser network tab
3. **Make sure you're logged in as an admin user**
4. **Check Django server logs** for detailed error messages

The debug endpoints will show you exactly why authentication is failing! 🎯