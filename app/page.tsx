import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  GitBranch,
  GitCommitHorizontal,
  Plus,
  Search,
  Settings2,
  Terminal,
  TriangleAlert,
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
import { createBuilds } from "@/lib/builds";

const statusStyles = {
  Succeeded: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Running: "border-sky-200 bg-sky-50 text-sky-700",
  Failed: "border-rose-200 bg-rose-50 text-rose-700",
  Queued: "border-slate-200 bg-slate-100 text-slate-600",
};

const statusIcons = {
  Succeeded: Check,
  Running: Clock3,
  Failed: TriangleAlert,
  Queued: Clock3,
};

export const instant = false;

export default async function Home() {
  await connection();
  const builds = createBuilds();
  const latestBuild = builds[0];
  const successfulBuilds = builds.filter(
    (build) => build.status === "Succeeded",
  ).length;
  const runningBuilds = builds.filter((build) => build.status === "Running").length;
  const failedBuilds = builds.filter((build) => build.status === "Failed").length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[248px] shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-5 lg:flex">
          <Link href="/" className="mb-8 flex items-center gap-3 px-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <Command className="size-[18px]" strokeWidth={2.5} />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">
              build<span className="text-indigo-600">board</span>
            </span>
          </Link>

          <button className="mb-7 flex w-full items-center gap-3 rounded-xl border border-slate-200 p-2.5 text-left transition hover:bg-slate-50">
            <span className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-xs font-bold text-orange-700">
              S
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold">
                Studio North
              </span>
              <span className="block text-[11px] text-slate-500">
                Build workspace
              </span>
            </span>
            <ChevronDown className="size-4 text-slate-400" />
          </button>

          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Workspace
          </p>
          <nav aria-label="Workspace navigation" className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-[13px] font-semibold text-indigo-700"
              aria-current="page"
            >
              <Terminal className="size-[17px]" />
              All builds
              <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                {builds.length}
              </span>
            </Link>
            <a
              href="#builds"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <GitBranch className="size-[17px]" />
              Branches
            </a>
            <a
              href="#builds"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            >
              <ArrowDownToLine className="size-[17px]" />
              Artifacts
            </a>
          </nav>

          <div className="mt-8 border-t border-slate-100 pt-5">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              Repositories
            </p>
            <nav aria-label="Repositories" className="space-y-1">
              {Array.from(new Set(builds.map((build) => build.repository))).map(
                (repository) => (
                  <a
                    key={repository}
                    href="#builds"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <span className="size-1.5 rounded-full bg-slate-300" />
                    <span className="truncate">{repository.split("/")[1]}</span>
                  </a>
                ),
              )}
            </nav>
          </div>

          <div className="mt-auto space-y-1 border-t border-slate-100 pt-4">
            <a
              href="#settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Settings2 className="size-[17px]" />
              Settings
            </a>
            <a
              href="#help"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <CircleHelp className="size-[17px]" />
              Help & support
            </a>
            <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-2.5">
              <span className="flex size-8 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                AC
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">
                  Alex Carter
                </span>
                <span className="block truncate text-[10px] text-slate-500">
                  Studio North
                </span>
              </span>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[68px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur sm:px-8">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white lg:hidden">
                <Command className="size-4" />
              </span>
              <span className="text-xs font-medium text-slate-400">
                Studio North
              </span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-semibold text-slate-700">
                Build console
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="hidden h-9 w-[210px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left text-xs text-slate-400 transition hover:border-slate-300 sm:flex">
                <Search className="size-3.5" />
                <span className="flex-1">Search builds...</span>
                <kbd className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[9px] font-medium text-slate-500">
                  ⌘ K
                </kbd>
              </button>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Systems operational
              </span>
            </div>
          </header>

          <main className="w-full flex-1 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
            <div className="mx-auto max-w-[1240px]">
              <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-2 text-xs font-medium text-slate-400">
                    Your team&apos;s CI/CD activity
                  </p>
                  <h1 className="text-[28px] font-semibold tracking-tight text-slate-950 sm:text-[32px]">
                    Build console
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-500">
                    Track builds, inspect results, and get back to shipping.
                  </p>
                </div>
                <Button className="h-10 gap-2 rounded-lg bg-indigo-600 px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-700">
                  <Plus className="size-4" />
                  New build
                </Button>
              </div>

              <section
                aria-label="Build metrics"
                className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              >
                {[
                  {
                    label: "Total builds",
                    value: builds.length,
                    note: "Across all repositories",
                    icon: Terminal,
                    iconColor: "bg-indigo-50 text-indigo-600",
                  },
                  {
                    label: "Succeeded",
                    value: successfulBuilds,
                    note: "Ready to ship",
                    icon: Check,
                    iconColor: "bg-emerald-50 text-emerald-600",
                  },
                  {
                    label: "In progress",
                    value: runningBuilds,
                    note: "Currently running",
                    icon: Clock3,
                    iconColor: "bg-sky-50 text-sky-600",
                  },
                  {
                    label: "Failed",
                    value: failedBuilds,
                    note: "Needs attention",
                    icon: TriangleAlert,
                    iconColor: "bg-rose-50 text-rose-600",
                  },
                ].map(({ label, value, note, icon: Icon, iconColor }) => (
                  <Card
                    key={label}
                    className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70"
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          {label}
                        </span>
                        <span
                          className={`flex size-8 items-center justify-center rounded-lg ${iconColor}`}
                        >
                          <Icon className="size-4" />
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-[27px] font-semibold leading-none tracking-tight">
                          {value}
                        </span>
                        <span className="text-[11px] text-slate-400">{note}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <Card
                id="builds"
                className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70"
              >
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Recent builds
                    </CardTitle>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Builds from your connected repositories
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-8 gap-2 rounded-lg border-slate-200 px-2.5 text-[11px] text-slate-600"
                  >
                    All statuses
                    <ChevronDown className="size-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="px-5 pb-2 sm:px-6">
                  <div className="hidden grid-cols-[minmax(190px,1.35fr)_minmax(140px,1fr)_105px_95px_100px] gap-4 border-b border-slate-100 py-3 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400 md:grid">
                    <span>Build</span>
                    <span>Branch / commit</span>
                    <span>Status</span>
                    <span>Duration</span>
                    <span>Started</span>
                  </div>
                  {builds.map((build) => {
                    const StatusIcon = statusIcons[build.status];

                    return (
                      <Link
                        key={build.id}
                        href={`/builds/${build.id}`}
                        className="grid gap-3 border-b border-slate-100 py-4 transition last:border-0 hover:bg-slate-50/70 md:grid-cols-[minmax(190px,1.35fr)_minmax(140px,1fr)_105px_95px_100px] md:items-center md:gap-4 md:px-2"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                              build.status === "Failed"
                                ? "bg-rose-50 text-rose-600"
                                : build.status === "Running"
                                  ? "bg-sky-50 text-sky-600"
                                  : "bg-indigo-50 text-indigo-600"
                            }`}
                          >
                            <Terminal className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-800">
                              {build.name}
                            </span>
                            <span className="mt-1 block truncate text-[10px] text-slate-400">
                              {build.repository}
                            </span>
                          </span>
                          <ArrowUpRight className="hidden size-3.5 shrink-0 text-slate-300 md:block" />
                        </span>
                        <span className="flex items-center justify-between text-[10px] text-slate-500 md:block">
                          <span className="flex items-center gap-2">
                            <GitBranch className="size-3 text-slate-400" />
                            <span className="max-w-[120px] truncate">
                              {build.branch}
                            </span>
                            <GitCommitHorizontal className="ml-1 size-3 text-slate-400" />
                            <span>{build.commit}</span>
                          </span>
                          <span className="md:hidden">
                            {build.startedAt.replace("Today, ", "")}
                          </span>
                        </span>
                        <span className="flex items-center justify-between md:block">
                          <span className="text-[10px] text-slate-400 md:hidden">
                            Status
                          </span>
                          <Badge
                            variant="outline"
                            className={`h-6 rounded-full px-2 text-[9px] font-semibold ${statusStyles[build.status]}`}
                          >
                            <StatusIcon
                              className={`mr-1 size-3 ${
                                build.status === "Running" ? "animate-spin" : ""
                              }`}
                            />
                            {build.status}
                          </Badge>
                        </span>
                        <span className="flex items-center justify-between text-[10px] text-slate-500 md:block">
                          <span className="md:hidden">Duration</span>
                          {build.duration}
                        </span>
                        <span className="hidden text-[10px] text-slate-500 md:block">
                          {build.startedAt.replace("Today, ", "")}
                        </span>
                        {build.status === "Running" && (
                          <span className="col-span-full flex items-center gap-2 pl-12 md:hidden">
                            <Progress
                              value={build.progress}
                              aria-label={`${build.name} progress`}
                              className="gap-0"
                            />
                            <span className="text-[10px] tabular-nums text-slate-400">
                              {build.progress}%
                            </span>
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>

              <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.7fr)]">
                <Card className="gap-0 rounded-2xl border-0 bg-white py-0 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/70">
                  <CardHeader className="px-5 pb-2 pt-5">
                    <CardTitle className="text-sm font-semibold">
                      Latest build
                    </CardTitle>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Most recent run in this workspace
                    </p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 px-5 pb-5 pt-2 sm:flex-row sm:items-center">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                        latestBuild.status === "Failed"
                          ? "bg-rose-50 text-rose-600"
                          : latestBuild.status === "Succeeded"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-sky-50 text-sky-600"
                      }`}
                    >
                      {latestBuild.status === "Failed" ? (
                        <TriangleAlert className="size-5" />
                      ) : latestBuild.status === "Succeeded" ? (
                        <Check className="size-5" />
                      ) : (
                        <Clock3 className="size-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {latestBuild.name}{" "}
                        <span className="font-normal text-slate-400">
                          · {latestBuild.status.toLowerCase()}
                        </span>
                      </p>
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {latestBuild.environment} · {latestBuild.branch} ·{" "}
                        {latestBuild.commit} · {latestBuild.startedAt}
                      </p>
                    </div>
                    <Link
                      href={`/builds/${latestBuild.id}`}
                      className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                      View build
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="gap-0 rounded-2xl border-0 bg-indigo-600 py-0 text-white shadow-sm shadow-indigo-200">
                  <CardContent className="flex h-full items-center gap-4 p-5">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                      <GitBranch className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">Connect a repository</p>
                      <p className="mt-1 text-[10px] text-indigo-100">
                        Set up automated builds from your git provider.
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-indigo-100" />
                  </CardContent>
                </Card>
              </section>

              <footer className="flex flex-col items-center justify-between gap-2 py-7 text-[10px] text-slate-400 sm:flex-row">
                <span>Buildboard · Studio North</span>
                <span>Builds are looking good. Keep shipping.</span>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
