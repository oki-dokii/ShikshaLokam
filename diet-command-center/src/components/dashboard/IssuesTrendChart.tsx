import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { issuesTrend } from "@/data/clusterData";

interface IssuesTrendChartProps {
  glowColor: "cyan" | "purple" | "orange";
}

export const IssuesTrendChart = ({ glowColor }: IssuesTrendChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="holographic-card p-6 rounded-xl"
    >
      <h3 className="font-orbitron text-lg font-semibold text-foreground mb-4">
        Issues Trend (Last 4 Weeks)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={issuesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-muted-foreground text-sm capitalize">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="hsl(185, 100%, 50%)"
              strokeWidth={2}
              dot={{ fill: "hsl(185, 100%, 50%)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="resources"
              stroke="hsl(270, 100%, 65%)"
              strokeWidth={2}
              dot={{ fill: "hsl(270, 100%, 65%)", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="language"
              stroke="hsl(25, 100%, 55%)"
              strokeWidth={2}
              dot={{ fill: "hsl(25, 100%, 55%)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
