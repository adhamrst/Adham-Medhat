import { PUBLIC_MEDIA_ASSETS } from './entityConfig';

export type Language = 'en' | 'ar';
export type CredentialCategoryId = 'all' | 'business' | 'medical' | 'design' | 'entrepreneurship';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface JourneyPillar {
  id: string;
  index: string;
  shortTitle: LocalizedText;
  title: LocalizedText;
  institution: LocalizedText;
  summary: LocalizedText;
  narrative: LocalizedText;
  focusAreas: { en: string[]; ar: string[] };
  synthesisNote: LocalizedText;
}

export interface CredentialItem {
  id: string;
  categoryId: Exclude<CredentialCategoryId, 'all'>;
  title: LocalizedText;
  category: LocalizedText;
  issuer: LocalizedText;
  year: string;
  issuedTo: string;
  image: string;
  imageAlt: LocalizedText;
  description: LocalizedText;
  highlights: { en: string[]; ar: string[] };
  linkedinUrl: string;
  isUserUploaded?: boolean;
}

export interface VentureItem {
  id: string;
  size: 'featured' | 'standard';
  eyebrow: LocalizedText;
  title: LocalizedText;
  role: LocalizedText;
  summary: LocalizedText;
  detailBody: LocalizedText;
  capabilities: { en: string[]; ar: string[] };
  image: string;
  imageAlt: LocalizedText;
  externalUrl?: string;
  externalLabel?: LocalizedText;
}

export interface SocialLinkItem {
  id: 'linkedin' | 'telegram' | 'instagram' | 'youtube' | 'facebook' | 'whatsapp';
  name: string;
  handle: string;
  role: LocalizedText;
  url: string;
}

export const ASSETS = {
  portrait: PUBLIC_MEDIA_ASSETS.portrait,
  ogCover: PUBLIC_MEDIA_ASSETS.ogCover,
  certMicroMba: PUBLIC_MEDIA_ASSETS.certMicroMba,
  certGraphicDesign: PUBLIC_MEDIA_ASSETS.certGraphicDesign,
  certMedical: PUBLIC_MEDIA_ASSETS.certMedical,
  ventureRst: PUBLIC_MEDIA_ASSETS.ventureRst,
  ventureDesign: PUBLIC_MEDIA_ASSETS.ventureDesign,
} as const;

export const LINKEDIN_CERTIFICATIONS_URL =
  'https://linkedin.com/in/adhamrst/details/certifications/';

export const CREDENTIAL_CATEGORIES: Array<{
  id: CredentialCategoryId;
  label: LocalizedText;
}> = [
  { id: 'all', label: { en: 'All Credentials', ar: 'جميع الشهادات' } },
  { id: 'business', label: { en: 'Business & MBA', ar: 'الأعمال والـ MBA' } },
  { id: 'medical', label: { en: 'Medicine', ar: 'الطب البشري' } },
  { id: 'design', label: { en: 'Design & Identity', ar: 'التصميم والهوية' } },
  { id: 'entrepreneurship', label: { en: 'Ventures', ar: 'ريادة الأعمال' } },
];

export const IDENTITY_METRICS: Array<{
  label: LocalizedText;
  value: LocalizedText;
  sublabel: LocalizedText;
}> = [
  {
    label: { en: 'Academic Track', ar: 'المسار الأكاديمي' },
    value: { en: 'Horus University', ar: 'جامعة حورس' },
    sublabel: { en: 'Faculty of Medicine (MBBS)', ar: 'كلية الطب البشري' },
  },
  {
    label: { en: 'Executive Education', ar: 'التعليم الإداري' },
    value: { en: 'Micro MBA', ar: 'مايكرو MBA' },
    sublabel: { en: 'Strategic Business Management', ar: 'الإدارة الاستراتيجية للأعمال' },
  },
  {
    label: { en: 'Venture Leadership', ar: 'ريادة الأعمال' },
    value: { en: 'RST Central', ar: 'RST Central' },
    sublabel: { en: 'Founder · Digital Fabrication', ar: 'المؤسس · التصنيع الرقمي' },
  },
  {
    label: { en: 'Unified Handle', ar: 'الهوية الرقمية الموحدة' },
    value: { en: '@adhamrst', ar: '@adhamrst' },
    sublabel: { en: 'Adham Ahmed Medhat', ar: 'أدهم أحمد مدحت' },
  },
];

