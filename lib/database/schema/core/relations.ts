import {
  relations,
} from "drizzle-orm";
import {
  objectTable,
  edgeTable,
  dataStreamTable,
  eventLogTable,
  userTable,
  roleJobTable,
  roleJobUserTable,
  roleTable,
  permissionTable,
  rolePermissionTable,
  userRoleTable,
  sessionTable,
} from "./core.schema";

// === Object relations ===

export const objectRelations = relations(objectTable, ({ one, many }) => ({
  parent: one(objectTable, {
    fields: [objectTable.parentId],
    references: [objectTable.id],
  }),
  children: many(objectTable, {
    relationName: "object_children",
  }),
  edgesFrom: many(edgeTable, {
    relationName: "edges_from_object",
  }),
  edgesTo: many(edgeTable, {
    relationName: "edges_to_object",
  }),
}));

// === Edge relations ===

export const edgeRelations = relations(edgeTable, ({ one }) => ({
  source: one(objectTable, {
    fields: [edgeTable.sourceId],
    references: [objectTable.id],
  }),
  target: one(objectTable, {
    fields: [edgeTable.targetId],
    references: [objectTable.id],
  }),
}));

// === DataStream relations ===

export const dataStreamRelations = relations(dataStreamTable, ({ one }) => ({
  object: one(objectTable, {
    fields: [dataStreamTable.objectId],
    references: [objectTable.id],
  }),
}));

// === EventLog relations ===

export const eventLogRelations = relations(eventLogTable, ({ one }) => ({
  object: one(objectTable, {
    fields: [eventLogTable.objectId],
    references: [objectTable.id],
  }),
}));

// === User relations ===

export const userRelations = relations(userTable, ({ many }) => ({
  roleJobs: many(roleJobUserTable),
  roles: many(userRoleTable),
  sessions: many(sessionTable),
}));

// === RoleJob relations ===

export const roleJobRelations = relations(roleJobTable, ({ many }) => ({
  users: many(roleJobUserTable),
}));

export const roleJobUserRelations = relations(roleJobUserTable, ({ one }) => ({
  user: one(userTable, {
    fields: [roleJobUserTable.userId],
    references: [userTable.id],
  }),
  roleJob: one(roleJobTable, {
    fields: [roleJobUserTable.roleJobId],
    references: [roleJobTable.id],
  }),
}));

// === Role & Permission relations ===

export const roleRelations = relations(roleTable, ({ many }) => ({
  permissions: many(rolePermissionTable),
  users: many(userRoleTable),
}));

export const permissionRelations = relations(permissionTable, ({ many }) => ({
  roles: many(rolePermissionTable),
}));

export const rolePermissionRelations = relations(rolePermissionTable, ({ one }) => ({
  role: one(roleTable, {
    fields: [rolePermissionTable.roleId],
    references: [roleTable.id],
  }),
  permission: one(permissionTable, {
    fields: [rolePermissionTable.permissionId],
    references: [permissionTable.id],
  }),
}));

export const userRoleRelations = relations(userRoleTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userRoleTable.userId],
    references: [userTable.id],
  }),
  role: one(roleTable, {
    fields: [userRoleTable.roleId],
    references: [roleTable.id],
  }),
}));

// === Session relations ===

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
