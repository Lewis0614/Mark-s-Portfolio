export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  icon: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  tags: string[];
  current: boolean;
}

export interface Specialization {
  id: string;
  title: string;
  description: string;
  icon: string;
  num: string;
}

export const PROFILE = {
  name: "Jhay Mark A. Ortiz Luis",
  shortName: "Jhay Mark A.",
  role: "Computer Engineering Student",
  focus: "System Development & AI Conversations",
  tagline: "Aspiring Computer Engineering student from the Polytechnic University of the Philippines specializing in System Development, with experience in software development and AI-driven conversational systems.",
  objective: "Aspiring Computer Engineering student from the Polytechnic University of the Philippines specializing in System Development, with experience in software development and AI-driven conversational systems. Seeking opportunities to apply and expand my knowledge in software engineering, embedded systems, and emerging technologies while leveraging strong analytical, programming, and problem-solving skills to contribute to innovative and impactful projects.",
  email: "jhaymarkortizluis@gmail.com",
  phone: "0939-830-9890",
  linkedin: "https://www.linkedin.com/in/jhay-mark-ortiz-luis-1982ba31a",
  location: "Manila, PH (GMT+8)",
  address: "16-D Sta. Catalina St., Brgy. Maharlika, Quezon City",
  available: true,
  profileImage: "/profile.jpg",
  danceImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB9OYrpcBhJoyuykoc5pd8Z7D_l8KNxiCbtX06NyWryBX5FadoaeXGYoCyU4V4SzyMpps-ThXHU6i4hP84cQH1Y1C6Z7zguByFBTMZ0s9TEHR4m3fyX6HOUkJ3XiCavXRGsWOLVux_G7cWNokt1E4D9XwIt4uZyWHG2KtgivCW19lX9lGMNu1fhlT-Jwel4pQ76DWY0jlTcFH8PuQJspmlDSh5XvkQ6YMfTPuNj4Azt5iNgq-Zyl7qoFDhjtKk5NIXda4IgIGTchhDI"
};

export const SPECIALIZATIONS: Specialization[] = [
  {
    id: "spec-1",
    title: "System Development",
    description: "Architecting robust backend and full-stack solutions with embedded and database integration.",
    icon: "developer_board",
    num: "01",
  },
  {
    id: "spec-2",
    title: "AI Conversations",
    description: "Designing, testing, and optimizing LLM interactions, voice agent dialog, and NLU/ASR alignment.",
    icon: "forum",
    num: "02",
  },
  {
    id: "spec-3",
    title: "Creative Web Design",
    description: "Developing responsive client applications with dynamic audio-lyric sync and visual precision.",
    icon: "palette",
    num: "03",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Integrated Filing System with Role-Based and QR Code Access",
    category: "System Engineering & IoT",
    description: "Designed and developed a full-stack filing management system using ReactJS, NodeJS, PostgreSQL, and IoT integration. Built modules for user management, request processing, reports and logs, notifications, and QR-based authentication. Applied RBAC security mechanisms and automated workflows to improve document retrieval efficiency and monitoring accuracy. Performed black-box testing and system validation to identify issues and improve functionality and user experience.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB74n7DL6BtlHdup0_KWiU0eCp4UzUbSm6_Jf3KSCkg8Wu-X1vqvxHzjYMrH7-3wX21HhzazA-3--FwStbhSsTHXeA0oBnWyFRMH-6URMkL3rsAG2u955NJDJHF07-BZA7wRFJf73cHM_VjQU8B7en29K-SbM70GmPBjxNXlppr2JJYkctqu1IqMWr1CXioUmz1OtBkrpJul04KJLATTrj46xSv5dECwxnDAv7-5E_VVo4jgwhkiZHIkbl6JfYoa9BjQEotYFzz6APr",
    tags: ["ReactJS", "NodeJS", "PostgreSQL", "IoT", "RBAC", "QR Auth"],
    icon: "folder",
  },
  {
    id: "proj-2",
    title: "Interactive PUP Hymn Website",
    category: "Web & Real-time Audio",
    description: "An interactive lyric-sync web app developed using HTML, CSS, and JavaScript. Features a scrollable lyrics section that highlights synchronized lines in real time as the hymn plays, with a responsive audio player. Implements smooth scrolling, dynamic styling, and mobile-friendly design for an engaging multimedia experience.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ4v2DDXq8YjCrhi6XOg07qpmLtbKniO-P8lipyd9EsgO4Enh0JT5VD-Iud49DvDXjjkpu7PmD2dx0KXDUjFaUVDeNDnA7d0BU6TC35PBfz0LWmi-Mej-WNKSg4Epx1aH_sOA8GsE9k4JQDn4WUvRw3XbAPpX3QFx9Whohpdph7NZpB9ibpwGw3Xe1V1xtquE4vpqS28eHFsk-JBivtuwNE9RyXqgOsJBLjnA1GrNI-rz14mokIk2HMKDwZYwhejt35V0_2lsiAU-8",
    tags: ["HTML", "CSS", "JavaScript", "Lyric Sync", "Audio Player"],
    icon: "music_note",
  },
  {
    id: "proj-3",
    title: "Interactive PUP Vicinity Map",
    category: "UX Design & Interactive Mapping",
    description: "An interactive campus map web app developed using HTML, CSS, and JavaScript. Features a responsive image map of PUP Manila Campus with hoverable landmarks that display dynamic pop-up information. Utilizes JavaScript functions for real-time interaction, enhancing user engagement and learning of campus sites.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB9pkda-und5iZ7CMhNvhFJ97U9kTJU4kF1YlDX-uBwBLO0C3Lf8kAzAw3dOlXlBPlc64ONdAmX1TQXPMFgAo6F5R9_-nGtIgxBZtZkqXLDWoaSHwmv7KlMngJiKGKBTtO8Q9Goi11QGxfernhJtWsuf--NUPxL4VRseny7OBZxqqDKHkHUNu9WZKH_3G-Hval9qxpzh4QFK41cuFLj5sQonox6ArT5guVl4h8d4LYjqVSn6hURlYEZIuf9aDpiewxv0sabHwO7W9_",
    tags: ["HTML", "CSS", "JavaScript", "Image Map", "Dynamic Popup"],
    icon: "map",
  },
];

