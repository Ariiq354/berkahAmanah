export const useTopbarTitle = () => useState("topbar-title");

export const useSidebarToggle = () => useState("sidebar-state", () => true);

export function defineTopbarTitle(title: string) {
  useTopbarTitle().value = title;
}
