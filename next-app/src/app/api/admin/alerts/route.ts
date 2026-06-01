import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyTokenEdge } from '@/lib/auth';

/**
 * POST /api/admin/alerts
 * Create a waiter alert (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('cookie')?.split('rw_session=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { session_id, alert_type, message } = body;

    if (!session_id || !alert_type) {
      return NextResponse.json(
        { error: 'Missing required fields: session_id, alert_type' },
        { status: 400 }
      );
    }

    // Get session and table info
    const sessionResult = await sql`
      SELECT id, table_id FROM sessions WHERE id = ${session_id}::uuid
    `;

    if (sessionResult.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const session = sessionResult[0];

    // Create alert
    const alertResult = await sql`
      INSERT INTO waiter_alerts (table_id, session_id, type, message, dismissed)
      VALUES (${session.table_id}, ${session_id}::uuid, ${alert_type}::alert_type, ${message || null}, false)
      RETURNING id, table_id, session_id, type, message, dismissed, created_at
    `;

    const alert = alertResult[0];

    return NextResponse.json(
      {
        alert_id: alert.id,
        table_id: alert.table_id,
        session_id: alert.session_id,
        type: alert.type,
        status: alert.dismissed ? 'resolved' : 'pending',
        message: alert.message,
        created_at: alert.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/alerts
 * List all active alerts (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.headers.get('cookie')?.split('rw_session=')[1]?.split(';')[0];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get active alerts
    const alerts = await sql`
      SELECT 
        id, 
        table_id, 
        session_id, 
        type, 
        message, 
        dismissed, 
        created_at
      FROM waiter_alerts
      WHERE dismissed = false
      ORDER BY created_at DESC
    `;

    return NextResponse.json(
      alerts.map((alert: any) => ({
        alert_id: alert.id,
        table_id: alert.table_id,
        session_id: alert.session_id,
        type: alert.type,
        status: alert.dismissed ? 'resolved' : 'pending',
        message: alert.message,
        created_at: alert.created_at,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/admin/alerts error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve alerts' },
      { status: 500 }
    );
  }
}
