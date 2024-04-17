import type { NuxtError } from "#app";

export type User = {
    username: string;
    name: string;
    honor: number;
    clan: string;
    leaderboardPosition: number;
    skills: string[];
}

type ValidGetUserResponse = {
    user: User,
    error: null
}
type ErrorGetUserReponse = {
    user: null,
    error: NuxtError
}
export type GetUserResponse = ValidGetUserResponse | ErrorGetUserReponse