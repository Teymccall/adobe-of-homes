# Firebase Indexes Setup Guide

## Index Errors Resolution

The application is currently experiencing Firebase index errors for composite queries. Here's how to fix them:

### 1. Properties Collection Index

**Error**: The query requires an index for properties collection with `isVerified`, `availability`, and `createdAt` fields.

**Solution**: Create a composite index in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `adobe-of-homes-81920`
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. Set up the index:
   - **Collection ID**: `properties`
   - **Fields**:
     - `isVerified` (Ascending)
     - `availability` (Ascending) 
     - `createdAt` (Descending)
   - **Query scope**: Collection

### 2. Users Collection Index

**Error**: The query requires an index for users collection with `role` and `createdAt` fields.

**Solution**: Create a composite index in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `adobe-of-homes-81920`
3. Go to Firestore Database → Indexes
4. Click "Create Index"
5. Set up the index:
   - **Collection ID**: `users`
   - **Fields**:
     - `role` (Ascending)
     - `createdAt` (Descending)
   - **Query scope**: Collection

### 3. Quick Fix Links

You can also use these direct links to create the indexes:

**Properties Index**:
```
https://console.firebase.google.com/v1/r/project/adobe-of-homes-81920/firestore/indexes?create_composite=Cldwcm9qZWN0cy9hZG9iZS1vZi1ob21lcy04MTkyMC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvcHJvcGVydGllcy9pbmRleGVzL18QARoQCgxhdmFpbGFiaWxpdHkQARoOCgppc1ZlcmlmaWVkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

**Users Index**:
```
https://console.firebase.google.com/v1/r/project/adobe-of-homes-81920/firestore/indexes?create_composite=ClJwcm9qZWN0cy9hZG9iZS1vZi1ob21lcy04MTkyMC9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdXNlcnMvaW5kZXhlcy9fEAEaCAoEcm9sZRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

### 4. After Creating Indexes

Once the indexes are created:

1. **Wait for indexing to complete** (usually takes a few minutes)
2. **Re-enable the orderBy clauses** in the code:
   - In `propertyService.ts`: Uncomment the `orderBy` and `limit` lines
   - In `StaffManagement.tsx`: Uncomment the `orderBy` line

### 5. Temporary Workaround

The current code has been modified to work without indexes by:
- Removing `orderBy` clauses from queries
- Sorting results in memory after fetching
- This works for small datasets but may not be optimal for large collections

### 6. Best Practices

- **Create indexes early** in development to avoid production issues
- **Monitor index usage** in Firebase Console
- **Consider query patterns** when designing data structure
- **Use compound indexes** for frequently used query combinations

### 7. Index Status

You can check index status in Firebase Console:
1. Go to Firestore Database → Indexes
2. Look for "Building" status
3. Wait for "Enabled" status before testing queries

---

**Note**: The application will work without these indexes using the current in-memory sorting approach, but creating the indexes will improve performance and enable proper server-side sorting. 