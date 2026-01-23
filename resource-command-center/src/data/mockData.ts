
export const CLUSTERS = [
  {
    id: "cluster-a",
    name: "Cluster A (South)",
    type: "Needs Management",
    description: "Struggling with student absenteeism and needs management tools for students' behaviour and parent awareness.",
    engagement: 45,
    clarity: 60,
    teacherReflections: 15,
    path: "M50,50 L150,50 L150,150 L50,150 Z",
    primaryIssue: "Student Absenteeism",
    infrastructure: "Good",
    language: "Standard",
    coordinates: { x: 100, y: 100 },
    subRegions: [
      { id: "A1", name: "School Block A1", engagement: 42, principal: "Mr. S. Rao" },
      { id: "A2", name: "School Block A2", engagement: 48, principal: "Ms. K. Devi" },
    ]
  },
  {
    id: "cluster-b",
    name: "Cluster B (East)",
    type: "High Performing / Resource Gap",
    description: "High-performing students but lacks advanced TLMs for science.",
    engagement: 82,
    clarity: 70,
    teacherReflections: 28,
    path: "M160,50 L260,50 L260,150 L160,150 Z",
    primaryIssue: "Lack of Science TLMs",
    infrastructure: "Average",
    language: "Standard",
    coordinates: { x: 210, y: 100 },
    subRegions: [
      { id: "B1", name: "School Block B1", engagement: 85, principal: "Dr. P. Singh" },
      { id: "B2", name: "School Block B2", engagement: 79, principal: "Mrs. R. Kaur" },
    ]
  },
  {
    id: "cluster-c",
    name: "Cluster C (Tribal Belt)",
    type: "Contextual Needs",
    description: "Tribal belt where the medium of instruction needs heavy language contextualising.",
    engagement: 55,
    clarity: 40,
    teacherReflections: 8,
    path: "M50,160 L150,160 L150,260 L50,260 Z",
    primaryIssue: "Language Barriers",
    infrastructure: "Poor",
    language: "Tribal Dialect",
    coordinates: { x: 100, y: 210 },
    subRegions: [
      { id: "C1", name: "School Block C1", engagement: 52, principal: "Mr. J. Tudu" },
      { id: "C2", name: "School Block C2", engagement: 58, principal: "Ms. S. Murmu" },
    ]
  },
   {
    id: "cluster-d",
    name: "Cluster D (West)",
    type: "Standard",
    description: "Average performance across all metrics. Control group.",
    engagement: 68,
    clarity: 65,
    teacherReflections: 12,
    path: "M160,160 L260,160 L260,260 L160,260 Z",
    primaryIssue: "None",
    infrastructure: "Average",
    language: "Standard",
    coordinates: { x: 210, y: 210 },
    subRegions: [
        { id: "D1", name: "School Block D1", engagement: 66, principal: "Mrs. A. Gupta" },
        { id: "D2", name: "School Block D2", engagement: 70, principal: "Mr. R. Sharma" },
    ]
  }
];
