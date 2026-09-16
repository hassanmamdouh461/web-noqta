// ─── lib/data.js — Data & configurations for Noqta Creative Solutions ─────────────

export const NOQTA_INFO = {
    nameAr: "نقطة",
    nameEn: "Noqta",
    taglineAr: "نقطة البداية لكل فكرة استثنائية",
    taglineEn: "Where Software Engineering Meets Creative Media",
    hashtag: "#Noqta_Creative_Solutions",
    phones: ["01069822862", "01125377606"],
    whatsappUrl: "https://wa.me/201069822862",
    email: "noqta56@gmail.com",
    socials: {
        facebook: "https://www.facebook.com/share/1HP6br9cRw/",
        instagram: "https://www.instagram.com/noq_ta1?stkn=YmdhcHEwcjdwdWZp",
        whatsapp: "https://wa.me/201069822862"
    }
};

// Color Palette from Brand Identity
export const NOQTA_COLORS = {
    mint: "#43FB9C",
    teal: "#3DA792",
    violet: "#362488",
    indigo: "#323E86",
    dark: "#0B0C16",
    surface: "#121528",
    softCream: "#F4F2EC",
    white: "#FFFFFF"
};

// ─── Track Record & Operational Metrics (أرقام وسجل أعمال الفريق) ───
export const TRACK_RECORD = [
    { number: "+25", label: "نظام يعمل يومياً", sublabel: "Live Restaurant & Café Systems" },
    { number: "+100,000", label: "طلب معالج بالأنظمة", sublabel: "Processed Orders End-to-End" },
    { number: "+40", label: "مشروع مُسلّم بنجاح", sublabel: "Web, Mobile & AI Projects" },
    { number: "+30", label: "علامة تجارية تعتمد علينا", sublabel: "Trusted Commercial Brands" }
];

// Marquee Tech Stack & Tools (أحدث التقنيات المعتمدة)
export const brands = [
    { name: "TypeScript", label: "Robust Engineering", category: "tech" },
    { name: "Next.js", label: "Modern Web Apps", category: "tech" },
    { name: "Flutter", label: "iOS & Android Apps", category: "tech" },
    { name: "Node.js", label: "Scalable Backends", category: "tech" },
    { name: "Python", label: "AI & Data Automation", category: "tech" },
    { name: "PostgreSQL", label: "Relational DB", category: "tech" },
    { name: "Redis", label: "High-Speed Cache", category: "tech" },
    { name: "WhatsApp API", label: "Omnichannel AI Agents", category: "tech" },
    { name: "OpenAI", label: "Intelligent Agents", category: "tech" },
    { name: "Docker", label: "Container Architecture", category: "tech" },
    { name: "Figma", label: "UI/UX & Design Systems", category: "media" },
    { name: "After Effects", label: "2D/3D Motion Graphics", category: "media" }
];

