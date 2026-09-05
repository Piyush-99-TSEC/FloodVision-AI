import { UserRole } from "../models/User";

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
