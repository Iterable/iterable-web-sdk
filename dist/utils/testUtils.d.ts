export declare const createClientError: (clientErrors: {
    error: string;
    field?: string;
}[]) => {
    response: {
        data: {
            code: string;
            msg: string;
            clientErrors: {
                error: string;
                field?: string | undefined;
            }[];
        };
        status: number;
        statusText: string;
        headers: {};
        config: {};
    };
};
