import { CVData } from '../types/cv';

export const mockCVData: CVData = {
  id: 'cv-thanhtruc-01',
  userId: 'user-001',
  slug: 'thanh-truc',
  isPublic: true,
  personalInfo: {
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    fullName: 'Nguyễn Lê Thanh Trúc',
    title: 'Giảng Viên Lập Trình & Full-stack Developer',
    email: 'thanhtruc.dev@gmail.com',
    phone: '0912 345 678',
    location: 'Quận 1, TP. Hồ Chí Minh',
    birthday: '15/08/2002',
    website: 'https://thanhtruc.dev',
    github: 'github.com/thanhtruc',
    linkedin: 'linkedin.com/in/thanhtruc',
  },
  summary:
    'Cử nhân Công nghệ Thông tin đam mê sâu sắc với sư phạm công nghệ và phát triển web hiện đại. Hơn 3 năm kinh nghiệm đào tạo 300+ học viên về lập trình web full-stack, kết hợp xây dựng các sản phẩm thực tế với tư duy giải thuật vững chắc và trải nghiệm người dùng tối ưu.',
  experiences: [
    {
      id: 'exp-1',
      company: 'MindX Technology School',
      position: 'Giảng Viên Lập Trình Web & Python',
      startDate: '09/2023',
      endDate: 'Hiện tại',
      isCurrent: true,
      location: 'TP. Hồ Chí Minh',
      descriptions: [
        'Trực tiếp đào tạo các khóa học Web Frontend (React, TypeScript, Tailwind) và Python nâng cao cho hơn 150+ học viên, tỉ lệ hoàn thành đồ án đạt 96%.',
        'Cố vấn trực tiếp 2 nhóm học viên đạt Giải Nhì và Giải Khuyến khích tại Hội thi Sáng tạo Công nghệ Trẻ cấp thành phố.',
      ],
    },
    {
      id: 'exp-2',
      company: 'TechKids Academy',
      position: 'Trợ Giảng & Biên Soạn Giáo Trình Frontend',
      startDate: '06/2022',
      endDate: '08/2023',
      isCurrent: false,
      location: 'TP. Hồ Chí Minh',
      descriptions: [
        'Đồng biên soạn bộ giáo trình thực hành Mini-Project React và ngân hàng bài tập giải thuật tương tác cho 200+ học viên.',
        'Kèm cặp 1-1 và giải đáp kỹ thuật, giúp 100% học viên lớp phụ trách vượt qua kỳ thi đánh giá năng lực cuối kỳ.',
      ],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'Đại học Bách Khoa TP.HCM',
      degree: 'Kỹ Sư Công Nghệ Thông Tin',
      major: 'Khoa học Máy tính',
      startDate: '2020',
      endDate: '2024',
      gpa: '3.65 / 4.0 (Tốt nghiệp loại Giỏi)',
      honors: 'Học bổng Khuyến khích Học tập 3 học kỳ liên tiếp',
    },
  ],
  skillCategories: [
    {
      id: 'skill-cat-1',
      categoryName: 'Kỹ Thuật Lập Trình',
      skills: [
        { name: 'React & Next.js', level: 5 },
        { name: 'TypeScript & JavaScript', level: 5 },
        { name: 'Tailwind CSS & UI Polish', level: 5 },
        { name: 'Python & Node.js', level: 4 },
        { name: 'Git & GitHub Workflow', level: 5 },
      ],
    },
    {
      id: 'skill-cat-2',
      categoryName: 'Kỹ Năng Giảng Dạy & Mềm',
      skills: [
        { name: 'Soạn giáo án tương tác', level: 5 },
        { name: 'Truyền cảm hứng học tập', level: 5 },
        { name: 'Tiếng Anh (IELTS 7.0)', level: 4 },
        { name: 'Thuyết trình trước đám đông', level: 5 },
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'EduCode Live — Nền Tảng Học Code Trực Tuyến',
      role: 'Lead Developer & Soạn Giảng',
      description:
        'Hệ thống web học lập trình tương tác cho phép học sinh chạy code trực tiếp trên trình duyệt và nhận phản hồi trực tiếp từ giáo viên.',
      techStack: ['React', 'TypeScript', 'Tailwind', 'Monaco Editor'],
      link: 'https://educode-demo.vercel.app',
    },
    {
      id: 'proj-2',
      name: 'CV Studio — Nền Tảng Tạo CV & Hồ Sơ Cá Nhân',
      role: 'Full-stack Developer',
      description:
        'Hệ thống tạo CV chuyên nghiệp với nhiều mẫu hiện đại, tùy biến màu sắc, hỗ trợ Dark/Light mode và xuất file in PDF chuẩn A4.',
      techStack: ['React 18', 'Vite', 'TypeScript', 'Tailwind CSS'],
      link: 'https://github.com/thanhtruc/cv-studio',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Giảng Viên Xuất Sắc Của Quý (Top Instructor Q2/2024)',
      issuer: 'MindX Technology School',
      year: '2024',
      description: 'Được bình chọn bởi 100% học viên với điểm đánh giá hài lòng tuyệt đối 4.9/5.0.',
    },
    {
      id: 'ach-2',
      title: 'Giải Nhì Hội Thi Sáng Tạo Kỹ Thuật Sinh Viên',
      issuer: 'Thành Đoàn TP. Hồ Chí Minh',
      year: '2023',
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Meta Certified Front-End Developer',
      issuer: 'Meta & Coursera',
      issueDate: '2023',
    },
    {
      id: 'cert-2',
      name: 'Chứng Chỉ Bồi Dưỡng Nghiệp Vụ Sư Phạm',
      issuer: 'Đại học Sư phạm TP.HCM',
      issueDate: '2024',
    },
  ],
  themeConfig: {
    templateId: 'template-classic-teal',
    primaryColor: '#0E7C6B',
    primaryColorPreset: 'teal',
    accentColor: '#E86C50',
    fontHeading: 'iCiel Cubano',
    fontBody: 'Be Vietnam Pro',
    darkMode: false,
  },
  createdAt: '2026-10-12T00:00:00.000Z',
  updatedAt: '2026-10-12T00:00:00.000Z',
};
