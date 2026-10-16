import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'AIzaSyBwr50G7urO-ZU_kFs16UH3kdqcv6ijGrs',
  authDomain: 'cv-project-7d38e.firebaseapp.com',
  projectId: 'cv-project-7d38e'
});

const db = getFirestore(app);

async function check() {
  for (const colName of ['cvs', 'users', 'admins', 'moderators', 'auditLogs']) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`Collection ${colName}: ${snap.size} docs`);
      snap.docs.slice(0, 5).forEach(d => console.log(`  - ${d.id}:`, d.data().title || d.data().email || d.data().fullName || d.data().role || ''));
    } catch (e) {
      console.log(`Collection ${colName}: error - ${e.message}`);
    }
  }
}

check().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
