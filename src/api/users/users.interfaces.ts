export interface CreateUserWithDeviceOptions {
  email: string;
  password: string;
  dateOfBirth: Date;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  genderPref: 'male' | 'female' | 'both';
  ethnicityId: number;
  countryCode: string;
  udid: string;
  mac: string;
  name: string;
  osVersion: string;
  platform: string;
}
export interface ComfirmationCodeRequest {
  code: number;
  expireAt: string;
  type: 'email' | 'reset_password';
  userId: number;
}
