export interface VerifiedUser {
  phone: string;
  name: string;
  email?: string;
  verified: boolean;
  verifiedAt: string;
  isAdmin?: boolean;
}
