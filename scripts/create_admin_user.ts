import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  const email = 'thisisanhkhoi@gmail.com';
  const password = 'jun2972007';

  console.log(`🚀 Đang tạo/cập nhật tài khoản Admin: ${email}...`);

  let user: any = null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    user = cred.user;
    console.log('✅ Đã tạo mới tài khoản Firebase Auth thành công!');
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('ℹ️ Email đã tồn tại trong Firebase Auth, đang thử đăng nhập...');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      user = cred.user;
      console.log('✅ Đăng nhập thành công với mật khẩu đã cung cấp!');
    } else {
      console.error('❌ Lỗi Firebase Auth:', err);
      throw err;
    }
  }

  console.log(`👤 User UID: ${user.uid}`);

  await updateProfile(user, {
    displayName: 'Trần Anh Khôi (Super Admin)',
  });

  // Ghi nhận vào collection users
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      email: email,
      displayName: 'Trần Anh Khôi (Super Admin)',
      role: 'superadmin',
      status: 'active',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  // Ghi nhận vào collection admins
  const adminRef = doc(db, 'admins', user.uid);
  await setDoc(
    adminRef,
    {
      email: email,
      role: 'superadmin',
      displayName: 'Trần Anh Khôi (Super Admin)',
      assignedAt: new Date().toISOString(),
      status: 'active',
    },
    { merge: true }
  );

  console.log('🛡️ Đã cấp quyền Super Admin trong collection "admins" và "users"!');
  console.log('\n🎉 TÀI KHOẢN ADMIN ĐÃ SẴN SÀNG HOÀN TOÀN:');
  console.log(`   Email: ${email}`);
  console.log(`   Mật khẩu: ${password}`);
}

createAdminUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Lỗi khởi tạo Admin:', err);
    process.exit(1);
  });
