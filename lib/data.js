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
        id: "restaurant-pos",
        tone: "1",
        badgeAr: "مشروع رئيسي • سوفت وير وإدارة",
        badgeEn: "Flagship • Restaurant & Café OS",
        titleAr: "نظام إدارة المطاعم والكافيهات المتكامل",
        titleEn: "End-to-End F&B Management System",
        lede: "منظومة تشغيل متكاملة من الطاولة حتى الحسابات، تدعم العمل بدون إنترنت (Offline-First) لمواجهة أقصى ضغط تشغيل.",
        body: "نقاط بيع سريعة (POS)، شاشات مطبخ ذكية (KDS)، متابعة المخزون وتكلفة الأطباق، تقارير الورديات، ولوحة تحكم للمالك عبر الموبايل. يخدم أكثر من 25 فرعاً وعالج أكثر من 100,000 طلب.",
        client: "+25 فرع كافيه ومطعم",
        tag: "POS • KDS • Offline-First • Inventory",
        image: "/assets/noqta/noqta-marketing-slide10.png",
        accent: "#43FB9C",
        bg: "#10162A",
        text: "#FFFFFF"
    },
    {
        id: "ai-agents",
        tone: "2",
        badgeAr: "مشروع رئيسي • ذكاء اصطناعي وأتمتة",
        badgeEn: "Flagship • AI Agents & Automation",
        titleAr: "وكلاء الذكاء الاصطناعي للأعمال 24/7",
        titleEn: "Omnichannel Business AI Agents",
        lede: "بناء وتدريب وكلاء ذكاء اصطناعي لأتمتة خدمة العملاء واستقبال الطلبات وتأهيل العملاء المهتمين (Lead Qualification).",
        body: "يعمل على واتساب (WhatsApp Business API)، ماسنجر، وإنستغرام على مدار الساعة دون توقف. مدرب للرد باللهجة العربية والإنجليزية مع ربط تقني فوري بقواعد بيانات الشركة.",
        client: "شركاء نقطة في الأتمتة",
        tag: "WhatsApp API • OpenAI • 24/7 Lead Gen",
        image: "/assets/noqta/noqta-logo-square.png",
        accent: "#362488",
        bg: "#FAF7F0",
        text: "#121212"
    },
    {
        id: "showcase-venues",
        tone: "3",
        badgeAr: "مشروع رئيسي • ويب وهوية رقمية",
        badgeEn: "Flagship • Showcase Venue Websites",
        titleAr: "مواقع تعريفية مخصصة للأماكن والبراندات",
        titleEn: "High-Performance Venue Platforms",
        lede: "مواقع تسويقية فائقة السرعة للأماكن والعلامات التجارية التي تمتلك اسماً وتريد حضوراً رقمياً يليق بها.",
        body: "قوائم طعام تفاعلية (QR Menu)، أنظمة حجز مباشر، تصوير عالي الجودة، تحسين محركات البحث المحلي (SEO)، ولوحة تحكم تمكن صاحب المكان من تعديل الأسعار والمحتوى بدون كود.",
        client: "أماكن وعلامات تجارية رائدة",
        tag: "Digital Menus • SEO • Mobile-First",
        image: "/assets/noqta/noqta-portfolio-slide1.png",
        accent: "#82A0FF",
        bg: "#151B38",
        text: "#FFFFFF"
    },
    {
        id: "creative-branding",
        tone: "4",
        badgeAr: "هويات بصرية وشعارات",
        badgeEn: "Brand Systems & Identity",
        titleAr: "تصميم الهويات البصرية والشعارات الإبداعية",
        titleEn: "Iconic Brand Systems",
        lede: "ابتكار هويات بصرية مميزة وشعارات متقنة تعكس روح المشروع وتمنحه حضوراً استثنائياً في السوق.",
        body: "تطوير هويات لعلامات تجارية رائدة مثل: براند Baker للمخبوزات، منصة أبشر التعليمية (الكويت)، شركة NASRA للحلول اللوجستية، والعلومنجي في الفيزياء.",
        client: "Baker • أبشر • NASRA • العلومنجي",
        tag: "Branding • Logo Design • Typography",
        image: "/assets/noqta/noqta-portfolio-slide1.png",
        accent: "#3DA792",
        bg: "#0D2526",
        text: "#FFFFFF"
    },
    {
        id: "media-campaigns",
        tone: "5",
        badgeAr: "ميديا وتسويق رقمي",
        badgeEn: "Media Production & Viral Ads",
        titleAr: "صناعة الميديا وحملات التسويق الرقمي",
        titleEn: "High-CTR Visuals & Paid Ads",
        lede: "تصاميم أغلفة (Thumbnails) عالية الجاذبية، موشن جرافيكس، وحملات إعلانية ممولة تحقق انتشاراً حقيقياً وموثقاً بالأرقام.",
        body: "نحول صفحات التواصل إلى منصات مؤثرة تبني علاقة حقيقية مع الجمهور، مع نتائج مثبتة تفوق 35,000 مشاهدة و86% وصول لجمهور جديد في الحملة الواحدة.",
        client: "حملات وصناع محتوى",
        tag: "35K+ Views • High-CTR • Motion Ads",
        image: "/assets/noqta/noqta-thumbnails-slide9.png",
        accent: "#43FB9C",
        bg: "#1D163D",
        text: "#FFFFFF"
    }
];

