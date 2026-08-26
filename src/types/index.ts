export type ActionResponse = {
  success: boolean;
  message?: string;
};

export type Role = {
  id: number;
  name: string;
  isActive: boolean;
  isSystem: boolean;
  permissions: {
    roleId: number;
    permissionId: number;
    permission: {
      id: number;
      name: string;
      description: string;
    };
  }[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  roleId: number;
  createdAt: string;
  role: Role;
  permissions: string[];
};
