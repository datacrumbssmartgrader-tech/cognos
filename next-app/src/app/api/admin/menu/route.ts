import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { eventManager } from '@/lib/events';

export async function GET(req: NextRequest) {
  try {
    const items = await sql`
      SELECT id, name, category, price, description, image_url, image_public_id, available, hidden, created_at
      FROM menu_items ORDER BY category, name
    `;

    return NextResponse.json({
      success: true,
      count: items.length,
      items: items,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, price, description, image_url, image_public_id } = body;

    // Validate required fields
    if (!name || !category || price === undefined || !image_url || !image_public_id) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price, image_url, image_public_id' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO menu_items (name, category, price, description, image_url, image_public_id, available, hidden)
      VALUES (${name}, ${category}, ${price}, ${description || null}, ${image_url}, ${image_public_id}, true, false)
      RETURNING id, name, category, price, description, image_url, image_public_id, available, hidden, created_at
    `;

    const item = result[0];

    // Emit event to admin stream
    eventManager.emitToAdmin('menu:item_added', {
      item_id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      created_at: item.created_at,
    });

    return NextResponse.json(
      {
        success: true,
        item: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item', details: String(error) },
      { status: 500 }
    );
  }
}
