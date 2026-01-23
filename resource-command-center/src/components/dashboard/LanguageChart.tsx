import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { languageProficiency } from "@/data/clusterData";

interface LanguageChartProps {
  clusterId: "a" | "b" | "c";
  glowColor: "cyan" | "purple" | "orange";
}

const dataMap = {
  a: languageProficiency.clusterA,
  b: languageProficiency.clusterB,
  c: languageProficiency.clusterC,
};

const COLORS = [
  "hsl(185, 100%, 50%)",
  "hsl(210, 100%, 55%)",
  "hsl(270, 100%, 65%)",
  "hsl(25, 100%, 55%)",
];

export const LanguageChart = ({ clusterId, glowColor }: LanguageChartProps) => {
  const data = dataMap[clusterId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="holographic-card p-6 rounded-xl"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Language Proficiency
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
            <Legend
              formatter={(value) => (
                <span className="text-muted-foreground text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