// Project Stack Showcase Data (المشاريع الرئيسية الرائدة والحلول الإبداعية)
export const PROJECTS_DATA = [
    {
        id: "creative-branding",
        tone: "1",
        badgeAr: "هويات بصرية وشعارات • Brand Systems",
        badgeEn: "Brand Systems & Identity",
        titleAr: "تصميم الهويات البصرية والشعارات الإبداعية",
        titleEn: "Creative Brand Identity & Iconic Logos",
        lede: "ابتكار هويات بصرية متكاملة وشعارات استثنائية تعكس روح المشروع وتمنحه حضوراً قوياً في السوق.",
        body: "تطوير وتصميم هويات وعلامات تجارية متكاملة تشمل: براند Baker للمخبوزات، منصة أبشر التعليمية (الكويت)، شركة NASRA للشحن واللوجستيات، وهوية منصة العلومنجي في الفيزياء، مع بناء أدلة الهوية والتايبوجرافي.",
        client: "Baker • أبشر (الكويت) • NASRA • العلومنجي",
        tags: ["Logos", "Visual Identity", "Typography"],
        image: "/assets/noqta/noqta-portfolio-slide1.png",
        accent: "#43FB9C",
        bg: "#10162A",
        text: "#FFFFFF"
    },
    {
        id: "digital-marketing",
        tone: "2",
        badgeAr: "تسويق رقمي • Marketing Services",
        badgeEn: "Marketing Strategy & Growth",
        titleAr: "إدارة الحملات واستراتيجيات التسويق الرقمي",
        titleEn: "Digital Marketing & Campaign Strategy",
        lede: "نحوّل صفحات التواصل الاجتماعي إلى منصات مؤثرة تعكس هوية العلامة التجارية وتبني علاقة حقيقية مع الجمهور.",
        body: "صياغة استراتيجيات تسويق رقمي مدروسة، إدارة احترافية لصناعة المحتوى الجذاب، وإطلاق الحملات الإعلانية الممولة مع التحليل المستمر للأداء لتحقيق أعلى مستويات الوصول والتفاعل ونمو المبيعات.",
        client: "شركات وعلامات تجارية رائدة",
        tags: ["Marketing Strategy", "Content Management", "Paid Ads"],
        image: "/assets/noqta/noqta-marketing-slide10.png",
        accent: "#362488",
        bg: "#FAF7F0",
        text: "#121212"
    },
    {
        id: "media-thumbnails",
        tone: "3",
        badgeAr: "صناعة ميديا • Media & Thumbnails",
        badgeEn: "Thumbnails & Video Media",
        titleAr: "تصاميم الأغلفة الإبداعية وصناعة الميديا (Thumbnails)",
        titleEn: "High-CTR Thumbnails & Visual Media",
        lede: "تصميم أغلفة بصرية فائقة الجاذبية (High-CTR Thumbnails) لصناع المحتوى ومنصات الفيديو لمضاعفة النقرات والمشاهدات.",
        body: "تنفيذ تصاميم فنية مخصصة لليوتيوب وفيسبوك تجمع بين التكوين السينمائي، الإضاءة الدرامية، والتشويق البصري الذي يخطف عين المشاهد من اللحظة الأولى ويرفع معدلات التفاعل والمشاهدة.",
        client: "صناع محتوى • قنوات يوتيوب • منصات تعليمية",
        tags: ["Thumbnails", "High-CTR", "Visual Media"],
        image: "/assets/noqta/noqta-thumbnails-slide9.png",
        accent: "#82A0FF",
        bg: "#151B38",
        text: "#FFFFFF"
    },
    {
        id: "campaign-results",
        tone: "4",
        badgeAr: "أرقام ونتائج موثقة • Growth & Analytics",
        badgeEn: "Analytics & Performance",
        titleAr: "حملات إعلانية تحقق انتشاراً واسعاً وأرقاماً موثقة",
        titleEn: "Data-Driven Ads & Viral Reach",
        lede: "أرقام حقيقية ونتائج موثقة تثبت دقة الاستهداف وقوة الانتشار في الوصول لآلاف العملاء الجدد.",
        body: "إدارة حملة إعلانية حققت أكثر من 35,000 مشاهدة وأكثر من 16,800 مشاهد حقيقي مع أكثر من 2,200 نقرة تفاعلية، بنسبة وصول لجمهور جديد تخطت 86%، محققة أقصى عائد استثماري إعلاني.",
        client: "NM Nursing Mediators وحملات استشارية",
        tags: ["35K+ Views", "86% New Audience", "2.2K Clicks"],
        image: "/assets/noqta/noqta-results-slide13.png",
        accent: "#3DA792",
        bg: "#0D2526",
        text: "#FFFFFF"
    },
    {
        id: "community-growth",
        tone: "5",
        badgeAr: "كيس ستدي تعليمي • Case Study & Community",
        badgeEn: "Community Growth & Case Study",
        titleAr: "بناء وتنمية منصات المحتوى التعليمي ومضاعفة التفاعل",
        titleEn: "Educational Community & Engagement",
        lede: "بناء مجتمعات تفاعلية حية وتنمية الحضور الرقمي للمحاضرين وصنّاع المحتوى التعليمي.",
        body: "حملة تفاعلية موجهة لطلاب الثانوية عبر منصة \"العلومنجي في الفيزياء\"، حققت أكثر من 27,000 مشاهدة و14,000 مشاهد فريد وأكثر من 1,600 تفاعل ونقرة خلال فترة الامتحانات، مع توسيع قاعدة الطلاب والوصول لـ 75% جمهور جديد.",
        client: "منصة ومجتمع العلومنجي في الفيزياء",
        tags: ["27K+ Views", "1.6K Interactions", "EdTech Growth"],
        image: "/assets/noqta/noqta-results-slide14.png",
        accent: "#43FB9C",
        bg: "#1D163D",
        text: "#FFFFFF"
    }
];

