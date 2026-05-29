import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const getClientIp = (req: Request) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim();
  }

  return (
    req.headers.get('x-real-ip') ||
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-client-ip') ||
    'unknown'
  );
};

const hashValue = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const pagePath = typeof body.page_path === 'string' && body.page_path.trim()
      ? body.page_path.slice(0, 240)
      : '/';
    const now = new Date().toISOString();
    const ip = getClientIp(req);
    const ipHash = await hashValue(`${Deno.env.get('BASE44_APP_ID') || 'alek-portfolio'}:${ip}`);

    const existing = await base44.asServiceRole.entities.PageView.filter({
      ip_hash: ipHash,
    });

    if (existing?.[0]) {
      const record = existing[0];
      await base44.asServiceRole.entities.PageView.update(record.id, {
        page_path: pagePath,
        last_seen_at: now,
        view_count: (record.view_count || 1) + 1,
      });

      return Response.json({ counted: false });
    }

    await base44.asServiceRole.entities.PageView.create({
      ip_hash: ipHash,
      page_path: pagePath,
      first_seen_at: now,
      last_seen_at: now,
      view_count: 1,
    });

    return Response.json({ counted: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
