import { createHash, randomBytes } from "node:crypto";

export type BuildStatus = "Succeeded" | "Running" | "Failed" | "Queued";

export type Build = {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  commit: string;
  status: BuildStatus;
  startedAt: string;
  duration: string;
  actor: string;
  progress: number;
  environment: string;
};

const projects = [
  {
    name: "Web dashboard",
    repository: "studio-north/dashboard",
    branches: ["main", "feat/overview", "fix/responsive-nav"],
    description: "Customer workspace dashboard and analytics experience.",
  },
  {
    name: "API gateway",
    repository: "studio-north/api-gateway",
    branches: ["main", "feat/auth-refresh", "fix/rate-limits"],
    description: "Authentication, routing, and service integration updates.",
  },
  {
    name: "Worker service",
    repository: "studio-north/worker",
    branches: ["main", "fix/retry-policy", "feat/queue-metrics"],
    description: "Background jobs and queue reliability improvements.",
  },
  {
    name: "Marketing site",
    repository: "studio-north/marketing",
    branches: ["main", "feat/summer-launch", "fix/landing-page"],
    description: "Campaign pages, content updates, and launch previews.",
  },
  {
    name: "Design system",
    repository: "studio-north/design-system",
    branches: ["main", "feat/color-tokens", "chore/component-docs"],
    description: "Shared components and design token package.",
  },
];

const actors = ["Alex Carter", "Jamie Lee", "Taylor Reed", "Sam Kim", "Devon Cole"];
const statuses: BuildStatus[] = ["Succeeded", "Running", "Failed", "Queued"];

function createRandomizer(seed: string) {
  let state = Number.parseInt(
    createHash("sha256").update(seed).digest("hex").slice(0, 8),
    16,
  );

  return (max: number) => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state % max;
  };
}

function randomTime(next: (max: number) => number) {
  const hour = 8 + next(11);
  const minute = String(next(60)).padStart(2, "0");
  return `Today, ${hour > 12 ? hour - 12 : hour}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

export function getBuild(id: string): Build | undefined {
  if (!/^[a-f0-9]{32}$/.test(id)) {
    return undefined;
  }

  const next = createRandomizer(id);
  const project = projects[next(projects.length)];
  const status = statuses[next(statuses.length)];
  const minutes = 1 + next(8);
  const seconds = next(60);

  return {
    id,
    name: project.name,
    description: project.description,
    repository: project.repository,
    branch: project.branches[next(project.branches.length)],
    commit: id.slice(0, 7),
    status,
    startedAt: randomTime(next),
    duration:
      status === "Running"
        ? `${minutes}m ${String(seconds).padStart(2, "0")}s`
        : status === "Queued"
          ? "Waiting"
          : `${1 + next(4)}m ${String(seconds).padStart(2, "0")}s`,
    actor: actors[next(actors.length)],
    progress:
      status === "Succeeded" || status === "Failed"
        ? 100
        : status === "Queued"
          ? 0
          : 20 + next(75),
    environment: next(3) === 0 ? "Production" : "Preview",
  };
}

export function createBuilds(count = 4): Build[] {
  const ids = new Set<string>();

  while (ids.size < count) {
    ids.add(randomBytes(16).toString("hex"));
  }

  return Array.from(ids, (id) => getBuild(id)).filter(
    (build): build is Build => build !== undefined,
  );
}