export const JOURNEY_PILLARS: JourneyPillar[] = [
  {
    id: 'medicine',
    index: '01',
    shortTitle: { en: 'Medicine', ar: 'الطب البشري' },
    title: { en: 'Medicine & Clinical Precision', ar: 'الطب البشري والانضباط التحليلي' },
    institution: { en: 'Horus University · Faculty of Medicine', ar: 'جامعة حورس · كلية الطب البشري' },
    summary: {
      en: 'Building first-principles diagnostic rigor and evidence-based decision making inside modern medical sciences.',
      ar: 'بناء منهجية تشخيصية دقيقة وتفكير تحليلي قائم على الأدلة العلمية داخل علوم الطب الحديث.',
    },
    narrative: {
      en: 'Studying human medicine at Horus University trains a specific mental architecture: observing complex biological systems under pressure, separating signal from noise, and acting with disciplined accountability. That clinical methodology anchors every strategic and creative project I lead outside the lecture hall.',
      ar: 'دراسة الطب البشري في جامعة حورس تبني بنية ذهنية فريدة: قراءة الأنظمة الحيوية المعقدة بدقة، الفصل بين المؤشرات الجوهرية والضوضاء، واتخاذ القرار بمسؤولية علمية كاملة. هذه المنهجية السريرية هي الأساس الذي تنطلق منه كل خطواتي في إدارة الأعمال والتصميم.',
    },
    focusAreas: {
      en: [
        'Clinical Systems Thinking',
        'Evidence-Based Research',
        'Healthcare Innovation',
        'Academic Medical Leadership',
      ],
      ar: [
        'التفكير التحليلي السريري',
        'البحث العلمي القائم على الدليل',
        'الابتكار في الرعاية الصحية',
        'القيادة الأكاديمية الطبية',
      ],
    },
    synthesisNote: {
      en: 'Medicine supplies the analytical rigor and human empathy that prevent business and design from becoming superficial.',
      ar: 'الطب يمنحني الدقة العلمية والبعد الإنساني، فيجعل قرارات الإدارة والتصميم مبنية على أثر حقيقي لا شكلي.',
    },
  },
  {
    id: 'mba',
    index: '02',
    shortTitle: { en: 'Micro MBA', ar: 'إدارة الأعمال' },
    title: { en: 'Strategic Management & Growth', ar: 'الإدارة الاستراتيجية والنمو (Micro MBA)' },
    institution: { en: 'Horus University · Micro MBA Credential', ar: 'جامعة حورس · شهادة Micro MBA' },
    summary: {
      en: 'Translating executive management theory, unit economics, and market positioning into executable growth systems.',
      ar: 'تحويل نظريات الإدارة التنفيذية والتسويق واستراتيجيات التوسع إلى أنظمة عمل قابلة للتنفيذ الفعلي.',
    },
    narrative: {
      en: 'Completing the Micro MBA at Horus University bridged the gap between raw ambition and structured operational leadership. From market analysis and financial planning to brand positioning and customer lifecycle design, every venture decision is grounded in measurable commercial clarity.',
      ar: 'الحصول على شهادة Micro MBA من جامعة حورس مثّل الجسر العملي بين الطموح الريادي والقيادة المؤسسية المنظمة؛ بداية من تحليل السوق والتخطيط المالي، وصولاً إلى بناء الميزة التنافسية وإدارة دورة حياة العميل بوضوح رقمي دقيق.',
    },
    focusAreas: {
      en: [
        'Strategic Market Positioning',
        'Operational Scaling',
        'Commercial Growth Strategy',
        'Executive Decision Frameworks',
      ],
      ar: [
        'التموضع الاستراتيجي في السوق',
        'تطوير وتوسيع العمليات',
        'استراتيجيات النمو التجاري',
        'أطر اتخاذ القرار التنفيذي',
      ],
    },
    synthesisNote: {
      en: 'Management science turns creative concepts and technical prototypes into resilient, revenue-generating organizations.',
      ar: 'علوم الإدارة تحول الأفكار الإبداعية والنماذج التقنية إلى كيانات اقتصادية مستدامة وقابلة للنمو.',
    },
  },
  {
    id: 'ventures',
    index: '03',
    shortTitle: { en: 'RST Central', ar: 'ريادة الأعمال' },
    title: { en: 'Entrepreneurship & Digital Fabrication', ar: 'تأسيس وقيادة RST Central' },
    institution: { en: 'Founder · RST Central', ar: 'المؤسس · منصة RST Central' },
    summary: {
      en: 'Founding and directing a modern manufacturing, digital fabrication, and e-commerce platform built for precision.',
      ar: 'تأسيس وقيادة منصة أعمال تصنيعية وتجارة إلكترونية متطورة تجمع بين دقة التنفيذ وسلاسة التجربة الرقمية.',
    },
    narrative: {
      en: 'As founder of RST Central, I oversee the intersection of physical fabrication workflows and modern e-commerce infrastructure. We focus on repeatable manufacturing quality, clear customer communication, and brand-first product presentation that elevates local fabrication to international presentation standards.',
      ar: 'بصفتي مؤسس RST Central، أقود التكامل بين خطوط التصنيع الرقمي الدقيق وبنية التجارة الإلكترونية الحديثة، مع تركيز كامل على جودة التنفيذ المتكررة، وسلاسة تجربة العميل، وتقديم المنتجات بمعايير بصرية وتجارية عالمية.',
    },
    focusAreas: {
      en: [
        'Digital Fabrication Workflows',
        'E-Commerce Architecture',
        'Product Development & Prototyping',
        'Brand Operations & Fulfillment',
      ],
      ar: [
        'سلاسل التصنيع الرقمي الدقيق',
        'بنية التجارة الإلكترونية',
        'تطوير المنتجات والنماذج الأولية',
        'إدارة العمليات وسلاسل التوريد',
      ],
    },
    synthesisNote: {
      en: 'RST Central is the living laboratory where strategic business training and visual craft meet physical production.',
      ar: 'تمثل RST Central المختبر العملي الحي الذي تتقاطع فيه الإدارة الاستراتيجية والإبداع البصري مع التصنيع الفعلي.',
    },
  },
  {
    id: 'design',
    index: '04',
    shortTitle: { en: 'Visual Design', ar: 'التصميم الجرافيكي' },
    title: { en: 'Creative Direction & Visual Identity', ar: 'الإبداع البصري وصناعة الهويات' },
    institution: { en: 'Certified Visual & Graphic Designer', ar: 'مصمم جرافيك وهويات بصرية معتمد' },
    summary: {
      en: 'Crafting authoritative brand systems, editorial typography, and digital interfaces with timeless restraint.',
      ar: 'تصميم أنظمة هويات بصرية راقية وتايبوغرافي تحريري ومنتجات رقمية تتسم بالوضوح والفخامة الهادئة.',
    },
    narrative: {
      en: 'Design is never decoration—it is cognitive clarity made visible. My background in graphic design and visual identity enables me to direct brand architecture, packaging systems, and digital storefronts from concept to final pixel without losing fidelity between strategy and aesthetics.',
      ar: 'التصميم ليس زينة سطحية، بل وضوح فكري مُجسّد بصرياً. تمنحني خبرتي في التصميم الجرافيكي والهويات البصرية القدرة على قيادة الهوية الكاملة للمشاريع، من الشعار والتغليف حتى الواجهات الرقمية، دون أي فجوة بين الرؤية الاستراتيجية والتنفيذ الجمالي.',
    },
    focusAreas: {
      en: [
        'Brand Identity Architecture',
        'Editorial & Typographic Systems',
        'Packaging & Product Visuals',
        'Digital Campaign Art Direction',
      ],
      ar: [
        'بناء أنظمة الهويات البصرية',
        'التصميم التحريري والتايبوغرافي',
        'تصميم التغليف وعرض المنتجات',
        'الإخراج الفني للحملات الرقمية',
      ],
    },
    synthesisNote: {
      en: 'Visual fluency lets complex scientific and commercial ideas communicate authority within the first three seconds.',
      ar: 'اللغة البصرية المحكمة تجعل الأفكار العلمية والتجارية تفرض حضورها ومصداقيتها خلال الثواني الأولى.',
    },
  },
];

