/**
 * Type declarations for passport-twitch-new
 * Package doesn't have official types
 */

declare module 'passport-twitch-new' {
  import { Strategy as PassportStrategy } from 'passport';

  export interface TwitchProfile {
    id: string;
    login: string;
    display_name: string;
    email?: string;
    profile_image_url?: string;
    broadcaster_type?: string;
    description?: string;
    view_count?: number;
    created_at?: string;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string | string[];
  }

  export type VerifyCallback = (err?: Error | null, user?: Express.User, info?: any) => void;

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: TwitchProfile,
    done: VerifyCallback
  ) => void | Promise<void>;

  export class Strategy implements PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    name: string;
    authenticate(req: any, options?: any): void;
  }
}
