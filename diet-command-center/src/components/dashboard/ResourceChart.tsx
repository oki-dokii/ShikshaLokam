import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { resourceAvailability } from "@/data/clusterData";

interface ResourceChartProps {
  clusterId: "a" | "b" | "c";
  glowColor: "cyan" | "purple" | "orange";
}

const colorMap = {
  cyan: "hsl(185, 100%, 50%)",
  purple: "hsl(270, 100%, 65%)",
  orange: "hsl(25, 100%, 55%)",
};

const dataMap = {
  a: resourceAvailability.clusterA,
  b: resourceAvailability.clusterB,
  c: resourceAvailability.clusterC,
};

export const ResourceChart = ({ clusterId, glowColor }: ResourceChartProps) => {
  const data = dataMap[clusterId];
  const color = colorMap[glowColor];

  const getBarColor = (value: number) => {
    if (value >= 70) return "hsl(142, 76%, 45%)";
    if (value >= 40) return "hsl(45, 93%, 47%)";
    return "hsl(0, 84%, 60%)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="holographic-card p-6 rounded-xl"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Resource Availability
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              type="number" 
              domain={[0, 100]}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Available"]}
            />
            <Bar dataKey="available" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.available)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(142,76%,45%)]" />
          <span className="text-muted-foreground">Good (70%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]" />
          <span className="text-muted-foreground">Moderate (40-70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(0,84%,60%)]" />
          <span className="text-muted-foreground">Critical (&lt;40%)</span>
        </div>
      </div>
    </motion.div>
  );
};
