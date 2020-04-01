import { ArgumentError, InnerError } from "@zxteam/errors";

export class AuthFailedError extends InnerError { }
export class BrokenUserProfileDataModelError extends ArgumentError { }
export class ExpiredUserProfileError extends Error { }
