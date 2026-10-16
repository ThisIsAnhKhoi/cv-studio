import { CVData } from '../types/cv';
import { mockCVData } from './mockCVData';

export const mockProfilesList: CVData[] = [
  // Profile 1: Trần Anh Khôi (Full-stack & Lecturer) - Template 1 Classic Teal (Đã duyệt)
  mockCVData,

  // Profile 2: Nguyễn Lê Thanh Trúc (Senior Product Designer) - Template 2 Warm Bold
  {
    id: 'cv-thanhtruc-design',
    userId: 'user-002',
    slug: 'nguyen-le-thanh-truc',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      fullName: 'Nguyễn Lê Thanh Trúc',
      title: 'Lead Product Designer & UX Strategist',
      email: 'thanhtruc.design@gmail.com',
      phone: '0908 776 554',
      location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
      birthday: '24/11/1998',
      website: 'https://thanhtruc.ux',
      linkedin: 'linkedin.com/in/thanhtruc-designer',
    },
    summary:
      'Chuyên gia Thiết kế Sản phẩm với hơn 5 năm kinh nghiệm dẫn dắt thiết kế trải nghiệm người dùng (UX/UI) cho các ứng dụng FinTech và E-commerce phục vụ hơn 1.2 triệu người dùng hoạt động. Thành thạo xây dựng Design System quy mô lớn, nghiên cứu hành vi người dùng định lượng và tối ưu hóa tỷ lệ chuyển đổi (CRO).',
    experiences: [
      {
        id: 'exp-tt-1',
        company: 'VNPAY Financial Technology',
        position: 'Lead UX/UI Designer',
        startDate: '01/2022',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Chủ trì tái thiết kế luồng thanh toán QR & chuyển tiền nhanh, giảm 28% tỷ lệ bỏ rơi giỏ hàng và tăng CSAT lên 4.7/5.',
          'Xây dựng & duy trì Design System "Nexus" với hơn 200+ components tái sử dụng cho 4 nền tảng (iOS, Android, Web, Tablet).',
        ],
      },
      {
        id: 'exp-tt-2',
        company: 'Giao Hàng Nhanh (GHN)',
        position: 'Senior UI/UX Designer',
        startDate: '03/2019',
        endDate: '12/2021',
        isCurrent: false,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Thiết kế ứng dụng GHN Express cho tài xế & điều phối viên, giảm 15 phút thời gian xử lý đơn hàng mỗi ca làm việc.',
          'Dẫn dắt 12 đợt Usability Testing chuyên sâu với đối tác doanh nghiệp B2B.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-tt-1',
        school: 'Đại học Kiến Trúc TP.HCM',
        degree: 'Cử Nhân Thiết Kế Đồ Họa',
        major: 'Thiết Kế Mỹ Thuật Đa Phương Tiện',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.72 / 4.0 (Thủ khoa ngành)',
        honors: 'Giải Nhất Triển lãm Đồ án Tốt nghiệp Xuất sắc 2019',
      },
    ],
    skillCategories: [
      {
        id: 'skill-tt-1',
        categoryName: 'Kỹ Năng Thiết Kế Cốt Lõi',
        skills: [
          { name: 'Product Strategy & UX Research', level: 5 },
          { name: 'Design Systems & Component Library', level: 5 },
          { name: 'Wireframing & High-fidelity Prototype', level: 5 },
          { name: 'User Testing & Data Analytics', level: 4 },
        ],
      },
      {
        id: 'skill-tt-2',
        categoryName: 'Công Cụ Chuyên Nghiệp',
        skills: [
          { name: 'Figma & FigJam (Advanced)', level: 5 },
          { name: 'Framer & Principle Animation', level: 4 },
          { name: 'Adobe Creative Suite', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-tt-1',
        name: 'Nexus FinTech Design System',
        role: 'Design System Architect',
        description: 'Kiến tạo hệ thống design system đồng bộ cho 30+ kỹ sư và 8 nhà thiết kế, chuẩn hóa token màu sắc và typography.',
        techStack: ['Figma Tokens', 'Storybook', 'WCAG 2.1 AA', 'Auto-layout'],
      },
      {
        id: 'proj-tt-2',
        name: 'Smart Retail Merchant Portal',
        role: 'Lead UX Designer',
        description: 'Trực quan hóa doanh thu và quản lý kho hàng thời gian thực cho hơn 45,000 tiểu thương trên toàn quốc.',
        techStack: ['Dashboard UX', 'Data Visualization', 'Micro-interactions'],
      },
    ],
    achievements: [
      {
        id: 'ach-tt-1',
        title: 'Top 10 Vietnam UX Awards 2023',
        issuer: 'Hiệp hội Thiết kế Tương tác VN',
        year: '2023',
        description: 'Vinh danh sản phẩm tài chính có trải nghiệm người dùng đột phá nhất năm.',
      },
    ],
    certificates: [
      {
        id: 'cert-tt-1',
        name: 'Nielsen Norman Group UX Master Certified',
        issuer: 'NN/g (ID: 1048829)',
        issueDate: '2021',
      },
    ],
    themeConfig: {
      templateId: 'template-warm-bold',
      primaryColor: '#D97706',
      primaryColorPreset: 'orange',
      accentColor: '#B45309',
      fontHeading: 'Gilroy',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-03-01T08:00:00.000Z',
    updatedAt: '2024-04-12T10:00:00.000Z',
    viewCount: 1250,
    status: 'active',
    ownerDisabled: false,
    category: 'design',
  },

  // Profile 3: Lê Hoàng Nam (Data Scientist & AI Specialist) - Template 3 Modern Minimal
  {
    id: 'cv-hoangnam-ai',
    userId: 'user-003',
    slug: 'le-hoang-nam',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      fullName: 'Lê Hoàng Nam',
      title: 'Senior Data Scientist & AI/ML Engineer',
      email: 'hoangnam.ai@gmail.com',
      phone: '0933 221 199',
      location: 'Cầu Giấy, Hà Nội',
      birthday: '12/03/1996',
      github: 'github.com/namlh-ai',
      linkedin: 'linkedin.com/in/hoangnam-data',
    },
    summary:
      'Kỹ sư Khoa học Dữ liệu và Trí tuệ Nhân tạo với 6 năm kinh nghiệm triển khai các mô hình Machine Learning / LLMs ứng dụng trong xử lý ngôn ngữ tự nhiên (NLP) và hệ thống gợi ý (Recommendation Systems) thời gian thực. Xuất bản 2 bài báo nghiên cứu tại hội nghị khoa học quốc tế IEEE.',
    experiences: [
      {
        id: 'exp-hn-1',
        company: 'VinAI Research',
        position: 'Staff Machine Learning Engineer',
        startDate: '08/2021',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'Hà Nội',
        descriptions: [
          'Chủ trì phát triển mô hình tóm tắt tài liệu tiếng Việt dựa trên Transformer, đạt độ chính xác ROUGE-2 44.8, phục vụ 80,000 truy vấn/ngày.',
          'Tối ưu hóa pipeline huấn luyện phân tán với PyTorch FSDP, giảm 40% chi phí tính toán GPU trên cụm máy chủ Cloud.',
        ],
      },
      {
        id: 'exp-hn-2',
        company: 'Tiki Corporation',
        position: 'Data Scientist',
        startDate: '01/2019',
        endDate: '07/2021',
        isCurrent: false,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Xây dựng thuật toán Personalized Recommendations trên trang chủ, tăng 14.2% tỷ lệ Click-through rate (CTR) trong mùa mua sắm cao điểm.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-hn-1',
        school: 'Đại học Quốc Gia Hà Nội (UET)',
        degree: 'Thạc Sĩ Khoa Học Máy Tính',
        major: 'Trí Tuệ Nhân Tạo & Khai Phá Dữ Liệu',
        startDate: '2018',
        endDate: '2020',
        gpa: '3.85 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-hn-1',
        categoryName: 'AI & Data Science',
        skills: [
          { name: 'PyTorch & TensorFlow', level: 5 },
          { name: 'Large Language Models (LLMs) & RAG', level: 5 },
          { name: 'NLP & Computer Vision', level: 4 },
          { name: 'MLOps (Docker, MLflow, KubeFlow)', level: 4 },
        ],
      },
      {
        id: 'skill-hn-2',
        categoryName: 'Lập Trình & Dữ Liệu Lớn',
        skills: [
          { name: 'Python, C++, SQL (PostgreSQL, BigQuery)', level: 5 },
          { name: 'Apache Spark & Kafka Streaming', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-hn-1',
        name: 'Legal Assistant RAG Platform',
        role: 'Tech Lead AI',
        description: 'Hệ thống tra cứu và phân tích luật tự động cho doanh nghiệp dựa trên mô hình Vector Search và Hybrid Retrieval.',
        techStack: ['LangChain', 'Qdrant Vector DB', 'FastAPI', 'Llama-3'],
      },
    ],
    achievements: [
      {
        id: 'ach-hn-1',
        title: 'IEEE Best Paper Candidate',
        issuer: 'IEEE RIVF Conference',
        year: '2022',
        description: 'Đề tài về học biểu diễn thực thể tiếng Việt.',
      },
    ],
    certificates: [
      {
        id: 'cert-hn-1',
        name: 'AWS Certified Machine Learning - Specialty',
        issuer: 'Amazon Web Services',
        issueDate: '2022',
      },
    ],
    themeConfig: {
      templateId: 'template-modern-minimal',
      primaryColor: '#B91C1C',
      primaryColorPreset: 'red',
      accentColor: '#991B1B',
      fontHeading: 'Montserrat',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-02-15T08:00:00.000Z',
    updatedAt: '2024-04-10T10:00:00.000Z',
    viewCount: 980,
    status: 'active',
    ownerDisabled: false,
    category: 'data-ai',
  },

  // Profile 4: Đỗ Minh Trang (Digital Marketing Lead & Brand Strategist) - Template 1 Classic Teal
  {
    id: 'cv-minhtrang-marketing',
    userId: 'user-004',
    slug: 'do-minh-trang',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      fullName: 'Đỗ Minh Trang',
      title: 'Growth Marketing Lead & Brand Strategist',
      email: 'minhtrang.growth@gmail.com',
      phone: '0978 654 321',
      location: 'Quận 3, TP. Hồ Chí Minh',
      birthday: '18/06/1999',
      linkedin: 'linkedin.com/in/minhtrang-marketing',
    },
    summary:
      'Chuyên gia Tiếp thị Tăng trưởng (Growth Marketing) với 4+ năm thực chiến quản lý ngân sách quảng cáo hơn 15 tỷ VNĐ/năm cho các thương hiệu D2C và B2B SaaS. Thế mạnh về Data-driven Marketing, SEO tổng thể, tối ưu kênh trả phí (Performance Ads) và xây dựng chiến lược thương hiệu gắn kết người tiêu dùng.',
    experiences: [
      {
        id: 'exp-mt-1',
        company: 'Coolmate Vietnam',
        position: 'Performance Marketing Lead',
        startDate: '04/2022',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Quản lý trực tiếp ngân sách Paid Ads đa kênh (Meta, Google, TikTok), duy trì ROAS trung bình 4.2x qua các chiến dịch trọng điểm.',
          'Tối ưu tỷ lệ chuyển đổi website từ 2.1% lên 3.6% thông qua hơn 30 bài A/B testing trang sản phẩm và quy trình thanh toán.',
        ],
      },
      {
        id: 'exp-mt-2',
        company: 'Dentsu Redder Agency',
        position: 'Digital Strategic Planner',
        startDate: '08/2020',
        endDate: '03/2022',
        isCurrent: false,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Lên chiến lược truyền thông tích hợp (IMC) cho các nhãn hàng tiêu dùng nhanh (FMCG), đoạt 2 giải thưởng Tiếp thị Chiến dịch Sáng tạo.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-mt-1',
        school: 'Đại học Kinh Tế TP.HCM (UEH)',
        degree: 'Cử Nhân Quản Trị Kinh Doanh',
        major: 'Marketing Quốc Tế',
        startDate: '2017',
        endDate: '2021',
        gpa: '3.68 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-mt-1',
        categoryName: 'Kỹ Năng Tiếp Thị',
        skills: [
          { name: 'Performance Marketing (Meta, Google, TikTok)', level: 5 },
          { name: 'SEO Strategy & Content Marketing', level: 5 },
          { name: 'Data Analytics (GA4, Mixpanel, Looker Studio)', level: 4 },
          { name: 'CRM & Marketing Automation', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-mt-1',
        name: 'Brand Relaunch Campaign 2023',
        role: 'Campaign Director',
        description: 'Chiến dịch tái định vị thương hiệu đạt 12 triệu lượt tiếp cận, tăng trưởng doanh số quý 3 đạt 145% so với cùng kỳ.',
        techStack: ['Omnichannel', 'Influencer Hub', 'Performance Tracking'],
      },
    ],
    achievements: [
      {
        id: 'ach-mt-1',
        title: 'Young Marketers Elite Top 5',
        issuer: 'Young Marketers Foundation',
        year: '2021',
      },
    ],
    certificates: [
      {
        id: 'cert-mt-1',
        name: 'Google Analytics 4 & Ads Search Certified',
        issuer: 'Google Skillshop',
        issueDate: '2023',
      },
    ],
    themeConfig: {
      templateId: 'template-classic-teal',
      primaryColor: '#0E7C6B',
      primaryColorPreset: 'teal',
      accentColor: '#0A5C4F',
      fontHeading: 'Gilroy',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-03-10T08:00:00.000Z',
    updatedAt: '2024-04-11T10:00:00.000Z',
    viewCount: 860,
    status: 'active',
    ownerDisabled: false,
    category: 'marketing',
  },

  // Profile 5: Phạm Quốc Bảo (Mobile Flutter & React Native Engineer) - Template 2 Warm Bold
  {
    id: 'cv-quocbao-mobile',
    userId: 'user-005',
    slug: 'pham-quoc-bao',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      fullName: 'Phạm Quốc Bảo',
      title: 'Senior Mobile Engineer (Flutter & iOS)',
      email: 'quocbao.dev@gmail.com',
      phone: '0918 889 900',
      location: 'Quận 7, TP. Hồ Chí Minh',
      birthday: '05/09/1997',
      github: 'github.com/quocbao-mobile',
      linkedin: 'linkedin.com/in/quocbao-developer',
    },
    summary:
      'Lập trình viên Di động cao cấp với hơn 5 năm chuyên sâu về Flutter, Dart và Swift Native. Đã phát triển và phát hành hơn 8 ứng dụng lên Google Play & Apple App Store, với tổng số lượt tải tích lũy vượt 500,000+. Chú trọng kiến trúc Clean Architecture, hiệu năng mượt mà 60fps và Offline-first sync.',
    experiences: [
      {
        id: 'exp-qb-1',
        company: 'MoMo E-Wallet',
        position: 'Senior Mobile Engineer',
        startDate: '02/2021',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Phát triển Module Ví Tiết Kiệm & Đầu Tư Tích Lũy, phục vụ 350,000 người dùng mỗi tháng với độ ổn định Crash-free 99.85%.',
          'Tối ưu kích thước bundle ứng dụng giảm 32% dung lượng download trên thiết bị Android.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-qb-1',
        school: 'Đại học Khoa Học Tự Nhiên TP.HCM',
        degree: 'Cử Nhân Công Nghệ Thông Tin',
        major: 'Kỹ Thuật Phần Mềm',
        startDate: '2015',
        endDate: '2019',
        gpa: '3.60 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-qb-1',
        categoryName: 'Công Nghệ Di Động',
        skills: [
          { name: 'Flutter & Dart (Expert)', level: 5 },
          { name: 'Swift & iOS Native Development', level: 4 },
          { name: 'Bloc, Provider & Riverpod State Management', level: 5 },
          { name: 'CI/CD Fastlane & Firebase Crashlytics', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-qb-1',
        name: 'Finance Tracker Pro Mobile App',
        role: 'Solo Developer & Designer',
        description: 'Ứng dụng quản lý tài chính cá nhân đạt 4.8 sao trên App Store với 120,000 lượt tải toàn cầu.',
        techStack: ['Flutter', 'SQLite', 'Biometric Auth', 'In-App Purchases'],
      },
    ],
    achievements: [
      {
        id: 'ach-qb-1',
        title: 'App of the Day Vietnam App Store',
        issuer: 'Apple Editorial Team',
        year: '2023',
      },
    ],
    certificates: [
      {
        id: 'cert-qb-1',
        name: 'Google Certified Associate Android Developer',
        issuer: 'Google Developers Certification',
        issueDate: '2020',
      },
    ],
    themeConfig: {
      templateId: 'template-warm-bold',
      primaryColor: '#D97706',
      primaryColorPreset: 'orange',
      accentColor: '#B45309',
      fontHeading: 'Gilroy',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-04-12T10:00:00.000Z',
    viewCount: 740,
    status: 'active',
    ownerDisabled: false,
    category: 'tech',
  },

  // Profile 6: Hoàng Thảo My (HR Manager & Talent Partner) - Template 3 Modern Minimal
  {
    id: 'cv-thaomy-hr',
    userId: 'user-006',
    slug: 'hoang-thao-my',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      fullName: 'Hoàng Thảo My',
      title: 'Talent Acquisition Lead & HR Business Partner',
      email: 'thaomy.hrpartner@gmail.com',
      phone: '0903 112 334',
      location: 'Đống Đa, Hà Nội',
      birthday: '14/09/1995',
      linkedin: 'linkedin.com/in/thaomy-hr',
    },
    summary:
      'Chuyên gia Quản trị Nhân sự và Thu hút Nhân tài với 7 năm kinh nghiệm xây dựng đội ngũ công nghệ cao (Tech Talent) từ quy mô hạt giống đến Series B. Đã tuyển dụng thành công 250+ kỹ sư phần mềm, quản lý văn hóa doanh nghiệp và thiết kế thang bảng lương chuẩn mực ngành IT.',
    experiences: [
      {
        id: 'exp-tm-1',
        company: 'KiotViet (Citigo Software)',
        position: 'Talent Acquisition Lead',
        startDate: '05/2021',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'Hà Nội',
        descriptions: [
          'Dẫn dắt đội ngũ 6 chuyên viên tuyển dụng, hoàn thành 95% chỉ tiêu tuyển dụng quy mô 180 nhân sự công nghệ trong 12 tháng.',
          'Giảm 22% chi phí tuyển dụng trên mỗi đầu người nhờ xây dựng mạng lưới Employer Branding tại các trường đại học top đầu.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-tm-1',
        school: 'Đại học Ngoại Thương Hà Nội (FTU)',
        degree: 'Cử Nhân Quản Trị Kinh Doanh Quốc Tế',
        major: 'Kinh Tế Đối Ngoại',
        startDate: '2013',
        endDate: '2017',
        gpa: '3.70 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-tm-1',
        categoryName: 'Quản Trị Nhân Sự & Thu Hút Nhân Tài',
        skills: [
          { name: 'Tech Recruitment & Headhunting', level: 5 },
          { name: 'Employer Branding & Campus Relations', level: 5 },
          { name: 'Compensation & Benefits (C&B)', level: 4 },
          { name: 'HR Data Analytics & Retention', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-tm-1',
        name: 'Tech Talent Incubation Program',
        role: 'Program Director',
        description: 'Chương trình ươm mầm tài năng trẻ thu hút 1,200 hồ sơ dự thi, tuyển chọn 40 kỹ sư tài năng cho công ty.',
        techStack: ['ATS Greenhouse', 'LinkedIn Recruiter', 'Assessment Hub'],
      },
    ],
    achievements: [
      {
        id: 'ach-tm-1',
        title: 'HR Leader of the Year 2022',
        issuer: 'Vietnam HR Excellence Summit',
        year: '2022',
      },
    ],
    certificates: [
      {
        id: 'cert-tm-1',
        name: 'SHRM Certified Professional (SHRM-CP)',
        issuer: 'Society for Human Resource Management',
        issueDate: '2021',
      },
    ],
    themeConfig: {
      templateId: 'template-modern-minimal',
      primaryColor: '#0E7C6B',
      primaryColorPreset: 'teal',
      accentColor: '#0F766E',
      fontHeading: 'Gilroy',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-02-10T08:00:00.000Z',
    updatedAt: '2024-04-10T10:00:00.000Z',
    viewCount: 650,
    status: 'active',
    ownerDisabled: false,
    category: 'hr',
  },

  // Profile 7: Trần Văn Khang (Head of Business Development & B2B Sales) - Template 2 Warm Bold
  {
    id: 'cv-vankhang-business',
    userId: 'user-007',
    slug: 'tran-van-khang',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      fullName: 'Trần Văn Khang',
      title: 'Head of Business Development & Strategic Partnerships',
      email: 'vankhang.biz@gmail.com',
      phone: '0909 334 556',
      location: 'Quận 1, TP. Hồ Chí Minh',
      birthday: '10/05/1994',
      linkedin: 'linkedin.com/in/vankhang-biz',
    },
    summary:
      'Giám đốc Phát triển Kinh doanh với hơn 8 năm kiến tạo và mở rộng doanh thu B2B cho các giải pháp SaaS và hạ tầng đám mây. Đã mang lại hơn 45 tỷ VNĐ doanh thu hợp đồng mới trong 3 năm gần nhất, thiết lập mạng lưới 60+ đối tác chiến lược tại khu vực Đông Nam Á.',
    experiences: [
      {
        id: 'exp-vk-1',
        company: 'CloudTech Enterprise Solutions',
        position: 'Head of Business Development',
        startDate: '06/2021',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'TP. Hồ Chí Minh',
        descriptions: [
          'Dẫn dắt đội ngũ 12 chuyên viên kinh doanh doanh nghiệp, vượt 130% KPI doanh số năm 2023 với ARR tăng trưởng 42%.',
          'Đàm phán và ký kết thành công hợp đồng cung cấp dịch vụ hạ tầng đám mây 3 năm với 5 ngân hàng và tập đoàn tài chính hàng đầu.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-vk-1',
        school: 'Đại học Quốc Tế - ĐHQG TP.HCM',
        degree: 'Cử Nhân Quản Trị Kinh Doanh',
        major: 'Kinh Doanh Quốc Tế',
        startDate: '2012',
        endDate: '2016',
        gpa: '3.65 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-vk-1',
        categoryName: 'Kỹ Năng Kinh Doanh & Lãnh Đạo',
        skills: [
          { name: 'B2B Enterprise Sales & Solution Selling', level: 5 },
          { name: 'Strategic Partnerships & Negotiation', level: 5 },
          { name: 'Key Account Management & Revenue Growth', level: 5 },
          { name: 'CRM Pipeline (HubSpot, Salesforce)', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-vk-1',
        name: 'SEA Cloud Expansion Strategy',
        role: 'Commercial Lead',
        description: 'Chiến lược mở rộng thị trường khu vực mang lại 1.8 triệu USD doanh thu hợp đồng quốc tế trong 18 tháng.',
        techStack: ['B2B Sales', 'Market Expansion', 'Partner Ecosystem'],
      },
    ],
    achievements: [
      {
        id: 'ach-vk-1',
        title: 'Top Sales Leader of the Year 2023',
        issuer: 'Vietnam Enterprise Sales Association',
        year: '2023',
      },
    ],
    certificates: [
      {
        id: 'cert-vk-1',
        name: 'Certified Enterprise Sales Professional (CESP)',
        issuer: 'Sales Management Association',
        issueDate: '2022',
      },
    ],
    themeConfig: {
      templateId: 'template-warm-bold',
      primaryColor: '#D97706',
      primaryColorPreset: 'orange',
      accentColor: '#B45309',
      fontHeading: 'Montserrat',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-04-08T10:00:00.000Z',
    viewCount: 590,
    status: 'active',
    ownerDisabled: false,
    category: 'business',
  },

  // Profile 8: Vũ Phương Anh (Senior Legal Counsel & Compliance) - Template 3 Modern Minimal
  {
    id: 'cv-phuonganh-other',
    userId: 'user-008',
    slug: 'vu-phuong-anh',
    isPublic: true,
    personalInfo: {
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80',
      fullName: 'Vũ Phương Anh',
      title: 'Senior Legal Counsel & Data Privacy Specialist',
      email: 'phuonganh.legal@gmail.com',
      phone: '0988 445 667',
      location: 'Hoàn Kiếm, Hà Nội',
      birthday: '28/07/1993',
      linkedin: 'linkedin.com/in/phuonganh-legal',
    },
    summary:
      'Cố vấn Pháp lý Doanh nghiệp cao cấp với 8+ năm kinh nghiệm tư vấn luật công nghệ, an toàn thông tin, bảo vệ dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP, GDPR) và sở hữu trí tuệ cho các tập đoàn công nghệ và công ty khởi nghiệp đổi mới sáng tạo.',
    experiences: [
      {
        id: 'exp-pa-1',
        company: 'VNG Corporation',
        position: 'Senior Legal & Privacy Counsel',
        startDate: '03/2020',
        endDate: 'Hiện tại',
        isCurrent: true,
        location: 'Hà Nội',
        descriptions: [
          'Chủ trì xây dựng khung tuân thủ bảo vệ dữ liệu cá nhân cho 5 dòng sản phẩm công nghệ trọng điểm với hơn 20 triệu người dùng.',
          'Soạn thảo, rà soát và thẩm định hơn 400 hợp đồng thương mại quốc tế, thỏa thuận hợp tác đối tác và điều khoản bảo mật.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-pa-1',
        school: 'Đại học Luật Hà Nội (HLU)',
        degree: 'Thạc Sĩ Luật Kinh Tế',
        major: 'Pháp Luật Kinh Tế & Thương Mại Quốc Tế',
        startDate: '2016',
        endDate: '2018',
        gpa: '3.75 / 4.0',
      },
    ],
    skillCategories: [
      {
        id: 'skill-pa-1',
        categoryName: 'Chuyên Môn Pháp Lý & Tuân Thủ',
        skills: [
          { name: 'Data Privacy & Cyber Security Law (Nghị định 13, GDPR)', level: 5 },
          { name: 'Corporate Governance & Risk Management', level: 5 },
          { name: 'Intellectual Property (IP) & Tech Contracts', level: 5 },
          { name: 'M&A Due Diligence & Commercial Disputes', level: 4 },
        ],
      },
    ],
    projects: [
      {
        id: 'proj-pa-1',
        name: 'Enterprise Privacy Compliance Program',
        role: 'Lead Counsel',
        description: 'Triển khai toàn diện chương trình đánh giá tác động xử lý dữ liệu (DPIA) đạt 100% chứng nhận tuân thủ theo tiêu chuẩn pháp lý mới.',
        techStack: ['Privacy Assessment', 'Compliance Audit', 'Policy Design'],
      },
    ],
    achievements: [
      {
        id: 'ach-pa-1',
        title: 'Outstanding Corporate In-House Counsel',
        issuer: 'Vietnam Legal Professionals Forum',
        year: '2023',
      },
    ],
    certificates: [
      {
        id: 'cert-pa-1',
        name: 'Chứng Chỉ Hành Nghề Luật Sư',
        issuer: 'Bộ Tư Pháp Việt Nam',
        issueDate: '2019',
      },
    ],
    themeConfig: {
      templateId: 'template-modern-minimal',
      primaryColor: '#0E7C6B',
      primaryColorPreset: 'teal',
      accentColor: '#0F766E',
      fontHeading: 'Gilroy',
      fontBody: 'Be Vietnam Pro',
      darkMode: false,
    },
    createdAt: '2024-02-01T08:00:00.000Z',
    updatedAt: '2024-04-05T10:00:00.000Z',
    viewCount: 420,
    status: 'active',
    ownerDisabled: false,
    category: 'other',
  },
];

export function getCVByIdOrSlug(identifier: string): CVData | undefined {
  const cleanId = identifier.trim().toLowerCase();
  return (
    mockProfilesList.find((p) => p.id.toLowerCase() === cleanId) ||
    mockProfilesList.find((p) => p.slug.toLowerCase() === cleanId)
  );
}

export function searchProfiles(keyword: string): CVData[] {
  const q = keyword.toLowerCase().trim();
  if (!q) return mockProfilesList;
  return mockProfilesList.filter((profile) => {
    const fullName = profile.personalInfo.fullName.toLowerCase();
    const title = profile.personalInfo.title.toLowerCase();
    const skills = profile.skillCategories
      .flatMap((c) => c.skills.map((s) => s.name.toLowerCase()))
      .join(' ');
    return fullName.includes(q) || title.includes(q) || skills.includes(q);
  });
}

