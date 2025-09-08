import { D1Database } from '@cloudflare/workers-types';
import { bcrypt } from '@cfworker/webcrypto';
import jwt from '@tsndr/cloudflare-worker-jwt';

const JWT_SECRET = 'replace-this-with-very-secure-secret';

declare const DB: D1Database;

interface Env {
  DB: D1Database;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashed = await bcrypt.hash(password);
  return hashed; // bcrypt library output
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Utility to parse JSON body safely
    async function parseJSON(req: Request) {
      try {
        return await req.json();
      } catch {
        return null;
      }
    }

    // Signup User
    if (path === '/api/auth/signup' && method === 'POST') {
      const data = await parseJSON(request);
      if (!data?.email || !data?.password)
        return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });

      // Check email exists
      const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(data.email).first();
      if (existing) return new Response(JSON.stringify({ error: 'Email already registered' }), { status: 409 });

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password);

      // Insert user
      await env.DB.prepare('INSERT INTO users (email, password) VALUES (?, ?)').bind(data.email, hashedPassword).run();

      return new Response(JSON.stringify({ message: 'User created' }), { status: 201 });
    }

    // Login User
    if (path === '/api/auth/login' && method === 'POST') {
      const data = await parseJSON(request);
      if (!data?.email || !data?.password)
        return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400 });

      const user: any = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(data.email).first();
      if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

      // Verify password
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });

      // Generate JWT
      const token = await jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return new Response(JSON.stringify({ token }), { status: 200 });
    }

    // Authenticate from JWT token in Authorization header
    const authHeader = request.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const token = authHeader.substring(7);
    let decoded: any;
    try {
      decoded = await jwt.verify(token, JWT_SECRET);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 403 });
    }

    // Protected routes below

    // Fetch metrics for logged in user
    if (path === '/api/metrics' && method === 'GET') {
      // Placeholder metrics logic - add actual queries as needed
      const metrics = {
        totalRevenue: 100000,
        monthlyGrowth: 10.5,
        cashFlow: 50000,
      };
      return new Response(JSON.stringify(metrics), { status: 200 });
    }

    // Get transactions for logged user
    if (path === '/api/transactions' && method === 'GET') {
      const transactions = await env.DB
        .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC')
        .bind(decoded.id)
        .all();

      return new Response(JSON.stringify({ transactions: transactions.results || [] }), { status: 200 });
    }

    // Add a transaction
    if (path === '/api/transactions' && method === 'POST') {
      const data = await parseJSON(request);
      if (!data) return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });

      const { date, description, category, amount, type } = data;

      if (!date || !amount || !type) return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });

      await env.DB
        .prepare(
          'INSERT INTO transactions (user_id, date, description, category, amount, type) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .bind(decoded.id, date, description, category, amount, type)
        .run();

      return new Response(JSON.stringify({ message: 'Transaction added' }), { status: 201 });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  },
};
