export interface RegisterRequest {
  email: string;
  password: string;
  dateOfBirth: Date;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  genderPref: 'male' | 'female' | 'both';
  ethnicityId: number;
  countryCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordCodeRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: number;
  password: string;
}
export interface JwtPayload {
  uid: string;
}
