import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  writeBatch,
  doc,
  setDoc
} from 'firebase/firestore';
import { mockProfilesList } from '../frontend/src/data/mockProfiles';

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

async function resetAndSeedDatabase() {
  console.log('========================================================');
  console.log('🚀 BẮT ĐẦU QUÁ TRÌNH RESET & SEED DATABASE SẠCH (v0.4.0)');
  console.log('========================================================\n');

  // BƯỚC 1: XÓA DỮ LIỆU CŨ TRONG COLLECTION CVS
  console.log('📦 Bước 1: Quét và dọn dẹp collection "cvs"...');
  const cvsSnapshot = await getDocs(collection(db, 'cvs'));
  console.log(`🔍 Tìm thấy ${cvsSnapshot.size} tài liệu cũ cần dọn dẹp.`);

  if (cvsSnapshot.size > 0) {
    const deleteBatch = writeBatch(db);
    let count = 0;
    for (const document of cvsSnapshot.docs) {
      deleteBatch.delete(document.ref);
      count++;
      // Batch tối đa 500 operations
      if (count % 400 === 0) {
        await deleteBatch.commit();
        console.log(`  🗑️ Đã xóa ${count}/${cvsSnapshot.size} tài liệu...`);
      }
    }
    await deleteBatch.commit();
    console.log(`✅ Đã dọn dẹp sạch sẽ toàn bộ ${cvsSnapshot.size} tài liệu cũ trong "cvs".\n`);
  } else {
    console.log('ℹ️ Collection "cvs" đã trống.\n');
  }

  // BƯỚC 2: SEED 8 HỒ SƠ MẪU TIÊU BIỂU ĐA NGÀNH NGHỀ
  console.log('🌱 Bước 2: Nạp 8 hồ sơ mẫu tiêu biểu với Schema v0.4.0 đầy đủ...');
  const seedBatch = writeBatch(db);

  for (const profile of mockProfilesList) {
    const cleanDoc = {
      ...profile,
      viewCount: profile.viewCount ?? 100,
      status: 'active',
      ownerDisabled: false,
      category: profile.category ?? 'tech',
      isPublic: true,
      updatedAt: profile.updatedAt || new Date().toISOString(),
    };

    const docRef = doc(db, 'cvs', profile.id);
    seedBatch.set(docRef, cleanDoc);
    console.log(`  ✨ Chuẩn bị hồ sơ: [${profile.id}] - ${profile.personalInfo.fullName} (${profile.category} | ${cleanDoc.viewCount} views)`);
  }

  await seedBatch.commit();
  console.log(`\n✅ Đã ghi nhận thành công 8 hồ sơ chuẩn vào collection "cvs".\n`);

  // BƯỚC 3: KHỞI TẠO BẢN GHI SUPER ADMIN CHO CHỦ DỰ ÁN
  console.log('🛡️ Bước 3: Khởi tạo quyền Super Admin trong collection "admins"...');
  const adminDocRef = doc(db, 'admins', 'thanhanhkhoi-superadmin');
  await setDoc(adminDocRef, {
    email: 'thanhanhkhoi.work@gmail.com',
    role: 'superadmin',
    displayName: 'Trần Anh Khôi',
    assignedAt: new Date().toISOString(),
    status: 'active',
  }, { merge: true });
  console.log('✅ Đã ghi nhận Super Admin: thanhanhkhoi.work@gmail.com trong collection "admins".\n');

  console.log('========================================================');
  console.log('🎉 HOÀN TẤT TÁI KHỞI TẠO CƠ SỞ DỮ LIỆU SẠCH 100%!');
  console.log('========================================================');
}

resetAndSeedDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Lỗi trong quá trình reset/seed:', err);
    process.exit(1);
  });
