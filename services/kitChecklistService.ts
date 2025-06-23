// import { collection, doc, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore';
// import { auth, db } from './firebase'; // Your Firebase config
// import { DEFAULT_CHECKLIST_ITEMS } from './utils/defaultChecklist';

// const seedChecklistForNewUser = async () => {
//   const userId = auth.currentUser?.uid;
//   if (!userId) return;

//   const checklistRef = collection(db, 'users', userId, 'checklistItems');
//   const existingItems = await getDocs(checklistRef);

//   // Only seed if the collection is empty
//   if (existingItems.empty) {
//     const batch = writeBatch(db);

//     DEFAULT_CHECKLIST_ITEMS.forEach(item => {
//       const docRef = doc(checklistRef); // Auto-generate ID
//       batch.set(docRef, {
//         ...item,
//         isChecked: false,
//         isPredefined: true, // Mark these as default
//         createdAt: serverTimestamp(),
//       });
//     });

//     await batch.commit();
//     console.log('Default checklist seeded for user.');
//   }
// };