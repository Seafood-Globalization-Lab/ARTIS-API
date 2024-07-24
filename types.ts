export interface RequestHandler {
    (request: Request): Response | Promise<Response>;
}

export interface Middleware {
    (handler: RequestHandler): RequestHandler;
}
