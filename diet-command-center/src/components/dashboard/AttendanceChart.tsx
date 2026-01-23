import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { attendanceData } from "@/data/clusterData";

interface AttendanceChartProps {
  clusterId: "a" | "b" | "c";
  glowColor: "cyan" | "purple" | "orange";
}

const colorMap = {
  cyan: { stroke: "hsl(185, 100%, 50%)", fill: "hsl(185, 100%, 50%)" },
  purple: { stroke: "hsl(270, 100%, 65%)", fill: "hsl(270, 100%, 65%)" },
  orange: { stroke: "hsl(25, 100%, 55%)", fill: "hsl(25, 100%, 55%)" },
};

const dataKeyMap = {
  a: "clusterA",
  b: "clusterB",
  c: "clusterC",
};

export const AttendanceChart = ({ clusterId, glowColor }: AttendanceChartProps) => {
  const colors = colorMap[glowColor];
  const dataKey = dataKeyMap[clusterId];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="holographic-card p-6 rounded-xl"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Attendance Trends
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={attendanceData}>
            <defs>
              <linearGradient id={`gradient-${clusterId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.fill} stopOpacity={0.4} />
                <stop offset="95%" stopColor={colors.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              domain={[50, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [`${value}%`, "Attendance"]}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors.stroke}
              strokeWidth={2}
              fill={`url(#gradient-${clusterId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
