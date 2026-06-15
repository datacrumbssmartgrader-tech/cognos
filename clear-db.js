const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function clear() {
  try {
    await sql`DELETE FROM waiter_alerts;`;
    await sql`DELETE FROM order_items;`;
    await sql`DELETE FROM payments;`;
    await sql`DELETE FROM orders;`;
    await sql`DELETE FROM sessions;`;
    
    // reset tables to empty statuses
    await sql`UPDATE restaurant_tables SET status = 'empty';`;
    
    console.log('Cleared transaction tables successfully.');
  } catch (e) {
    console.error('Error clearing tables:', e);
  }
}

clear();
