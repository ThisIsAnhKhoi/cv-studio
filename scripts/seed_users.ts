import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBwr50G7urO-ZU_kFs16UH3kdqcv6ijGrs',
  authDomain: 'cv-project-7d38e.firebaseapp.com',
  projectId: 'cv-project-7d38e',
  storageBucket: 'cv-project-7d38e.firebasestorage.app',
  messagingSenderId: '516814610748',
  appId: '1:516814610748:web:8b4325d5372c7cde43fe39',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SAMPLE_USERS = [
  {
    uid: 'hDXxqhdYElbROoO40aJPOudn3mx2',
    email: 'thisisanhkhoi@gmail.com',
    displayName: 'Trần Anh Khôi (Super Admin)',
    role: 'superadmin',
    status: 'active',
    createdAt: '2026-10-10T08:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'thanhanhkhoi-founder',
    email: 'thanhanhkhoi.work@gmail.com',
    displayName: 'Thành Anh Khôi (Founder)',
    role: 'superadmin',
    status: 'active',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-mod-01',
    email: 'mod.lethibich@gmail.com',
    displayName: 'Lê Thị Bích (Moderator)',
    role: 'moderator',
    status: 'active',
    createdAt: '2026-10-12T10:15:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-member-02',
    email: 'nguyenvanan.dev@gmail.com',
    displayName: 'Nguyễn Văn An',
    role: 'user',
    status: 'active',
    createdAt: '2026-10-14T09:30:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-member-03',
    email: 'phamvancuong.tester@gmail.com',
    displayName: 'Phạm Văn Cường',
    role: 'user',
    status: 'disabled',
    disabledReason: 'Vi phạm quy định đăng nội dung thông tin liên lạc giả mạo.',
    disabledAt: '2026-10-16T10:00:00.000Z',
    disabledBy: 'hDXxqhdYElbROoO40aJPOudn3mx2',
    createdAt: '2026-10-15T14:20:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    uid: 'user-member-04',
    email: 'hoangminhtri.design@gmail.com',
    displayName: 'Hoàng Minh Trí',
    role: 'user',
    status: 'active',
    createdAt: '2026-10-16T11:45:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

async function seedUsers() {
  console.log('🚀 Đang nạp danh sách người dùng mẫu vào Firestore collection "users"...');

  for (const user of SAMPLE_USERS) {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, user, { merge: true });
    console.log(`  ✅ [${user.role}] ${user.displayName} (${user.email}) - UID: ${user.uid}`);

    // If moderator, ensure record exists in moderators collection
    if (user.role === 'moderator') {
      const modRef = doc(db, 'moderators', user.uid);
      await setDoc(
        modRef,
        {
          assignedBy: 'hDXxqhdYElbROoO40aJPOudn3mx2',
          assignedAt: user.createdAt,
          email: user.email,
        },
        { merge: true }
      );
    }
  }

  console.log('\n🎉 Đã nạp thành công toàn bộ người dùng vào Firestore!');
}

seedUsers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  });
