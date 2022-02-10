interface GenerateJWTPayload {
    email?: string;
    userID?: string;
}
interface WithJWT {
    clearRefresh: () => void;
    setEmail: (email: string) => Promise<string>;
    setUserID: (userId: string) => Promise<string>;
    logout: () => void;
}
interface WithoutJWT {
    setNewAuthToken: (newToken?: string) => void;
    clearAuthToken: () => void;
    setEmail: (email: string) => void;
    setUserID: (userId: string) => Promise<void>;
    logout: () => void;
}
export declare function initialize(authToken: string, generateJWT: (payload: GenerateJWTPayload) => Promise<string>): WithJWT;
export declare function initialize(authToken: string): WithoutJWT;
export {};
