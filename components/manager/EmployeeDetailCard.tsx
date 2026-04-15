"use client";

import type { EmployeeDashboard, ManagerRecommendation, TeamEmployee } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import TrendChart from "@/components/data/TrendChart";
import ScoreCompositionChart from "@/components/data/ScoreCompositionChart";
import Avatar from "@/components/ui/Avatar";
import { getProfileImageUrl } from "@/lib/profile-images";

interface EmployeeDetailCardProps {
  employee: TeamEmployee | null;
  recommendation: ManagerRecommendation;
  dashboard: EmployeeDashboard | null;
  dashboardLoading: boolean;
  dashboardError: string | null;
}

function scoreLabel(score?: number | null) {
  if (score == null) return "N/A";
  return `${score.toFixed(0)}/100`;
}

function trendDeltaText(dashboard: EmployeeDashboard | null): string {
  const points = dashboard?.trend ?? [];
  if (points.length < 2) return "Not enough history";
  const prev = points[points.length - 2].score ?? 0;
  const curr = points[points.length - 1].score ?? 0;
  const delta = curr - prev;
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)} vs last check-in`;
}

export default function EmployeeDetailCard({
  employee,
  recommendation,
  dashboard,
  dashboardLoading,
  dashboardError,
}: EmployeeDetailCardProps) {
  if (!employee) {
    return (
      <Card padding="lg" className="min-h-[260px] flex items-center justify-center">
        <p className="text-body text-text-secondary">Select an employee to inspect detail and action guidance.</p>
      </Card>
    );
  }

  const selectedActions = recommendation.actions.slice(0, 2);
  const reasons = recommendation.reasons?.slice(0, 2) ?? [];

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={employee.name} imageUrl={getProfileImageUrl(employee)} size="lg" />
          <div className="min-w-0">
            <h3 className="text-card-title text-text-primary truncate">{employee.name}</h3>
            <p className="text-caption text-text-secondary">Employee-level operational summary</p>
          </div>
        </div>
        <Badge level={employee.risk_level as "low" | "medium" | "high"} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-background-secondary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">Global score</div>
              <div className="text-xl font-bold text-text-primary">{scoreLabel(employee.score)}</div>
              <div className="text-[11px] text-text-secondary mt-1">{trendDeltaText(dashboard)}</div>
            </div>
            <div className="rounded-lg border border-border bg-background-secondary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">Behavior</div>
              <div className="text-xl font-bold text-text-primary">{employee.behavior_score ?? "-"}</div>
              <div className="text-[11px] text-text-secondary mt-1">Strain score</div>
            </div>
            <div className="rounded-lg border border-border bg-background-secondary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">Meeting</div>
              <div className="text-xl font-bold text-text-primary">{employee.meeting_score ?? "-"}</div>
              <div className="text-[11px] text-text-secondary mt-1">Overload score</div>
            </div>
            <div className="rounded-lg border border-border bg-background-secondary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">Stress / Fatigue</div>
              <div className="text-xl font-bold text-text-primary">
                {employee.stress ?? "-"} / {employee.fatigue ?? "-"}
              </div>
              <div className="text-[11px] text-text-secondary mt-1">Latest self-report</div>
            </div>
          </div>

          {dashboardError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-risk-high-text">
              {dashboardError}
            </div>
          )}

          {dashboard?.ai_support?.message && (
            <div className="rounded-lg border border-border bg-background-primary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">AI Insight</div>
              <p className="text-sm text-text-primary mt-2 leading-relaxed">{dashboard.ai_support.message}</p>
              {dashboard.ai_support.reasons && dashboard.ai_support.reasons.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {dashboard.ai_support.reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="text-xs text-text-secondary bg-background-secondary rounded-md px-3 py-2 border border-border">
                      {r}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-background-primary p-3">
            <div className="text-xs uppercase font-semibold text-text-secondary">Risk history</div>
            <div className="mt-2">
              {dashboardLoading ? (
                <div className="h-[250px] w-full animate-pulse bg-border/40 rounded-xl" />
              ) : (
                <TrendChart data={dashboard?.trend ?? []} />
              )}
            </div>
          </div>

          {dashboard?.latest_score && (
            <div className="rounded-lg border border-border bg-background-primary p-3">
              <div className="text-xs uppercase font-semibold text-text-secondary">Score composition</div>
              <div className="mt-2">
                <ScoreCompositionChart score={dashboard.latest_score} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-semibold text-text-primary">Suggested Manager Actions</h4>
        {selectedActions.length > 0 ? (
          selectedActions.map((action, index) => (
            <div key={`${action}-${index}`} className="rounded-lg border border-border p-3 text-sm text-text-primary">
              {action}
            </div>
          ))
        ) : (
          <p className="text-caption text-text-secondary">No actions available.</p>
        )}
      </div>

      {reasons.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-text-primary">Why this profile is flagged</h4>
          {reasons.map((reason, index) => (
            <div key={`${reason}-${index}`} className="text-xs text-text-secondary bg-background-secondary rounded-md px-3 py-2 border border-border">
              {reason}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
