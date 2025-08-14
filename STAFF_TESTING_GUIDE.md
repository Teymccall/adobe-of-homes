# Staff Management Testing Guide

## 🎯 **How to Test the Real Staff Management Flow**

### **Step 1: Create a Staff Account (Admin)**

1. **Login as Admin:**
   - Go to `/super-admin-login`
   - Login with your admin credentials

2. **Navigate to Staff Management:**
   - Go to Admin Dashboard
   - Click on "Staff Management" tab

3. **Create a Staff Account:**
   - Click "Add Staff Member" button
   - Fill in the form:
     - **Name**: John Doe
     - **Email**: `teststaff@example.com` (use a real email you can access)
     - **Phone**: +233 24 123 4567
     - **Location**: Accra, Ghana
     - **Role**: Staff
     - **Department**: Customer Support
     - **Permissions**: Select relevant permissions
   - Click "Create Staff Account"

4. **Check Email:**
   - The staff member will receive a password reset email
   - Click the link in the email to set a password

### **Step 2: Test Staff Login**

1. **Go to Staff Login:**
   - Navigate to `/staff-login`

2. **Login with Staff Credentials:**
   - **Email**: `teststaff@example.com`
   - **Password**: (the password you set via the reset link)

3. **Verify Access:**
   - Should redirect to `/staff-dashboard`
   - Should show staff-specific features

### **Step 3: Test Admin Features**

1. **Manage Staff Account:**
   - Go back to Admin Dashboard → Staff Management
   - Find the staff member you created
   - Test these features:
     - **Edit**: Update staff information
     - **Reset Password**: Send new password reset email
     - **Toggle Status**: Activate/suspend account
     - **Delete**: Remove staff account

### **Step 4: Test Different Roles**

Create accounts with different roles to test access levels:

- **Staff Role**: Basic staff access
- **Moderator Role**: Enhanced permissions
- **Admin Role**: Full administrative access

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Invalid Credentials" Error:**
   - Make sure you're using the email and password from the reset link
   - Don't use demo account credentials

2. **No Password Reset Email:**
   - Check spam folder
   - Verify email address is correct
   - Check Firebase Authentication settings

3. **Staff Can't Access Dashboard:**
   - Verify staff role is set correctly
   - Check if account is not suspended
   - Ensure staff has required permissions

### **Firebase Console Checks:**

1. **Authentication:**
   - Go to Firebase Console → Authentication → Users
   - Verify staff accounts are created

2. **Firestore:**
   - Go to Firebase Console → Firestore → Data
   - Check `users` collection for staff profiles

## 🎉 **Expected Results**

### **Admin Dashboard:**
- ✅ Can create staff accounts
- ✅ Can view all staff members
- ✅ Can edit staff information
- ✅ Can reset passwords
- ✅ Can suspend/activate accounts
- ✅ Can delete staff accounts

### **Staff Dashboard:**
- ✅ Staff can log in with their credentials
- ✅ Staff see appropriate features based on role
- ✅ Staff can view their profile
- ✅ Staff can access assigned permissions

### **Security:**
- ✅ Only staff members can access staff dashboard
- ✅ Role-based access control works
- ✅ Suspended accounts can't log in
- ✅ Password reset emails are sent automatically

---

**Note**: This is the real production flow. Staff accounts are created by administrators and staff members use their email + password to access the system. 