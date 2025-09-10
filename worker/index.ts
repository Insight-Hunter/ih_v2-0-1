/// <reference types="@cloudflare/workers-types" />

import bcrypt from 'bcryptjs';
import jwt from '@tsndr/cloudflare-worker-jwt';

declare const IH_DB: D1Database;

interface Env {
  IH_DB: D1Database;
  JWT_SECRET: string;
}

const parseJSON = async (req: Request): Promise<any | null> => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

function createJsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function verifyToken(authHeader: string, env: Env): Promise<any | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);

  const valid = await jwt.verify(token, env.JWT_SECRET);
  if (!valid) return null;

  const decoded = jwt.decode(token);
  return decoded?.payload || null;
}

function validateEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password: unknown): boolean {
  return typeof password === 'string' && password.length >= 6;
}

function validateTransaction(data: any): boolean {
  if (!data) return false;
  const { date, amount, type } = data;
  if (typeof date !== 'string' || !date.trim()) return false;
  if (typeof amount !== 'number') return false;
  if (typeof type !== 'string' || !type.trim()) return false;
  return true;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ===== Signup =====
    if (path === '/api/auth/signup' && method === 'POST') {
      const data = await parseJSON(request);
      if (!data || !validateEmail(data.email) || !validatePassword(data.password)) {
        return createJsonResponse({ error: 'Invalid email or password' }, 400);
      }

      const existing = await env.IH_DB.prepare('SELECT id FROM users WHERE email = ?')
        .bind(data.email)
        .first();
      if (existing) return createJsonResponse({ error: 'Email already registered' }, 409);

      const hashedPassword = await bcrypt.hash(data.password, 10);
      await env.IH_DB.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
        .bind(data.email, hashedPassword)
        .run();

      return createJsonResponse({ message: 'User created' }, 201);
    }

    // ===== Login =====
    if (path === '/api/auth/login' && method === 'POST') {
      const data = await parseJSON(request);
      if (!data || !validateEmail(data.email) || !validatePassword(data.password)) {
        return createJsonResponse({ error: 'Invalid email or password' }, 400);
      }

      const user: any = await env.IH_DB.prepare('SELECT * FROM users WHERE email = ?')
        .bind(data.email)
        .first();
      if (!user) return createJsonResponse({ error: 'Invalid credentials' }, 401);

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) return createJsonResponse({ error: 'Invalid credentials' }, 401);

      const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      const token = await jwt.sign({ id: user.id, email: user.email, exp }, env.JWT_SECRET);

      return createJsonResponse({ token });
    }

    // ===== Verify JWT for protected routes =====
    const authHeader = request.headers.get('Authorization') || '';
    const decoded = await verifyToken(authHeader, env);
    if (!decoded) {
      return createJsonResponse({ error: 'Unauthorized' }, 401);
    }

    // ===== Metrics (placeholder) =====
    if (path === '/api/metrics' && method === 'GET') {
      const metrics = {
        totalRevenue: 100000,
        monthlyGrowth: 10.5,
        cashFlow: 50000,
      };
      return createJsonResponse(metrics);
    }

    // ===== Transactions: GET with pagination & filters =====
    if (path === '/api/transactions' && method === 'GET') {
      const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);
      const startDate = url.searchParams.get('startDate');
      const endDate = url.searchParams.get('endDate');

      let query = 'SELECT * FROM transactions WHERE user_id = ?';
      const params: any[] = [decoded.id];

      if (startDate) { query += ' AND date >= ?'; params.push(startDate); }
      if (endDate) { query += ' AND date <= ?'; params.push(endDate); }

      query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const results = await env.IH_DB.prepare(query).bind(...params).all();

      return createJsonResponse({
        transactions: results.results || [],
        pagination: {
          limit,
          offset,
          count: results.results?.length || 0,
        },
      });
    }

    // ===== Transactions: POST =====
    if (path === '/api/transactions' && method === 'POST') {
      const data = await parseJSON(request);
      if (!validateTransaction(data)) {
        return createJsonResponse({ error: 'Invalid transaction data' }, 400);
      }

      await env.IH_DB.prepare(
        'INSERT INTO transactions (user_id, date, description, category, amount, type) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        decoded.id,
        data.date,
        data.description || null,
        data.category || null,
        data.amount,
        data.type
      ).run();

      return createJsonResponse({ message: 'Transaction added' }, 201);
    }

    // ===== Not found =====
    return createJsonResponse({ error: 'Not found' }, 404);
  },
};