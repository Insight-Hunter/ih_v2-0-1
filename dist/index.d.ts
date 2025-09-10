import { D1Database } from '@cloudflare/workers-types';
interface Env {
    DB: D1Database;
    JWT_SECRET: string;
}
declare const _default: {
    fetch(request: Request, env: Env): Promise<Response>;
};
export default _default;
//# sourceMappingURL=index.d.ts.map