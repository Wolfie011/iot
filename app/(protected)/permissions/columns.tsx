"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { RolePermission, Permission, Role } from "@/types/permission/types";
import { deleteRole, updateRolePermission } from "@/app/actions/role.action";
import { toast } from "@/hooks/use-toast";
import emitter from "@/lib/eventBus";
import { X } from "lucide-react";

export function getColumns(
  roles: Role[],
  rolePermissions: RolePermission[]
): ColumnDef<Permission>[] {
  const hasPermission = (permissionId: string, roleId: string) => {
    const rp = rolePermissions.find((r) => r.id === roleId);
    return rp?.permission.some((p) => p.id === permissionId) ?? false;
  };

  return [
    {
      accessorKey: "tag",
      header: "Permission",
      cell: ({ row }) => {
        const perm = row.original;
        return (
          <div className="flex flex-col space-y-1 py-2">
            <span className="font-medium text-foreground leading-none">
              {perm.tag}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {perm.id}
            </span>
          </div>
        );
      },
      minSize: 200,
    },
    ...roles.map((role) => ({
      id: role.id,
      accessorKey: `role-${role.id}`,
      header: () => (
        <div className="text-center font-semibold">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">{role.tag}</span>
            <button
              onClick={() => {
                deleteRole(role.id).then((res) => {
                  if (res.state === "success") {
                    emitter.emit("roleDeleted", role.id);
                  }
                });
              }}
              className="text-red-600 hover:text-red-800"
              title="Usuń rolę"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      cell: ({ row }: { row: { original: Permission } }) => {
        const perm = row.original;
        const checked = hasPermission(perm.id, role.id);

        const handleChange = async (assigned: boolean) => {
          const result = await updateRolePermission({
            roleId: role.id,
            permissionId: perm.id,
            assigned,
          });

          if (result.state === "error") {
            toast({
              variant: "destructive",
              description: result.error || "Błąd aktualizacji uprawnienia",
            });
            return;
          }

          toast({
            description: `Uprawnienie ${
              assigned ? "przypisane" : "odpisane"
            } roli ${role.tag}`,
          });

          emitter.emit("rolePermissionUpdated", role);
        };

        return (
          <div className="flex items-center justify-center py-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(val) => handleChange(!!val)}
              className="h-4 w-4"
            />
          </div>
        );
      },
      size: 120,
      minSize: 100,
      maxSize: 150,
    })),
  ];
}