export const CREDENTIALS: CredentialItem[] = [
  {
    id: 'micro-mba',
    categoryId: 'business',
    title: {
      en: 'Micro MBA in Strategic Management',
      ar: 'مايكرو MBA في الإدارة الاستراتيجية للأعمال',
    },
    category: { en: 'Executive Business Credential', ar: 'اعتماد تنفيذي في إدارة الأعمال' },
    issuer: { en: 'Horus University (جامعة حورس)', ar: 'جامعة حورس' },
    year: '2025',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.certMicroMba,
    imageAlt: {
      en: 'Horus University Executive Micro MBA Diploma awarded to Adham Ahmed (Adham Medhat)',
      ar: 'شهادة Micro MBA من جامعة حورس باسم أدهم أحمد (أدهم مدحت)',
    },
    description: {
      en: 'Intensive executive program covering corporate strategy, marketing systems, financial analysis, organizational leadership, and scalable venture execution.',
      ar: 'برنامج تنفيذي مكثف يغطي الاستراتيجية المؤسسية، أنظمة التسويق، التحليل المالي، القيادة التنظيمية، وبناء خطط نمو الشركات الناشئة.',
    },
    highlights: {
      en: [
        'Strategic Management & Competitive Positioning',
        'Marketing Architecture & Brand Equity',
        'Financial Literacy & Venture Unit Economics',
      ],
      ar: [
        'الإدارة الاستراتيجية وبناء الميزة التنافسية',
        'هندسة التسويق وقيمة العلامة التجارية',
        'التحليل المالي واقتصاديات المشاريع',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'graphic-design',
    categoryId: 'design',
    title: {
      en: 'Visual Identity & Graphic Design Certification',
      ar: 'شهادة احترافية في التصميم الجرافيكي والهوية البصرية',
    },
    category: { en: 'Creative Direction Accreditation', ar: 'اعتماد الإبداع والتصميم البصري' },
    issuer: { en: 'Verified on LinkedIn', ar: 'موثّقة على LinkedIn' },
    year: '2024',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.certGraphicDesign,
    imageAlt: {
      en: 'Visual Identity and Graphic Design Professional Certification awarded to Adham Ahmed (Adham Medhat)',
      ar: 'شهادة التصميم الجرافيكي والهوية البصرية باسم أدهم أحمد (أدهم مدحت)',
    },
    description: {
      en: 'Specialized mastery in modernist grid architecture, brand mark construction, editorial typography, print production standards, and cohesive digital design systems.',
      ar: 'تخصص متقدم في بناء الشبكات التصميمية، هندسة الشعارات والهويات البصرية، التايبوغرافي التحريري، ومعايير الطباعة والتصميم الرقمي المتكامل.',
    },
    highlights: {
      en: [
        'Brand Identity Systems & Logo Geometry',
        'Swiss Editorial Grid & Typographic Hierarchy',
        'Commercial Packaging & Digital Art Direction',
      ],
      ar: [
        'أنظمة الهويات البصرية وهندسة الشعارات',
        'الشبكات التحريرية والتسلسل التايبوغرافي',
        'تصميم التغليف والإخراج الفني الرقمي',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'medical-studies',
    categoryId: 'medical',
    title: {
      en: 'Faculty of Medicine — Academic Standing',
      ar: 'كلية الطب البشري — الدراسات الأكاديمية والسريرية',
    },
    category: { en: 'Medical Sciences Degree Track', ar: 'المسار الأكاديمي للطب البشري' },
    issuer: { en: 'Horus University (جامعة حورس)', ar: 'جامعة حورس' },
    year: 'Ongoing',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.certMedical,
    imageAlt: {
      en: 'Faculty of Medicine Horus University academic folder and stethoscope representing Adham Medhat medical studies',
      ar: 'ملف كلية الطب البشري بجامعة حورس الخاص بدراسة أدهم مدحت',
    },
    description: {
      en: 'Pursuing the Bachelor of Medicine and Surgery (MBBS) at Horus University, integrating foundational biomedical sciences with clinical reasoning and healthcare innovation.',
      ar: 'دراسة بكالوريوس الطب والجراحة بجامعة حورس، مع الدمج بين العلوم الطبية الأساسية والتفكير السريري والاهتمام بالابتكار الصحي.',
    },
    highlights: {
      en: [
        'Biomedical Foundations & Pathophysiology',
        'Clinical Diagnostic Methodology',
        'Health-Tech & Medical Communication Interest',
      ],
      ar: [
        'العلوم الطبية الحيوية والأسس التشخيصية',
        'المنهجية السريرية المبنية على الدليل',
        'تقاطع الطب مع التكنولوجيا والتواصل الصحي',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'rst-leadership',
    categoryId: 'entrepreneurship',
    title: {
      en: 'RST Central — Founding & Fabrication Operations',
      ar: 'تأسيس وقيادة عمليات التصنيع الرقمي — RST Central',
    },
    category: { en: 'Entrepreneurial Record', ar: 'سجل ريادة الأعمال والتأسيس' },
    issuer: { en: 'RST Central Enterprise', ar: 'مؤسسة RST Central' },
    year: 'Founder',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.ventureRst,
    imageAlt: {
      en: 'RST Central precision digital fabrication and manufacturing studio led by Adham Medhat',
      ar: 'استوديو التصنيع الرقمي الدقيق لمنصة RST Central التي أسسها أدهم مدحت',
    },
    description: {
      en: 'End-to-end founding leadership of RST Central, bridging precision digital fabrication, product engineering workflows, and direct-to-client e-commerce.',
      ar: 'قيادة تأسيس وتشغيل RST Central لربط تقنيات التصنيع الرقمي الدقيق وتطوير المنتجات بمنصة تجارة إلكترونية حديثة موجهة للعملاء.',
    },
    highlights: {
      en: [
        'End-to-End Digital Fabrication Pipeline',
        'Brand Strategy & E-Commerce Fulfillment',
        'Client Prototyping & Custom Production',
      ],
      ar: [
        'سلسلة متكاملة للتصنيع الرقمي الدقيق',
        'استراتيجية العلامة التجارية والتجارة الإلكترونية',
        'تنفيذ النماذج الأولية والإنتاج المخصص',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'brand-monographs',
    categoryId: 'design',
    title: {
      en: 'Brand Architecture & Editorial Typography',
      ar: 'هندسة العلامات التجارية والتايبوغرافي التحريري',
    },
    category: { en: 'LinkedIn Verified Credential', ar: 'اعتماد موثّق عبر LinkedIn' },
    issuer: { en: 'LinkedIn Certifications Archive', ar: 'أرشيف شهادات LinkedIn' },
    year: '2024',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.ventureDesign,
    imageAlt: {
      en: 'Brand architecture and editorial typography portfolio certification for Adham Medhat',
      ar: 'اعتماد هندسة العلامات التجارية والتصميم التحريري لأدهم مدحت',
    },
    description: {
      en: 'Advanced methodology in visual identity guidelines, bilingual Arabic-Latin typographic pairing, luxury print collateral, and cohesive brand books.',
      ar: 'منهجية متقدمة في بناء أدلة الهوية البصرية، مواءمة الخطوط العربية واللاتينية، وتصميم المطبوعات والكتب التعريفية للعلامات التجارية.',
    },
    highlights: {
      en: [
        'Complete Brand Books & Usage Systems',
        'Bilingual Arabic & English Typography',
        'Art Direction for Digital & Physical Touchpoints',
      ],
      ar: [
        'إعداد أدلة الهوية البصرية الشاملة',
        'التناغم بين الخطوط العربية والإنجليزية',
        'الإخراج الفني للمنتجات الرقمية والمطبوعة',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'strategic-marketing',
    categoryId: 'business',
    title: {
      en: 'Strategic Marketing & Commercial Growth',
      ar: 'التسويق الاستراتيجي وتطوير النمو التجاري',
    },
    category: { en: 'LinkedIn Verified Credential', ar: 'اعتماد موثّق عبر LinkedIn' },
    issuer: { en: 'Horus University · Executive Track', ar: 'جامعة حورس · المسار التنفيذي' },
    year: '2025',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.certMicroMba,
    imageAlt: {
      en: 'Strategic marketing and commercial growth credential awarded to Adham Ahmed (Adham Medhat)',
      ar: 'شهادة التسويق الاستراتيجي والنمو التجاري لأدهم أحمد مدحت',
    },
    description: {
      en: 'Applied frameworks for go-to-market positioning, audience segmentation, value-proposition engineering, and high-trust digital acquisition.',
      ar: 'أطر عملية لخطط دخول السوق، تحليل الشرائح المستهدفة، صياغة القيمة التنافسية، وبناء قنوات استحواذ رقمية عالية الثقة.',
    },
    highlights: {
      en: [
        'Go-to-Market Strategy & Positioning',
        'Brand Trust & Funnel Conversion Design',
        'Customer Retention & Lifetime Value',
      ],
      ar: [
        'استراتيجيات دخول السوق والتموضع',
        'تصميم مسارات التحويل وبناء الثقة',
        'الاحتفاظ بالعملاء وتعظيم القيمة',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'clinical-research',
    categoryId: 'medical',
    title: {
      en: 'Evidence-Based Medicine & Clinical Inquiry',
      ar: 'الطب القائم على الدليل ومنهجية البحث السريري',
    },
    category: { en: 'Academic Medical Track', ar: 'المسار الأكاديمي الطبي' },
    issuer: { en: 'Horus University · Faculty of Medicine', ar: 'كلية الطب البشري · جامعة حورس' },
    year: '2025',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.certMedical,
    imageAlt: {
      en: 'Evidence-based medicine and clinical inquiry credential for Adham Medhat',
      ar: 'شهادة الطب القائم على الدليل والبحث السريري لأدهم مدحت',
    },
    description: {
      en: 'Structured training in critical literature appraisal, clinical diagnostic frameworks, and ethical biomedical communication.',
      ar: 'تدريب منهجي في تقييم الأبحاث الطبية، أطر التشخيص السريري المنظم، وأخلاقيات التواصل الطبي والعلمي.',
    },
    highlights: {
      en: [
        'Critical Appraisal of Clinical Literature',
        'Structured Diagnostic Reasoning',
        'Medical Ethics & Patient Communication',
      ],
      ar: [
        'التقييم النقدي للأبحاث والمراجع الطبية',
        'التفكير التشخيصي المنظم',
        'أخلاقيات المهنة والتواصل الطبي',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
  {
    id: 'ecommerce-fabrication',
    categoryId: 'entrepreneurship',
    title: {
      en: 'Digital Commerce & Production Management',
      ar: 'إدارة التجارة الرقمية وعمليات الإنتاج الحديث',
    },
    category: { en: 'Venture Operations Record', ar: 'سجل إدارة العمليات والمشاريع' },
    issuer: { en: 'RST Central Operations', ar: 'عمليات RST Central' },
    year: '2025',
    issuedTo: 'Issued to: Adham Ahmed (Adham Medhat)',
    image: ASSETS.ventureRst,
    imageAlt: {
      en: 'Digital commerce and precision production management for RST Central',
      ar: 'إدارة التجارة الرقمية والإنتاج الدقيق في RST Central',
    },
    description: {
      en: 'Designing scalable order pipelines, automated business concierge support, and precision quality assurance for custom fabrication clients.',
      ar: 'تصميم مسارات طلبات قابلة للتوسع، أتمتة خدمة عملاء الأعمال، وضبط معايير الجودة لعملاء التصنيع الرقمي المخصص.',
    },
    highlights: {
      en: [
        'Automated Client Concierge & Order Intake',
        'Quality Control & Small-Batch Production',
        'End-to-End Customer Delivery Experience',
      ],
      ar: [
        'أتمتة استقبال الطلبات وخدمة العملاء',
        'ضبط الجودة والإنتاج المخصص',
        'إدارة تجربة العميل حتى التسليم',
      ],
    },
    linkedinUrl: LINKEDIN_CERTIFICATIONS_URL,
  },
];

export const VENTURES: VentureItem[] = [
  {
    id: 'rst-central',
    size: 'featured',
    eyebrow: { en: 'Primary Venture · Founder', ar: 'المشروع الرئيسي · المؤسس' },
    title: { en: 'RST Central', ar: 'RST Central' },
    role: {
      en: 'Digital Fabrication, Precision Manufacturing & E-Commerce',
      ar: 'التصنيع الرقمي الدقيق ومنصة التجارة الإلكترونية',
    },
    summary: {
      en: 'An integrated fabrication and digital commerce platform transforming engineered concepts into precision physical products with elevated industrial design.',
      ar: 'منصة تصنيعية وتجارية متكاملة تحوّل الأفكار الهندسية والتصميمية إلى منتجات مادية عالية الدقة بمعايير تنفيذ احترافية.',
    },
    detailBody: {
      en: 'Founded by Adham Medhat, RST Central operates at the crossroads of digital fabrication, precision manufacturing, and modern online commerce. From rapid custom prototyping to finished commercial editions, the venture combines operational discipline from Micro MBA frameworks with cohesive industrial aesthetics.',
      ar: 'أسس أدهم مدحت منصة RST Central لتكون نقطة التقاء بين التصنيع الرقمي الدقيق والتجارة الإلكترونية الحديثة. بدءاً من تنفيذ النماذج الأولية السريعة وحتى الإنتاج التجاري المتكامل، تجمع المنصة بين الانضباط الإداري والهوية التصميمية الراقية.',
    },
    capabilities: {
      en: [
        'Precision Digital Fabrication',
        'Custom Prototyping & Small-Batch Runs',
        'Direct E-Commerce Platform',
        'Quality-Controlled Industrial Finishing',
      ],
      ar: [
        'التصنيع الرقمي عالي الدقة',
        'النماذج الأولية والإنتاج المخصص',
        'منصة تجارة إلكترونية مباشرة',
        'معايير تشطيب وضبط جودة صارمة',
      ],
    },
    image: ASSETS.ventureRst,
    imageAlt: {
      en: 'RST Central industrial digital fabrication studio founded by Adham Medhat',
      ar: 'بيئة عمل التصنيع الرقمي في منصة RST Central',
    },
    externalUrl: 'https://rstcentral.com',
    externalLabel: { en: 'Visit rstcentral.com', ar: 'زيارة rstcentral.com' },
  },
  {
    id: 'creative-design',
    size: 'standard',
    eyebrow: { en: 'Creative Practice · Visual Systems', ar: 'الممارسة الإبداعية · الهويات البصرية' },
    title: { en: 'Creative & Graphic Design', ar: 'التصميم الجرافيكي والهوية البصرية' },
    role: {
      en: 'Brand Monographs, Identity Architecture & Digital Visuals',
      ar: 'بناء العلامات التجارية، التايبوغرافي، والإخراج الفني',
    },
    summary: {
      en: 'Visual identity systems crafted with architectural restraint, crisp bilingual typography, and commercial clarity for founders and emerging brands.',
      ar: 'تصميم أنظمة هوية بصرية متكاملة وتايبوغرافي عربي وإنجليزي محكم للعلامات التجارية ورواد الأعمال.',
    },
    detailBody: {
      en: 'Each identity engagement starts with strategic positioning before opening a canvas. Deliverables encompass bespoke logo geometry, color and type systems, print-ready packaging, and cohesive digital presence kits built to earn instant trust.',
      ar: 'يبدأ كل مشروع تصميمي بفهم عميق للتموضع التجاري قبل البدء بالتنفيذ، ليشمل هندسة الشعار، نظام الألوان والخطوط، تصميم التغليف، وحزمة الحضور الرقمي الكاملة التي تمنح العلامة مصداقية فورية.',
    },
    capabilities: {
      en: [
        'Complete Brand Identity Systems',
        'Bilingual Arabic & Latin Typography',
        'Packaging & Print Direction',
        'Social & Web Launch Art Direction',
      ],
      ar: [
        'أنظمة هوية بصرية شاملة',
        'تايبوغرافي عربي وإنجليزي متناغم',
        'إخراج فني للتغليف والمطبوعات',
        'توجيه بصري للمنصات الرقمية',
      ],
    },
    image: ASSETS.ventureDesign,
    imageAlt: {
      en: 'Luxury brand identity monograph and typographic guidelines created in Adham Medhat design practice',
      ar: 'دليل هوية بصرية وتصميم جرافيك احترافي',
    },
  },
  {
    id: 'medical-academic',
    size: 'standard',
    eyebrow: { en: 'Academic Pillar · Horus University', ar: 'المحور الطبي · جامعة حورس' },
    title: { en: 'Healthcare & Medical Studies', ar: 'الطب البشري والأنشطة الأكاديمية' },
    role: {
      en: 'Faculty of Medicine · Clinical Inquiry & Health Innovation',
      ar: 'كلية الطب البشري · البحث الأكاديمي والابتكار الصحي',
    },
    summary: {
      en: 'Active medical training at Horus University paired with an interest in clear medical communication, clinical systems, and modern healthcare technology.',
      ar: 'دراسة أكاديمية وسريرية للطب البشري بجامعة حورس مع اهتمام خاص بالتواصل الطبي الواضح وتقاطع الرعاية الصحية بالتقنية.',
    },
    detailBody: {
      en: 'Beyond core coursework at Horus University Faculty of Medicine, I explore how visual clarity, structured management, and digital tooling can improve medical education, clinical workflows, and patient-facing health communication.',
      ar: 'إلى جانب الدراسة الأكاديمية في كلية الطب البشري بجامعة حورس، أستكشف كيفية توظيف الوضوح البصري والإدارة الحديثة والأدوات الرقمية لتطوير التعليم الطبي وتحسين جودة التواصل الصحي.',
    },
    capabilities: {
      en: [
        'Horus University MBBS Curriculum',
        'Evidence-Based Clinical Reading',
        'Visual Medical Education Materials',
        'Healthcare Entrepreneurship Exploration',
      ],
      ar: [
        'برنامج بكالوريوس الطب بجامعة حورس',
        'التفكير التشخيصي القائم على الدليل',
        'تبسيط المحتوى الطبي بصرياً',
        'استكشاف ريادة الأعمال في القطاع الصحي',
      ],
    },
    image: ASSETS.certMedical,
    imageAlt: {
      en: 'Faculty of Medicine Horus University academic honors folder and stethoscope',
      ar: 'ملف الدراسات الطبية بكلية الطب جامعة حورس',
    },
  },
];

export const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'in/adhamrst',
    role: { en: 'Credentials, Executive & Academic Network', ar: 'الشهادات والشبكة المهنية والأكاديمية' },
    url: 'https://linkedin.com/in/adhamrst',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    handle: '@adhamrst',
    role: { en: 'Direct Correspondence via @adhamrst', ar: 'مراسلة مباشرة عبر الهاندل @adhamrst' },
    url: 'https://t.me/adhamrst',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@adhamrst',
    role: { en: 'Visual Journal & Creative Direction', ar: 'اليوميات البصرية والأعمال الإبداعية' },
    url: 'https://instagram.com/adhamrst',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@adhamrst',
    role: { en: 'Video Insights & Showcases', ar: 'المحتوى المرئي والعروض' },
    url: 'https://youtube.com/@adhamrst',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'fb.com/adhamrstt',
    role: { en: 'Public Profile & Community', ar: 'الصفحة الرسمية والتواصل' },
    url: 'https://facebook.com/adhamrstt',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp · RST Bot',
    handle: '@adhamrst · +1 202-978-0356',
    role: {
      en: 'Personal Handle @adhamrst · Brand US Concierge Bot',
      ar: 'الهاندل الشخصي @adhamrst · وبوت واتساب RST Central',
    },
    url: 'https://wa.me/12029780356?text=Hello%20RST%20Central%20%2F%20Adham%20Medhat%2C%20I%20visited%20adham.rstcentral.com.',
  },
];

export const INQUIRY_TOPICS: Array<{ id: string; label: LocalizedText }> = [
  { id: 'rst-central', label: { en: 'RST Central & Fabrication', ar: 'RST Central والتصنيع الرقمي' } },
  { id: 'design', label: { en: 'Brand Identity & Design', ar: 'الهوية البصرية والتصميم' } },
  { id: 'medical', label: { en: 'Medical / Academic Collaboration', ar: 'تعاون طبي أو أكاديمي' } },
  { id: 'general', label: { en: 'General & Speaking', ar: 'تواصل عام أو استشارات' } },
];

export const UI_COPY = {
  nav: {
    journey: { en: 'Journey', ar: 'المسار' },
    credentials: { en: 'Credentials', ar: 'الشهادات' },
    ventures: { en: 'RST Central', ar: 'RST Central' },
    connect: { en: 'Connect', ar: 'التواصل' },
    vcard: { en: 'Download vCard', ar: 'حفظ جهة الاتصال' },
    vcardSaved: { en: 'vCard Saved', ar: 'تم حفظ البطاقة' },
  },
  audio: {
    play: { en: 'Ambient Sound', ar: 'موسيقى هادئة' },
    playing: { en: 'Sound Playing', ar: 'الموسيقى تعمل' },
    ariaPlay: { en: 'Play calm ambient music', ar: 'تشغيل موسيقى خلفية هادئة' },
    ariaPause: { en: 'Mute ambient music', ar: 'إيقاف الموسيقى الهادئة' },
  },
  hero: {
    kicker: {
      en: 'Medical Student, Horus University · Founder, RST Central',
      ar: 'طالب طب بشري بجامعة حورس · مؤسس RST Central',
    },
    displayName: {
      en: 'Adham Medhat',
      ar: 'أدهم مدحت',
    },
    tagline: {
      en: 'Bridging Medicine, Strategic Business Management, and Creative Digital Design.',
      ar: 'أجمع بين دقة الطب البشري، الإدارة الاستراتيجية للأعمال، والإبداع البصري الرقمي.',
    },
    description: {
      en: 'Medical scholar at Horus University, Micro MBA holder, and Founder of RST Central — uniting analytical precision, executive leadership, and visual craft under one coherent personal entity.',
      ar: 'طالب طب بشري بجامعة حورس، حاصل على شهادة Micro MBA، ومؤسس منصة RST Central — أدمج بين المنهجية العلمية الدقيقة، القيادة التنفيذية، والتصميم البصري الاحترافي في هوية واحدة متكاملة.',
    },
    ctaPrimary: { en: 'Download vCard', ar: 'تحميل كارت التواصل' },
    ctaConnect: { en: 'Connect · @adhamrst', ar: 'تواصل عبر @adhamrst' },
    ctaExplore: { en: 'Explore Credentials', ar: 'معرض الشهادات' },
    portraitCaption: {
      en: 'Official Portrait · Adham Medhat (@adhamrst)',
      ar: 'الصورة الرسمية · أدهم مدحت (@adhamrst)',
    },
  },
  marquee: {
    en: [
      'Horus University Faculty of Medicine',
      'Micro MBA in Strategic Management',
      'Founder at RST Central',
      'Visual Identity & Graphic Design',
      'Digital Fabrication & E-Commerce',
      'Adham Ahmed Medhat · @adhamrst',
    ],
    ar: [
      'كلية الطب البشري بجامعة حورس',
      'شهادة Micro MBA في الإدارة الاستراتيجية',
      'مؤسس منصة RST Central',
      'التصميم الجرافيكي والهوية البصرية',
      'التصنيع الرقمي والتجارة الإلكترونية',
      'أدهم أحمد مدحت · @adhamrst',
    ],
  },
  journey: {
    kicker: { en: 'Multidisciplinary Architecture', ar: 'النبذة والمسار متعدد التخصصات' },
    heading: {
      en: 'Four disciplines engineered into one cohesive perspective.',
      ar: 'أربعة محاور مترابطة تشكّل رؤية واحدة متكاملة.',
    },
    lead: {
      en: 'Select a pillar to inspect how clinical training, executive strategy, manufacturing entrepreneurship, and visual craft reinforce one another.',
      ar: 'اختر أي محور لاستكشاف كيف يتكامل الطب البشري مع الإدارة الاستراتيجية وريادة الأعمال والتصميم البصري.',
    },
    focusHeading: { en: 'Core Focus Areas', ar: 'مجالات التركيز الأساسية' },
    synthesisHeading: { en: 'Cross-Disciplinary Link', ar: 'نقطة الترابط' },
  },
  credentials: {
    kicker: { en: 'Verified Credentials & LinkedIn Archive', ar: 'معرض الشهادات وأرشيف LinkedIn' },
    heading: {
      en: 'Academic discipline backed by formal accreditation.',
      ar: 'مسار علمي ومهني موثق بشهادات واعتمادات رسمية.',
    },
    lead: {
      en: 'Browse verified academic, executive, and design credentials in one unified gallery. Filter by discipline or inspect any certificate in full resolution.',
      ar: 'معرض واحد موحّد لاستعراض الشهادات والاعتمادات الأكاديمية والإدارية والتصميمية بدقة عالية. يمكنك التصفية حسب المجال أو تكبير أي شهادة.',
    },
    addCertificate: {
      en: 'Owner Publisher Studio',
      ar: 'استوديو المالك للنشر',
    },
    uploadModalTitle: {
      en: 'Owner Certificate & Entity Studio',
      ar: 'استوديو المالك — الشهادات و Knowledge Panel',
    },
    uploadModalNote: {
      en: 'Private owner-only tool (hidden from visitors). Automatically formats certificate filenames, Cloudinary public_id, SEO/GEO alt tags, and Schema.org JSON-LD.',
      ar: 'أداة خاصة بصاحب الموقع فقط (مخفية تماماً عن الزوار). تضبط تلقائياً اسم ملف الشهادة ومعرّف Cloudinary ووسوم الـ SEO والـ GEO وكود Schema.org.',
    },
    uploadImageLabel: { en: 'Certificate Image', ar: 'صورة الشهادة' },
    uploadImageHint: {
      en: 'Select PNG, JPG, or WebP from your device',
      ar: 'اختر صورة الشهادة (PNG أو JPG أو WebP)',
    },
    uploadTitleLabel: { en: 'Certificate Title', ar: 'اسم الشهادة' },
    uploadTitlePlaceholder: {
      en: 'e.g., Clinical Leadership & Healthcare Management',
      ar: 'مثال: شهادة القيادة السريرية وإدارة الرعاية الصحية',
    },
    uploadIssuerLabel: { en: 'Issuing Organization', ar: 'الجهة المانحة' },
    uploadIssuerPlaceholder: {
      en: 'e.g., Horus University / Coursera / LinkedIn Learning',
      ar: 'مثال: جامعة حورس / Coursera / LinkedIn Learning',
    },
    uploadYearLabel: { en: 'Year', ar: 'السنة' },
    uploadCategoryLabel: { en: 'Discipline', ar: 'التخصص' },
    uploadUrlLabel: {
      en: 'LinkedIn Credential URL (optional)',
      ar: 'رابط الشهادة على LinkedIn (اختياري)',
    },
    uploadSubmit: { en: 'Preview in Gallery & Generate Code', ar: 'معاينة في المعرض وتوليد الكود' },
    uploadErrorTitle: { en: 'Please enter the certificate title.', ar: 'يرجى كتابة اسم الشهادة.' },
    uploadErrorIssuer: { en: 'Please enter the issuing organization.', ar: 'يرجى كتابة الجهة المانحة.' },
    uploadErrorImage: { en: 'Please select a certificate image or paste a Cloudinary URL.', ar: 'يرجى اختيار صورة أو لصق رابط Cloudinary.' },
    removeUploaded: { en: 'Remove Preview', ar: 'إزالة المعاينة' },
    viewAllLinkedin: {
      en: 'Full LinkedIn Archive',
      ar: 'كل الشهادات على LinkedIn',
    },
    inspectButton: { en: 'Inspect', ar: 'تكبير' },
    autoplayPause: { en: 'Pause', ar: 'إيقاف' },
    autoplayPlay: { en: 'Autoplay', ar: 'تشغيل' },
    prevLabel: { en: 'Previous credential', ar: 'الشهادة السابقة' },
    nextLabel: { en: 'Next credential', ar: 'الشهادة التالية' },
    lightboxClose: { en: 'Close lightbox', ar: 'إغلاق نافذة التكبير' },
    lightboxZoomIn: { en: 'Zoom In', ar: 'تكبير إضافي' },
    lightboxZoomOut: { en: 'Reset Zoom', ar: 'الحجم الطبيعي' },
    entityAlignmentNote: {
      en: 'Official Entity Alignment: Adham Ahmed · Adham Medhat · أدهم مدحت',
      ar: 'توثيق تطابق الهوية الرقمية: Adham Ahmed · Adham Medhat · أدهم مدحت',
    },
  },
  qrPass: {
    buttonLabel: { en: 'QR Pass', ar: 'بطاقة QR' },
    modalTitle: { en: 'Digital Contact Pass', ar: 'بطاقة التواصل الرقمية (QR)' },
    modalSubtitle: {
      en: 'Scan directly from any phone camera to open the official entity or save Adham Medhat to contacts.',
      ar: 'امسح الكود مباشرة من كاميرا أي هاتف لفتح الموقع الرسمي أو حفظ بيانات أدهم مدحت فوراً في جهات الاتصال.',
    },
    modeWebsite: { en: 'Official Website', ar: 'الموقع الرسمي' },
    modeVcard: { en: 'Direct Contact (vCard)', ar: 'حفظ جهة الاتصال (vCard)' },
    downloadPng: { en: 'Save QR Image', ar: 'حفظ صورة الـ QR' },
    copyUrl: { en: 'Copy Link', ar: 'نسخ الرابط' },
    copiedUrl: { en: 'Link Copied', ar: 'تم النسخ' },
    close: { en: 'Close QR Pass', ar: 'إغلاق بطاقة QR' },
  },
  ventures: {
    kicker: { en: 'Flagship Venture · Founder', ar: 'المشروع الرئيسي · المؤسس' },
    heading: {
      en: 'RST Central — Digital Fabrication & Precision Commerce.',
      ar: 'RST Central — التصنيع الرقمي والتجارة الإلكترونية الدقيقة.',
    },
    viewBrief: { en: 'Read Brief', ar: 'عرض التفاصيل' },
    closeBrief: { en: 'Close Brief', ar: 'إغلاق التفاصيل' },
    capabilitiesHeading: { en: 'Core Operations', ar: 'القدرات التشغيلية' },
  },
  connect: {
    kicker: { en: 'Unified Handle @adhamrst · RST Central Bot', ar: 'الهاندل الموحد @adhamrst · وبوت RST Central' },
    heading: {
      en: 'One handle across platforms, plus instant brand concierge.',
      ar: 'هاندل واحد موحّد للتواصل الشخصي، وبوت رسمي لطلبات الأعمال.',
    },
    lead: {
      en: 'Reach Adham personally using @adhamrst on WhatsApp, Telegram, LinkedIn, Instagram, and YouTube. For RST Central orders and brand inquiries, message the official US WhatsApp Concierge.',
      ar: 'للتواصل الشخصي استخدم الهاندل الموحد @adhamrst على واتساب وتيليجرام ولينكد إن وإنستجرام ويوتيوب. ولطلبات RST Central والمشاريع التجارية يمكنك مراسلة البوت الرسمي للبراند مباشرة.',
    },
    composerHeading: {
      en: 'RST Central Business Concierge',
      ar: 'بوت الأعمال الرسمي · RST Central',
    },
    composerSubnote: {
      en: 'Official US Brand WhatsApp Bot: +1 (202) 978-0356 · Personal handle @adhamrst active on WhatsApp & Telegram',
      ar: 'بوت البراند الأمريكي الرسمي: ‎+1 (202) 978-0356 · والهاندل @adhamrst متاح على واتساب وتيليجرام',
    },
    composerTopicLabel: { en: 'Inquiry Topic', ar: 'موضوع التواصل' },
    composerMessageLabel: { en: 'Your message', ar: 'رسالتك' },
    composerPlaceholder: {
      en: 'Share your RST Central order, brand identity project, or collaboration inquiry...',
      ar: 'اكتب تفاصيل طلب RST Central أو مشروع الهوية البصرية أو مقترح التعاون...',
    },
    composerError: {
      en: 'Please enter a brief message before preparing your concierge link.',
      ar: 'يرجى كتابة رسالة مختصرة قبل تجهيز رابط المحادثة.',
    },
    composerSubmit: { en: 'Message RST Central Bot', ar: 'إرسال إلى بوت RST Central' },
    telegramDirect: {
      en: 'Personal DMs: @adhamrst on WhatsApp & Telegram',
      ar: 'التواصل الشخصي: @adhamrst على واتساب وتيليجرام',
    },
    copyHandle: { en: 'Copy @adhamrst', ar: 'نسخ @adhamrst' },
    copiedHandle: { en: 'Copied @adhamrst', ar: 'تم النسخ' },
  },
  footer: {
    rights: {
      en: 'Adham Medhat (Adham Ahmed Medhat). Official Personal Entity.',
      ar: 'أدهم مدحت (أدهم أحمد مدحت). الموقع الرسمي والهوية الرقمية.',
    },
    affiliations: {
      en: 'Horus University Faculty of Medicine · Founder of RST Central',
      ar: 'كلية الطب البشري بجامعة حورس · مؤسس RST Central',
    },
    backToTop: { en: 'Back to top', ar: 'العودة للأعلى' },
  },
} as const;
