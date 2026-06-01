import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { verifyTokenEdge } from '@/lib/auth';

/**
 * GET /api/admin/tables
 * Returns all restaurant tables with QR token and session info
 * Requires authentication
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

    // Get all tables with session info
    const tables = await sql`
      SELECT 
        id,
        label,
        status,
        qr_token,
        active_session_id,
        alert_active,
        qr_regenerated_at,
        created_at
      FROM restaurant_tables
      ORDER BY id ASC
    `;

    // Transform table IDs to numbers for response
    const formattedTables = tables.map((table: any) => ({
      id: table.id,
      number: parseInt(table.id.substring(1)), // Extract number from T01 -> 1
      label: table.label,
      status: table.status,
      qr_token: table.qr_token.toString(),
      active_session_id: table.active_session_id,
      alert_active: table.alert_active,
      qr_regenerated_at: table.qr_regenerated_at,
      created_at: table.created_at,
    }));

    return NextResponse.json(formattedTables, { status: 200 });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}
