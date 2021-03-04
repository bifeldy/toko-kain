import { Role } from './Role';

interface User {
  id?: number;
  username?: string;
  email?: string;
  role?: Role;
  created_at?: number;
  updated_at?: number;
  session_token?: string;
}

export default User;