// Service Cards Data (منظومة الحلول والخدمات البرمجية المتكاملة)
export const CARDS_DATA = [
    {
        color: 'mint',
        sticker: 'camera',
        title: 'restaurant & pos systems',
        titleAr: 'أنظمة المطاعم ونقاط البيع',
        division: 'Flagship POS & ERP',
        services: [
            'نقاط البيع السريعة السحابية (POS)',
            'دعم العمل أوفلاين (Offline-First)',
            'شاشات المطبخ الذكية (KDS)',
            'متابعة المخزون وتكلفة الوجبات',
            'لوحة تحكم فورية للمالك بالموبايل',
            'تقارير الورديات والمحاسبة الدقيقة'
        ]
    },
    {
        color: 'indigo',
        sticker: 'phone',
        title: 'ai & business automation',
        titleAr: 'ذكاء اصطناعي وأتمتة',
        division: 'AI & Automation',
        services: [
            'وكلاء أذكياء على WhatsApp API',
            'استقبال وإتمام الطلبات الذاتي 24/7',
            'فلترة وتأهيل العملاء (Leads)',
            'دعم اللهجات العربية والإنجليزية',
            'الربط بقواعد البيانات الحالية',
            'أتمتة سير العمل وخفض التكاليف'
        ]
    },
    {
        color: 'violet',
        sticker: 'smiley',
        title: 'mobile applications',
        titleAr: 'تطبيقات الموبايل الذكية',
        division: 'Mobile Engineering',
        services: [
            'تطبيقات iOS & Android بـ Flutter',
            'منصات طلب وتوصيل بدون عمولة',
            'إشعارات فورية مخصصة (Push Alerts)',
            'بوابات دفع إلكترونية ومحافظ رقمية',
            'أنظمة ولاء ونقاط مكافآت للعملاء',
            'مزامنة سريعة مع السيرفرات السحابية'
        ]
    },
    {
        color: 'teal',
        sticker: 'hand',
        title: 'web & cloud platforms',
        titleAr: 'منصات الويب والمواقع الفائقة',
        division: 'Web & Cloud Platforms',
        services: [
            'مواقع سريعة بـ Next.js و React',
            'تهيئة محركات البحث المتقدمة (SEO)',
            'لوحات تحكم إدارية متقدمة الصلاحيات',
            'متاجر إلكترونية ببوابات دفع آمنة',
            'بنية تحتية سحابية عالية الاعتمادية',
            'تصاميم تفاعلية وحركية مبتكرة'
        ]
    },
    {
        color: 'pink',
        sticker: 'heart',
        title: 'custom saas & enterprise',
        titleAr: 'الأنظمة السحابية والـ SaaS',
        division: 'Custom Enterprise & SaaS',
        services: [
            'بناء برمجيات SaaS مخصصة للشركات',
            'تصميم وبرمجة واجهات APIs المعيارية',
            'ربط وتكامل مع أنظمة ERP والمحاسبة',
            'قواعد بيانات مؤمنة بأعلى المعايير',
            'لوحات تحليلات بيانية وإحصائية ذكية',
            'صيانة ودعم فني مستمر وتحديثات 24/7'
        ]
    }
];

// Wiggle Intensity Config
export const WIGGLE_CONFIG = {
    logoTruus: 4,
    socials: 5,
    jobHeading: 1,
    googleMap: 1,
    email: 1,
    whatsapp: 1
};

// Animation Configurations
export const ANIMATION_CONFIG = {
    transitionScribble: {
        strokeWidthStart: "8%",
        strokeWidthMax: "31%",
        scale: 0.7,
        durationIn: 1.4,
        durationOut: 1.8
    }
};