// Service Cards Data (التخصصات الخمسة للحلول التقنية والإبداعية)
export const CARDS_DATA = [
    {
        color: 'mint',
        sticker: 'camera',
        title: 'restaurant & pos systems',
        titleAr: 'أنظمة المطاعم ونقاط البيع',
        division: 'Flagship Tech',
        services: [
            'نقاط البيع السريعة (POS)',
            'دعم العمل أوفلاين (Offline-First)',
            'شاشات المطبخ الذكية (KDS)',
            'متابعة المخزون وتكلفة الوجبات',
            'لوحة تحكم فورية للمالك',
            'تقارير الورديات والمالية'
        ]
    },
    {
        color: 'indigo',
        sticker: 'phone',
        title: 'ai & business automation',
        titleAr: 'ذكاء اصطناعي وأتمتة',
        division: 'AI Engineering',
        services: [
            'وكلاء أذكياء على WhatsApp API',
            'استقبال الطلبات الذاتي 24/7',
            'فلترة وتأهيل العملاء (Leads)',
            'تحويل المحادثة لموظف بشري',
            'دعم اللهجات العربية والإنجليزية',
            'الربط بقواعد البيانات الحالية'
        ]
    },
    {
        color: 'violet',
        sticker: 'smiley',
        title: 'apps & web platforms',
        titleAr: 'تطبيقات الموبايل والويب',
        division: 'Software Dev',
        services: [
            'تطبيقات iOS & Android بـ Flutter',
            'منصات توصيل مباشر بدون عمولة',
            'لوحات تحكم بصلاحيات متقدمة',
            'متاجر إلكترونية ببوابات دفع',
            'أنظمة ولاء ومكافآت رقمية',
            'ربط الـ APIs وبرامج المحاسبة'
        ]
    },
    {
        color: 'teal',
        sticker: 'hand',
        title: 'brand identity & logos',
        titleAr: 'الهويات البصرية والشعارات',
        division: 'Creative Branding',
        services: [
            'بناء الهويات البصرية للشركات',
            'تصميم شعارات أيقونية حديثة',
            'دلائل الهوية والألوان والخطوط',
            'تصاميم التغليف والطباعة',
            'قوائم طعام رقمية (QR Menus)'
        ]
    },
    {
        color: 'pink',
        sticker: 'heart',
        title: 'marketing & media',
        titleAr: 'التسويق الرقمي والميديا',
        division: 'Media & Growth',
        services: [
            'إدارة المنصات والحملات الممولة',
            'تصاميم ثمبنيلز لليوتيوب (High CTR)',
            'إنتاج فيديو وموشن جرافيكس',
            'استراتيجيات الانتشار والنمو',
            'تحليل الأداء وتقارير النتائج'
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
        durationIn: 2.2,
        durationOut: 2.7
    }
};
