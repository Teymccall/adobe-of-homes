import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Test different Firebase configurations
const testConfigs = [
  {
    name: "Current Config (adobe-of-homes-81920)",
    config: {
      apiKey: "AIzaSyB69I8jFRazBAgt7ktXl3KiBz_IAeFWqAw",
      authDomain: "adobe-of-homes-81920.firebaseapp.com",
      databaseURL: "https://adobe-of-homes-81920-default-rtdb.firebaseio.com",
      projectId: "adobe-of-homes-81920",
      storageBucket: "adobe-of-homes-81920.appspot.com",
      messagingSenderId: "787532865176",
      appId: "1:787532865176:web:03fb16c1b84894a59efaed"
    }
  },
  {
    name: "Alternative Config (adobe-of-homes)",
    config: {
      apiKey: "AIzaSyB69I8jFRazBAgt7ktXl3KiBz_IAeFWqAw",
      authDomain: "adobe-of-homes.firebaseapp.com",
      databaseURL: "https://adobe-of-homes-default-rtdb.firebaseio.com",
      projectId: "adobe-of-homes",
      storageBucket: "adobe-of-homes.appspot.com",
      messagingSenderId: "787532865176",
      appId: "1:787532865176:web:03fb16c1b84894a59efaed"
    }
  }
];

const testFirebaseConnection = async (config: any, configName: string) => {
  try {
    console.log(`\n🔍 Testing: ${configName}`);
    
    // Initialize Firebase
    const app = initializeApp(config, `test-${Date.now()}`);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log(`✅ Firebase initialized for project: ${config.projectId}`);
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const userCredential = await signInWithEmailAndPassword(auth, 'teymccall@gmail.com', 'Admin123!@#');
    console.log(`✅ Authentication successful! User ID: ${userCredential.user.uid}`);
    
    // Test Firestore access
    console.log('📋 Testing Firestore access...');
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    console.log(`✅ Firestore accessible! Found ${usersSnapshot.size} users`);
    
    // List user profiles
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      console.log(`👤 User: ${userData.email} (${userData.role}) - Status: ${userData.status}`);
    });
    
    return { success: true, projectId: config.projectId };
    
  } catch (error: any) {
    console.log(`❌ Failed: ${error.code} - ${error.message}`);
    return { success: false, error: error.code };
  }
};

const main = async () => {
  console.log('🚀 Testing Firebase configurations...\n');
  
  for (const testConfig of testConfigs) {
    const result = await testFirebaseConnection(testConfig.config, testConfig.name);
    
    if (result.success) {
      console.log(`\n🎉 SUCCESS! Use this project: ${result.projectId}`);
      console.log('You can now login with: teymccall@gmail.com / Admin123!@#');
      break;
    }
  }
  
  console.log('\n📋 Summary:');
  console.log('- If you see "SUCCESS", use that Firebase project');
  console.log('- If all fail, check your Firebase Console for the correct project');
  console.log('- Make sure you have admin access to the project');
};

main().catch(console.error);


