export interface IUserContext {
  userData: IUserData;
  token: string | null;
  checking: boolean;
  hRemember: boolean | null;
  lastCheck: number | null;
}

export interface IUserData {
  id?: number | null;
  username: string | null;
  email: string | null;
  country?: string | null;
  picture?: {
    id: number | null;
    height: number | null;
    url: string | null;
    width: number | null;
  } | null;
  confirmed?: boolean;
  blocked?: boolean;
}
