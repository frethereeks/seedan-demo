export type Role = "super_admin" | "admin" | "staff" | "user";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  user: "Member",
};

// What SEEDAN's committee will actually care about: who can do what,
// without touching code. This table is the single source of truth for
// access control — change it here and every page/API route respects it.
export const PERMISSIONS = {
  // Content / blog
  posts_create: ["super_admin", "admin", "staff"] as Role[],
  posts_publish: ["super_admin", "admin"] as Role[],
  posts_delete: ["super_admin", "admin"] as Role[],
  posts_edit_any: ["super_admin", "admin"] as Role[], // staff may only edit their own drafts

  // Membership
  members_view: ["super_admin", "admin", "staff"] as Role[],
  members_decide: ["super_admin", "admin"] as Role[], // approve / reject / suspend / reactivate

  // Platform administration
  users_manage: ["super_admin"] as Role[],
  dashboard_view: ["super_admin", "admin", "staff"] as Role[],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  return (PERMISSIONS[permission] as Role[]).includes(role);
}

// Roles allowed into /dashboard at all. Plain members ("user") get their
// own lightweight area instead — see /account.
export const DASHBOARD_ROLES: Role[] = ["super_admin", "admin", "staff"];
