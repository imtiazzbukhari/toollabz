"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Funnel,
  FunnelChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ConsoleChartsData = {
  revenueData: Array<{ name: string; revenue: number; traffic: number }>;
  clusterPerformance: Array<{ name: string; score: number; conversion: number }>;
  funnelData: Array<{ value: number; name: string; fill: string }>;
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-2xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="h-72">{children}</div>
    </section>
  );
}

export default function ConsoleCharts({ data }: { data: ConsoleChartsData }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Revenue Over Time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.revenueData}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#0891b2" fill="url(#rev)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Traffic Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.revenueData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="traffic" stroke="#8b5cf6" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Cluster Performance">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.clusterPerformance}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>

      <Panel title="Conversion Funnel">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={data.funnelData} isAnimationActive />
          </FunnelChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}
