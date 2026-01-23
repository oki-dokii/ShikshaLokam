// Mock data for cluster analytics

export const attendanceData = [
  { month: "Jan", clusterA: 72, clusterB: 85, clusterC: 68 },
  { month: "Feb", clusterA: 68, clusterB: 82, clusterC: 71 },
  { month: "Mar", clusterA: 65, clusterB: 88, clusterC: 74 },
  { month: "Apr", clusterA: 70, clusterB: 86, clusterC: 69 },
  { month: "May", clusterA: 75, clusterB: 90, clusterC: 76 },
  { month: "Jun", clusterA: 78, clusterB: 87, clusterC: 80 },
];

export const resourceAvailability = {
  clusterA: [
    { name: "Textbooks", available: 85, required: 100 },
    { name: "Desks", available: 92, required: 100 },
    { name: "Projectors", available: 45, required: 100 },
    { name: "Computers", available: 30, required: 100 },
  ],
  clusterB: [
    { name: "Lab Equipment", available: 25, required: 100 },
    { name: "Microscopes", available: 40, required: 100 },
    { name: "Chemicals", available: 55, required: 100 },
    { name: "Safety Gear", available: 70, required: 100 },
  ],
  clusterC: [
    { name: "Local Lang Books", available: 35, required: 100 },
    { name: "Visual Aids", available: 60, required: 100 },
    { name: "Audio Systems", available: 45, required: 100 },
    { name: "Cultural Materials", available: 50, required: 100 },
  ],
};

export const languageProficiency = {
  clusterA: [
    { level: "Fluent", value: 45, fill: "hsl(var(--neon-cyan))" },
    { level: "Intermediate", value: 30, fill: "hsl(var(--neon-blue))" },
    { level: "Basic", value: 15, fill: "hsl(var(--neon-purple))" },
    { level: "None", value: 10, fill: "hsl(var(--neon-orange))" },
  ],
  clusterB: [
    { level: "Fluent", value: 60, fill: "hsl(var(--neon-cyan))" },
    { level: "Intermediate", value: 25, fill: "hsl(var(--neon-blue))" },
    { level: "Basic", value: 10, fill: "hsl(var(--neon-purple))" },
    { level: "None", value: 5, fill: "hsl(var(--neon-orange))" },
  ],
  clusterC: [
    { level: "Fluent", value: 20, fill: "hsl(var(--neon-cyan))" },
    { level: "Intermediate", value: 25, fill: "hsl(var(--neon-blue))" },
    { level: "Basic", value: 35, fill: "hsl(var(--neon-purple))" },
    { level: "None", value: 20, fill: "hsl(var(--neon-orange))" },
  ],
};

export const issuesTrend = [
  { week: "W1", attendance: 12, resources: 8, language: 5 },
  { week: "W2", attendance: 15, resources: 10, language: 7 },
  { week: "W3", attendance: 10, resources: 12, language: 8 },
  { week: "W4", attendance: 8, resources: 6, language: 6 },
];

export const clusterInfo = {
  a: {
    id: "a",
    title: "Cluster A",
    subtitle: "Attendance & Behaviour",
    description: "Focused on addressing absenteeism patterns and behavioral interventions across rural schools.",
    glowColor: "cyan" as const,
    stats: {
      schools: 45,
      teachers: 320,
      students: 12500,
      avgAttendance: 72,
    },
  },
  b: {
    id: "b",
    title: "Cluster B",
    subtitle: "Science & TLM",
    description: "Addressing the critical shortage of lab equipment and teaching-learning materials for science education.",
    glowColor: "purple" as const,
    stats: {
      schools: 38,
      teachers: 280,
      students: 9800,
      avgAttendance: 86,
    },
  },
  c: {
    id: "c",
    title: "Cluster C",
    subtitle: "Language & Context",
    description: "Bridging the language gap and contextualizing learning materials for tribal and rural communities.",
    glowColor: "orange" as const,
    stats: {
      schools: 52,
      teachers: 410,
      students: 15200,
      avgAttendance: 74,
    },
  },
};
