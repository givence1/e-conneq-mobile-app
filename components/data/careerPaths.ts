// data/careerPaths.ts
export type Specialty = {
  id: string;
  name: string;
  summary: string;
  description: string;
  requirements?: string[];
  recommendedCourses?: { id: string; title: string }[];
  medianSalary?: string;
  image?: string;
};

export type Domain = {
  id: string;
  name: string;
  icon?: string; // emoji or icon name
  tagline?: string;
  specialties: Specialty[];
};

export const CAREER_DOMAINS: Domain[] = [
  {
    id: "health",
    name: "Health",
    icon: "🩺",
    tagline: "Medical & healthcare careers",
    specialties: [
      {
        id: "nursing",
        name: "Nursing",
        summary: "Patient care and clinical support",
        description:
          "Nurses provide essential patient care, administer medication, and coordinate with medical teams. Career progression includes RN → BSN → Nurse Practitioner.",
        requirements: ["High school diploma", "Nursing degree / diploma", "License"],
        recommendedCourses: [{ id: "c1", title: "Anatomy & Physiology" }],
        medianSalary: "Varies by region",
      },
      {
        id: "pharmacy",
        name: "Pharmacy",
        summary: "Medicine preparation & dispensing",
        description:
          "Pharmacists and pharmacy technicians handle medication dispensing, patient counselling and drug safety.",
        requirements: ["Pharmacy degree for pharmacist", "Certification for technicians"],
        recommendedCourses: [{ id: "c2", title: "Pharmacology Basics" }],
        medianSalary: "Varies by role",
      },
      // add more specialties as desired...
    ],
  },
  {
    id: "management",
    name: "Management",
    icon: "📊",
    tagline: "Business & leadership careers",
    specialties: [
      {
        id: "hr",
        name: "Human Resources",
        summary: "People & talent management",
        description:
          "HR professionals manage recruitment, employee relations, training and compliance.",
        requirements: ["Bachelor degree preferred", "Communication skills"],
        recommendedCourses: [{ id: "c3", title: "Organizational Behaviour" }],
        medianSalary: "Entry to senior ranges",
      },
      {
        id: "project_mgmt",
        name: "Project Management",
        summary: "Oversee projects and delivery",
        description:
          "Project managers plan, execute and close projects, coordinating teams and stakeholders.",
        requirements: ["Bachelor degree", "PMP certification optional"],
      },
    ],
  },
  {
    id: "it",
    name: "Information Technology",
    icon: "💻",
    tagline: "Tech & software careers",
    specialties: [
      {
        id: "software_dev",
        name: "Software Developer",
        summary: "Build apps & systems",
        description:
          "Software developers create applications, APIs, and services. Common languages: JavaScript, Python, Java.",
        requirements: ["Computer science or bootcamp", "Portfolio"],
        recommendedCourses: [{ id: "c4", title: "Intro to Programming" }],
        medianSalary: "Competitive",
      },
      {
        id: "network_admin",
        name: "Network Administrator",
        summary: "Maintain networks & infrastructure",
        description: "Admins configure and maintain network systems and servers.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "🛠️",
    tagline: "Design & build systems",
    specialties: [
      {
        id: "civil",
        name: "Civil Engineering",
        summary: "Infrastructure & construction",
        description: "Civil engineers design roads, bridges and buildings.",
      },
      {
        id: "electrical",
        name: "Electrical Engineering",
        summary: "Power & electronics",
        description: "Design and work with electrical systems and circuits.",
      },
    ],
  },
  {
    id: "arts",
    name: "Arts & Design",
    icon: "🎨",
    tagline: "Creative & visual careers",
    specialties: [
      {
        id: "graphic_design",
        name: "Graphic Design",
        summary: "Visual communication & branding",
        description: "Designers create visuals for brands, web and print.",
      },
      {
        id: "fashion",
        name: "Fashion Design",
        summary: "Clothing & textile design",
        description: "Designers create clothing and style concepts.",
      },
    ],
  },
  // Add more domains if you wish...
];
