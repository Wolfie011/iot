"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTablePermission/data-table";
import { getColumns } from "./columns";
import {
  listRoles,
  listRolePermissions,
  listPermissionsPaginated,
} from "@/app/actions/role.action";
import { Role, Permission, RolePermission } from "@/types/permission/types";
import emitter from "@/lib/eventBus";

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(14);

  const fetchData = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes, rolePermsRes] = await Promise.all([
        listRoles(),
        listPermissionsPaginated(page, size),
        listRolePermissions(),
      ]);

      if (rolesRes.state === "success") setRoles(rolesRes.data || []);
      if (permsRes.state === "success" && permsRes.data) {
        setPermissions(permsRes.data.data || []);
        setTotal(permsRes.data.total || 0);
      }
      if (rolePermsRes.state === "success")
        setRolePermissions(rolePermsRes.data || []);
    } catch (err) {
      console.error("Error fetching permission data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  useEffect(() => {
    const listener = (newRole: Role) => {
      setRoles((prev) => [...prev, newRole]);
    };
    emitter.on("roleCreated", listener);
    return () => emitter.off("roleCreated", listener);
  }, []);
useEffect(() => {
  const listener = (deletedId: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== deletedId));
  };

  emitter.on("roleDeleted", listener);
  return () => emitter.off("roleDeleted", listener);
}, []);
  useEffect(() => {
    const listener = (updatedRole: Role) => {
      // Odśwież tylko rolePermissions (np. przez ponowne zapytanie)
      listRolePermissions().then((res) => {
        if (res.state === "success") {
          setRolePermissions(res.data || []);
        }
      });
    };

    emitter.on("rolePermissionUpdated", listener);
    return () => emitter.off("rolePermissionUpdated", listener);
  }, []);

  const columns = getColumns(roles, rolePermissions);

  return (
    <DataTable
      columns={columns}
      data={permissions}
      total={total}
      isLoading={isLoading}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPaginationChange={(index: number, size: number) => {
        setPageIndex(index);
        setPageSize(size);
      }}
    />
  );
}
