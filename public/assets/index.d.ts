interface Env {
    IH_DB: D1Database;
    JWT_SECRET: string;
}
declare const _default: {
    fetch(request: Request, env: Env): Promise<Response>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map