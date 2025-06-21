import { Permission, RolePermission } from "@/types/permission/types";
import { roleJob, RoleJob, UserDTO } from "@/types/user/types";
import mitt from "mitt";

// Definicja typów zdarzeń aplikacji
type Events = {
  userCreated: UserDTO;
  userUpdated: UserDTO;
  userDeleted: string;
  openUserDialog: UserDTO;

  roleCreated: Permission;
};

// Globalny emitter typu Events
const emitter = mitt<Events>();

export default emitter;
