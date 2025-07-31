import {
  benefitIcon1,
  benefitIcon2,
  benefitIcon3,
  benefitIcon4,
  benefitImage2,
  chromecast,
  disc02,
  discord,
  discordBlack,
  facebook,
  figma,
  file02,
  framer,
  homeSmile,
  instagram,
  notification2,
  notification3,
  notification4,
  notion,
  photoshop,
  plusSquare,
  protopie,
  raindrop,
  recording01,
  recording03,
  roadmap1,
  roadmap2,
  roadmap3,
  roadmap4,
  searchMd,
  slack,
  sliders04,
  telegram,
  twitter,
  yourlogo,
} from "../assets";

export const navigation = [
  {
    id: "0",
    title: "Services",
    url: "#services",
  },
  {
    id: "1",
    title: "Solutions",
    url: "#solutions",
  },
  {
    id: "2",
    title: "Projects",
    url: "#projects",
  },
  {
    id: "3",
    title: "Collaboration",
    url: "#collaboration",
  },
  {
    id: "4",
    title: "Roadmap",
    url: "#roadmap",
  },
  {
    id: "5",
    title: "About",
    url: "#about",
  },
  {
    id: "6",
    title: "Contact",
    url: "#contact",
  },
  {
    id: "7",
    title: "Sign Up",
    url: "#signup",
    onlyMobile: true,
  },
  {
    id: "8",
    title: "Sign In",
    url: "#login",
    onlyMobile: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];

export const notificationImages = [notification4, notification3, notification2];

export const companyLogos = [yourlogo, yourlogo, yourlogo, yourlogo, yourlogo];

export const pritechviorServices = [
  "Final year & academic project development",
  "Enterprise system architecture & deployment", 
  "Custom software development (web/mobile)",
  "Documentation & technical mentorship",
  "Mobile-first PWA development",
];

export const brainwaveServicesIcons = [
  recording03,
  recording01,
  disc02,
  chromecast,
  sliders04,
];

export const roadmap = [
  {
    id: "0",
    title: "E-Learning Platform Launch",
    text: "Complete online education platform with instructor-led courses, certification programs, and global access through mobile payments.",
    date: "Q3 2025",
    status: "done",
    imageUrl: roadmap1,
    colorful: true,
  },
  {
    id: "1",
    title: "Advanced POS & E-Commerce",
    text: "Launch comprehensive retail solution with offline-first POS system, inventory sync, and AzamPay integration for seamless payments.",
    date: "Q4 2025",
    status: "progress",
    imageUrl: roadmap2,
  },
  {
    id: "2",
    title: "Software Archive & Hosting",
    text: "Deploy centralized digital resource hub with downloadable enterprise software and full cPanel hosting services.",
    date: "Q1 2026",
    status: "progress",
    imageUrl: roadmap3,
  },
  {
    id: "3",
    title: "AI Integration & Analytics",
    text: "Integrate advanced AI capabilities for business intelligence, automated reporting, and predictive analytics across all platforms.",
    date: "Q2 2026",
    status: "progress",
    imageUrl: roadmap4,
  },
];

export const collabText =
  "With powerful internal collaboration tools, role-based access control, and real-time productivity features, it's the perfect solution for teams looking to work smarter and more efficiently.";

export const collabContent = [
  {
    id: "0",
    title: "Real-time Team Messaging",
    text: collabText,
  },
  {
    id: "1", 
    title: "Role-based Access Control",
  },
  {
    id: "2",
    title: "Financial & Treasury Management",
  },
];

export const collabApps = [
  {
    id: "0",
    title: "Figma",
    icon: figma,
    width: 26,
    height: 36,
  },
  {
    id: "1",
    title: "Notion",
    icon: notion,
    width: 34,
    height: 36,
  },
  {
    id: "2",
    title: "Discord",
    icon: discord,
    width: 36,
    height: 28,
  },
  {
    id: "3",
    title: "Slack",
    icon: slack,
    width: 34,
    height: 35,
  },
  {
    id: "4",
    title: "Photoshop",
    icon: photoshop,
    width: 34,
    height: 34,
  },
  {
    id: "5",
    title: "Protopie",
    icon: protopie,
    width: 34,
    height: 34,
  },
  {
    id: "6",
    title: "Framer",
    icon: framer,
    width: 26,
    height: 34,
  },
  {
    id: "7",
    title: "Raindrop",
    icon: raindrop,
    width: 38,
    height: 32,
  },
];

export const projects = [
  {
    id: "0",
    title: "Student Management System",
    description: "Complete academic project with modern UI",
    category: "Academic Project",
    technologies: [
      "React.js with responsive design and modern UI",
      "Node.js backend with RESTful APIs",
      "MySQL database with optimized queries",
      "User authentication and role management",
      "Real-time notifications and updates",
      "Complete documentation and deployment guide",
    ],
    image: "project1.jpg",
    status: "Completed",
  },
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-featured online store with POS integration",
    category: "Business Solution",
    technologies: [
      "Next.js e-commerce platform with admin panel",
      "Integrated POS system for offline sales",
      "AzamPay payment gateway integration",
      "Inventory management and tracking",
      "Customer analytics and reporting",
      "Mobile-responsive PWA design",
    ],
    image: "project2.jpg",
    status: "In Development",
  },
  {
    id: "2",
    title: "Enterprise ERP System",
    description: "Comprehensive business management solution",
    category: "Enterprise Solution",
    technologies: [
      "Microservices architecture with Docker",
      "Advanced role-based access control",
      "Financial management and treasury modules",
      "Real-time collaboration and messaging",
      "Custom reporting and analytics dashboards",
      "Cloud deployment with cPanel hosting",
    ],
    image: "project3.jpg",
    status: "Planning",
  },
];

export const benefits = [
  {
    id: "0",
    title: "Project Design & Implementation",
    text: "End-to-end project support for students, startups, and enterprises. Final year projects, enterprise systems, custom software development, and technical mentorship.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    icon: "Settings",
  },
  {
    id: "1",
    title: "IT Consulting & Innovation Solutions",
    text: "Strategic digital transformation support with IT system audits, architectural planning, and tailored solutions for startups, NGOs & schools.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
    icon: "Brain",
  },
  {
    id: "2",
    title: "E-Learning & Digital Training",
    text: "Full online education platform with instructor-led courses, certifications, progress tracking, and global access with mobile payments.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
    icon: "GraduationCap",
  },
  {
    id: "3",
    title: "E-Commerce & POS Solutions",
    text: "Smart retail tools with online store, offline-first POS system, inventory sync, and AzamPay integration for seamless payments.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    light: true,
    icon: "ShoppingCart",
  },
  {
    id: "4",
    title: "Internal Collaboration & Management",
    text: "Powerful productivity tools with real-time messaging, role-based access, financial modules, and system-wide notifications.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    icon: "MessageSquare",
  },
  {
    id: "5",
    title: "Software Archive & Hosting Services",
    text: "Centralized digital resource hub with downloadable software, cPanel hosting, mobile-first PWA websites, and app store interface.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    icon: "Database",
  },
];

export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];