export const UTILITIES = [
  {
    title: "Basic Calculator Web App",
    category: "Web Application",
    description: "A functional web-based calculator developed with JavaScript, HTML, and CSS. Supports arithmetic operations, memory functions, and base conversions. Implements equation parsing, real-time display updates, and error-handling.",
    highlight: "Memory / Conversions",
    icon: "calculate",
  },
  {
    title: "Phone Address Book",
    category: "Desktop Tool",
    description: "A Graphic User Interface Address Book implemented using Python. Enables users to add, edit, view, and remove contacts, featuring robust contacts search by multiple fields.",
    highlight: "Python / Tkinter",
    icon: "contacts",
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "exp-1",
    company: "AI Rudder Technology Corporation",
    role: "Product Delivery & Operations Specialist Intern",
    period: "2025 — 2026",
    description: "Supported the implementation of AI conversational systems through dialogue script optimization, NLU enhancement, and ASR fine-tuning. Conducted recording analysis and QA testing to evaluate intent accuracy and identify NLU, ASR, TTS, and NER issues, improving system performance. Edited audio files, supported system updates, and improved workflows through process optimization.",
    tags: ["AI Conversations", "NLU & ASR", "Voice Automation", "QA Testing", "TTS"],
    current: true,
  },
  {
    id: "exp-2",
    company: "Intellismart Technology Incorporated",
    role: "Content Management & Technical Helpdesk Intern",
    period: "2024",
    description: "Managed and updated digital content for Jollibee and Burger King branches nationwide, ensuring timely rollout via Magic Info Server. Resolved content issues, coordinated update schedules, and provided technical support for Digital Menu Boards (DMBs). Performed server uploads, internet checks, and DMB troubleshooting.",
    tags: ["CMS", "DMB Support", "Magic Info Server", "IT Support"],
    current: false,
  },
  {
    id: "exp-3",
    company: "PUP For Adults Only Dance Crew",
    role: "Internal President",
    period: "2023 — 2025",
    description: "Led organizational strategy and coordinated diverse team activities for cohesive performances. Organized internal events, workshops, and school trainings to foster community support. Created, organized, and maintained letters, permission slips, sign-up sheets, and bylaws to ensure compliance.",
    tags: ["Leadership", "Workshops", "Logistics", "Document Management"],
    current: false,
  },
];

export const RESUME_SKILLS = {
  programming: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "R", "Python", "C++"],
  ai_ml: ["AI Conversation Optimization", "Natural Language Understanding (NLU)", "Automatic Speech Recognition (ASR)", "Quality Assurance (QA) Testing", "Text-to-Speech (TTS)"],
  web_backend: ["React JS", "Node JS"],
  tools_software: ["XAMPP", "phpMyAdmin", "Apache Cordova", "Canva", "Adobe Photoshop", "Microsoft Office Suite (Excel, Word, PowerPoint)"],
  soft_skills: ["Active Communication", "Public Speaking", "Leadership", "Adaptable", "Problem-Solving", "Time Management"]
};
