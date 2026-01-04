/**
 * Studio Mode Types and Route Mapping
 * Single source of truth for app navigation modes
 */

export type StudioMode = "CREATE" | "GROW" | "LIBRARY";

export const MODE_MAP: Record<StudioMode, string[]> = {
  CREATE: [
    "/ideas",
    "/script",
    "/recorder",
    "/editor",
    "/thumbnail",
    "/youtube-upload",
    "/ai-assistant"
  ],
  GROW: [
    "/analytics",
    "/viral-optimizer",
    "/progress",
    "/calendar",
    "/roadmap"
  ],
  LIBRARY: [
    "/templates",
    "/soundboard",
    "/repository",
    "/multi-platform"
  ]
};

/**
 * Get current mode based on route path
 */
export function getModeFromPath(path: string): StudioMode | null {
  for (const mode of Object.keys(MODE_MAP) as StudioMode[]) {
    if (MODE_MAP[mode].includes(path)) {
      return mode;
    }
  }
  return null;
}

/**
 * CREATE mode stepper configuration
 * Fixed order: Idea → Script → Record → Edit → Thumbnail → Upload
 */
export const CREATE_STEPPER = [
  { path: "/ideas", label: "Idea", step: 1 },
  { path: "/script", label: "Script", step: 2 },
  { path: "/recorder", label: "Record", step: 3 },
  { path: "/editor", label: "Edit", step: 4 },
  { path: "/thumbnail", label: "Thumbnail", step: 5 },
  { path: "/youtube-upload", label: "Upload", step: 6 }
];

/**
 * GROW mode navigation items
 */
export const GROW_NAV_ITEMS = [
  { path: "/analytics", label: "Analytics" },
  { path: "/viral-optimizer", label: "Viral Optimizer" },
  { path: "/progress", label: "Progress" },
  { path: "/calendar", label: "Calendar" },
  { path: "/roadmap", label: "Roadmap" }
];

/**
 * LIBRARY mode navigation items
 */
export const LIBRARY_NAV_ITEMS = [
  { path: "/templates", label: "Templates" },
  { path: "/soundboard", label: "Soundboard" },
  { path: "/repository", label: "Repository" },
  { path: "/multi-platform", label: "Multi-Platform" }
];
