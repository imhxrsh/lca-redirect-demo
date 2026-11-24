import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Circle,
  Clock3,
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  RotateCw,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBuild } from "@/lib/builds";

type BuildPageProps = {
  params: Promise<{ id: string }>;
};

export const instant = false;

const statusStyles = {
  Succeeded: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Running: "border-sky-200 bg-sky-50 text-sky-700",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
  Queued: "border-slate-200 bg-slate-100 text-slate-600",
};

export async function generateMetadata({
  params,
}: BuildPageProps): Promise<Metadata> {
  const { id } = await params;
  const build = getBuild(id);
  return {
    title: build ? `${build.name} · ${id} | Build Console` : "Build not found",
  };
}

export default async function BuildPage({ params }: BuildPageProps) {
  await connection();
  const { id } = await params;
  const build = getBuild(id);

  if (!build) {
    notFound();
  }

  const steps =
    build.status === "Failed"
      ? [
          { name: "Install dependencies", state: "Complete", time: "12s" },
          { name: "Run checks", state: "Failed", time: "36s" },
          { name: "Build artifact", state: "Skipped", time: "—" },
          { name: "Deploy preview", state: "Skipped", time: "—" },
        ]
      : build.status === "Queued"
        ? [
            { name: "Install dependencies", state: "Queued", time: "—" },
            { name: "Run checks", state: "Queued", time: "—" },
            { name: "Build artifact", state: "Queued", time: "—" },
            { name: "Deploy preview", state: "Queued", time: "—" },
          ]
        : [
            { name: "Install dependencies", state: "Complete", time: "24s" },
            {
              name: "Run checks",
              state: build.progress >= 45 ? "Complete" : "In progress",
              time: build.progress >= 45 ? "38s" : "Running",
            },
            {
              name: "Build artifact",
              state: build.progress === 100 ? "Complete" : "In progress",
              time: build.progress === 100 ? "1m 02s" : "Running",
            },
            {
              name: "Deploy preview",
              state: build.progress === 100 ? "Complete" : "Queued",
              time: build.progress === 100 ? "14s" : "—",
            },
          ];

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-5 py-8 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-7 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="size-4" />
          All builds
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${statusStyles[build.status]}`}
              >
                {build.status === "Running" && (
                  <span className="mr-1 size-1.5 animate-pulse rounded-full bg-sky-500" />
                )}
                {build.status}
              </Badge>
              <span className="font-mono text-[10px] text-slate-400">
                ID {build.id}
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {build.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              {build.description}
            </p>
          </div>
          <Button
            variant="outline"
            className="h-9 gap-2 rounded-lg border-slate-200 bg-white text-xs"
          >
            <RotateCw className="size-3.5" />
            Re-run build
          </Button>
        </div>

        <section className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Repository", value: build.repository, icon: Terminal },
            { label: "Branch", value: build.branch, icon: GitBranch },
            { label: "Commit", value: build.commit, icon: GitCommitHorizontal },
            { label: "Duration", value: build.duration, icon: Clock3 },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
              className="gap-0 rounded-xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/70"
            >
              <CardContent className="p-4">
                <div className="mb-3 flex items-center gap-2 text-[10px] font-medium text-slate-400">
                  <Icon className="size-3.5" />
                  {label}
                </div>
                <p className="truncate text-xs font-semibold text-slate-800">
                  {value}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)]">
          <Card className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/70">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <CardTitle className="text-sm font-semibold">
                Build steps
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-2">
              {steps.map((step, index) => (
                <div
                  key={step.name}
                  className="flex items-center gap-3 border-b border-slate-100 py-4 last:border-0"
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                      step.state === "Complete"
                        ? "bg-emerald-50 text-emerald-600"
                        : step.state === "Failed"
                          ? "bg-rose-50 text-rose-600"
                          : step.state === "In progress"
                            ? "bg-sky-50 text-sky-600"
                            : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {step.state === "Complete" ? (
                      <Check className="size-3.5" />
                    ) : step.state === "In progress" ? (
                      <RotateCw className="size-3.5 animate-spin" />
                    ) : (
                      <Circle className="size-3" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{step.name}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Step {index + 1} of {steps.length}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      step.state === "Failed"
                        ? "text-rose-600"
                        : step.state === "In progress"
                          ? "text-sky-600"
                          : "text-slate-400"
                    }`}
                  >
                    {step.state}
                  </span>
                  <span className="w-12 text-right text-[10px] tabular-nums text-slate-400">
                    {step.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-sm ring-1 ring-slate-200/70">
            <CardHeader className="border-b border-slate-100 px-5 py-4">
              <CardTitle className="text-sm font-semibold">
                Build summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 px-5 py-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="font-medium text-slate-600">Progress</span>
                  <span className="font-semibold tabular-nums">
                    {build.progress}%
                  </span>
                </div>
                <Progress value={build.progress} aria-label="Build progress" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between gap-4 text-[11px]">
                  <span className="text-slate-400">Environment</span>
                  <span className="font-medium">{build.environment}</span>
                </div>
                <div className="flex justify-between gap-4 text-[11px]">
                  <span className="text-slate-400">Started</span>
                  <span className="font-medium">{build.startedAt}</span>
                </div>
                <div className="flex justify-between gap-4 text-[11px]">
                  <span className="text-slate-400">Triggered by</span>
                  <span className="font-medium">{build.actor}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="h-9 w-full gap-2 rounded-lg border-slate-200 text-xs"
              >
                View build logs
                <ExternalLink className="size-3.5" />
              </Button>
              {build.status === "Succeeded" && (
                <Link
                  href="/"
                  className="flex items-center justify-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Open deployment
                  <ArrowUpRight className="size-3.5" />
                </Link>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
