import { navGroups } from "./sidebar-nav-data";

export type UserRole = "admin" | "editor" | string;

export interface NavSubItem {
  label: string;
  href: string;
  routeId?: string;
  exact?: boolean;
  badge?: string | number;
  roles?: UserRole[];
}

export interface NavItem {
  label: string;
  href: string;
  routeId: string;
  icon: string;
  exact?: boolean;
  badge?: string | number;
  roles?: UserRole[];
  subItems?: NavSubItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
  roles?: UserRole[];
}

export { navGroups };

export function getNavGroupsForRole(role?: string): NavGroup[] {
  const normalizedRole = role?.toLowerCase() ?? "";

  return navGroups
    .filter((group) => {
      if (!group.roles) return true;
      return group.roles.includes(normalizedRole);
    })
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => {
          if (!item.roles) return true;
          return item.roles.includes(normalizedRole);
        })
        .map((item) => {
          if (!item.subItems) return item;
          return {
            ...item,
            subItems: item.subItems.filter((sub) => {
              if (!sub.roles) return true;
              return sub.roles.includes(normalizedRole);
            })
          };
        })
    }))
    .filter((group) => group.items.length > 0);
}
