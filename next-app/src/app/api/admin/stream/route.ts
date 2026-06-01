import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth';
import { eventManager } from '@/lib/events';

/**
 * GET /api/admin/stream
 * Server-Sent Events stream for admin dashboard
 * Emits events for: orders, menu items, alerts, payments, table status
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

    // Create SSE response
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        controller.enqueue('data: {"type":"connected","message":"Admin stream connected"}\n\n');

        // Register listener
        const unsubscribe = eventManager.registerAdminListener({
          send: (data: string) => {
            try {
              controller.enqueue(data);
            } catch (error) {
              console.error('SSE send error:', error);
            }
          },
          close: () => {
            controller.close();
          },
        });

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          unsubscribe();
          controller.close();
        });
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('GET /api/admin/stream error:', error);
    return NextResponse.json(
      { error: 'Failed to establish stream' },
      { status: 500 }
    );
  }
}
