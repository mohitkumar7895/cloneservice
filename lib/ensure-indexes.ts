import pool from "./db";

let started = false;

export function ensureIndexes() {
  if (started) return;
  started = true;

  void (async () => {
    const statements = [
      "ALTER TABLE bookings ADD COLUMN service_opted BOOLEAN DEFAULT FALSE",
      "CREATE INDEX idx_bookings_created_at ON bookings (created_at)",
      "CREATE INDEX idx_bookings_type_status ON bookings (type, working_status)",
      "CREATE INDEX idx_bookings_order_id ON bookings (order_id)",
      "CREATE INDEX idx_services_category_id ON services (category_id)",
      "CREATE INDEX idx_categories_status ON categories (status)",
    ];
    for (const sql of statements) {
      try {
        await pool.query(sql);
      } catch {
        // Index already exists
      }
    }
  })();
}
