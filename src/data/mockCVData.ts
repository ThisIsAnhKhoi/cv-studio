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
    email: 'thanhtruc.nguyen@example.com',
    phone: '0912 345 678',
    location: 'Quận 1, TP. Hồ Chí Minh',
    birthday: '15/08/2002',
    website: 'https://thanhtruc.dev',
    github: 'github.com/thanhtruc',
    linkedin: 'linkedin.com/in/thanhtruc',
  },
  summary:
    'Cử nhân Công nghệ Thông tin đam mê sâu sắc với sư phạm công nghệ và phát triển web hiện đại. Hơn 3 năm kinh nghiệm trực tiếp giảng dạy lập trình (React, Python, Web Full-stack) cho 300+ học viên trẻ, đồng thời tham gia xây dựng các sản phẩm thực tế. Thế mạnh nổi bật về tư duy giải thuật, truyền cảm hứng học tập, kiên nhẫn và luôn cập nhật các tiêu chuẩn UI/UX mới nhất.',
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
        'Trực tiếp đứng lớp giảng dạy các khóa học Lập trình Web Frontend (React, TypeScript, Tailwind) và Python từ cơ bản đến nâng cao cho hơn 150+ học viên.',
        'Tỉ lệ học viên hoàn thành đồ án tốt nghiệp xuất sắc đạt 96%, nhận điểm hài lòng phụ huynh trung bình 4.9/5.0 qua các kỳ đánh giá.',
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
        'Hỗ trợ giải đáp bài tập, chấm điểm đồ án và tổ chức các buổi phụ đạo 1-1 cho các bạn học viên cần củng cố kiến thức giải thuật.',
        'Đồng biên soạn bộ tài liệu thực hành Mini-Project React và ngân hàng bài kiểm tra đánh giá năng lực tư duy lập trình.',
        'Tổ chức thành công 4 buổi Workshop chia sẻ định hướng nghề nghiệp công nghệ cho tân sinh viên.',
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
      categoryName: 'Công Nghệ & Lập Trình',
      skills: [
        { name: 'React.js / Next.js', level: 5 },
        { name: 'TypeScript & JavaScript', level: 5 },
        { name: 'Tailwind CSS / UI Styling', level: 5 },
        { name: 'Python / Flask', level: 4 },
        { name: 'Node.js / RESTful API', level: 4 },
        { name: 'Git & GitHub Workflow', level: 5 },
      ],
    },
    {
      id: 'skill-cat-2',
      categoryName: 'Kỹ Năng Sư Phạm',
      skills: [
        { name: 'Thiết kế giáo án tương tác', level: 5 },
        { name: 'Kèm cặp & Coaching 1-1', level: 5 },
        { name: 'Truyền cảm hứng & Tạo động lực', level: 5 },
        { name: 'Quản lý lớp học năng động', level: 4 },
      ],
    },
    {
      id: 'skill-cat-3',
      categoryName: 'Ngôn Ngữ & Kỹ Năng Mềm',
      skills: [
        { name: 'Tiếng Anh (IELTS 7.0)', level: 4 },
        { name: 'Thuyết trình trước đám đông', level: 5 },
        { name: 'Tư duy phản biện & Giải quyết vấn đề', level: 5 },
      ],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'EduCode Live — Nền Tảng Học Code Trực Tuyến',
      role: 'Lead Developer & Giáo Viên Soạn Đề',
      description:
        'Hệ thống web học lập trình tương tác cho phép học sinh chạy code trực tiếp trên trình duyệt, chấm bài trắc nghiệm tự động và nhận phản hồi trực tiếp từ giáo viên.',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Monaco Editor', 'Firebase'],
      link: 'https://educode-demo.vercel.app',
    },
    {
      id: 'proj-2',
      name: 'CV Studio — Nền Tảng Tạo CV & Hồ Sơ Cá Nhân',
      role: 'Full-stack Developer',
      description:
        'Hệ thống tạo CV chuyên nghiệp với nhiều mẫu thiết kế hiện đại, tùy biến màu sắc, hỗ trợ Dark/Light mode và xuất bản in PDF chuẩn kích thước A4 quốc tế.',
      techStack: ['React 18', 'Vite', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'],
      link: 'https://github.com/thanhtruc/cv-studio',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Giảng Viên Xuất Sắc Của Quý (Top Instructor Q2/2024)',
      issuer: 'MindX Technology School',
      year: '2024',
      description: 'Được bình chọn bởi 100% học viên và ban cố vấn chuyên môn với điểm đánh giá tuyệt đối.',
    },
    {
      id: 'ach-2',
      title: 'Giải Nhì Hội Thi Sáng Tạo Kỹ Thuật Sinh Viên',
      issuer: 'Thành Đoàn TP. Hồ Chí Minh',
      year: '2023',
      description: 'Đề tài ứng dụng công nghệ giáo dục số cho học sinh phổ thông.',
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Meta Certified Front-End Developer',
      issuer: 'Meta & Coursera',
      issueDate: '2023',
      credentialUrl: 'https://coursera.org/verify/meta-frontend',
    },
    {
      id: 'cert-2',
      name: 'Chứng Chỉ Bồi Dưỡng Nghiệp Vụ Sư Phạm',
      issuer: 'Trường Đại học Sư phạm TP.HCM',
      issueDate: '2024',
    },
    {
      id: 'cert-3',
      name: 'IELTS Academic 7.0 Overall',
      issuer: 'IDP Education',
      issueDate: '2023',
    },
  ],
  themeConfig: {
    templateId: 'template-classic-teal',
    primaryColor: '#0E7C6B',
    primaryColorPreset: 'teal',
    accentColor: '#E86C50',
    fontHeading: 'Outfit',
    fontBody: 'Be Vietnam Pro',
    darkMode: false,
  },
  createdAt: '2026-10-12T00:00:00.000Z',
  updatedAt: '2026-10-12T00:00:00.000Z',
};
