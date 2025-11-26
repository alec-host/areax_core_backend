'use strict';

/**
 * Migration: Replace GEOMETRY(location) with decimal lat/lon fields (Option 1),
 * include time_zone, and add appropriate BTREE indexes.
 *
 * Table: tbl_areax_users
 *
 * Up:
 *  - Add lat DECIMAL(8,6) NULL, lon DECIMAL(9,6) NULL (if missing)
 *  - If location exists:
 *      * Drop SPATIAL index on location (if any)
 *      * Backfill lat/lon from location using ST_Y/ST_X
 *      * Drop location column
 *  - Add time_zone VARCHAR(75) NULL (if missing)
 *  - Add indexes:
 *      * idx_users_lat_lon on (lat, lon)
 *      * idx_users_time_zone on (time_zone)
 *
 * Down (best-effort):
 *  - Remove indexes
 *  - Recreate location POINT NULL
 *  - Backfill location = POINT(lon, lat) where both present
 *  - Drop lat/lon
 *  - Drop time_zone
 *  - (Optionally) recreate SPATIAL index (commented)
 */

const TABLE = 'tbl_areax_users';
const IDX_LAT_LON = 'idx_users_lat_lon';
const IDX_TIME_ZONE = 'idx_users_time_zone';
const POSSIBLE_SPATIAL_INDEXES = [
  'users_location_spatial_idx',
  'places_location_spatial_idx'
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const qi = queryInterface;
    const t = await qi.describeTable(TABLE);

    // 1) Ensure lat/lon columns exist (DECIMAL, nullable)
    if (!t.lat) {
      await qi.addColumn(TABLE, 'lat', {
        type: Sequelize.DECIMAL(8, 6),
        allowNull: true
      });
    }
    if (!t.lon) {
      await qi.addColumn(TABLE, 'lon', {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: true
      });
    }

    // 2) If location exists, drop spatial indexes, backfill lat/lon, then drop location
    const hasLocation = !!t.location;
    if (hasLocation) {
      // Drop any spatial indexes that may exist
      for (const idx of POSSIBLE_SPATIAL_INDEXES) {
        try {
          await qi.removeIndex(TABLE, idx);
        } catch (_) { /* ignore if missing */ }
      }

      // Backfill lat/lon from location where present
      // ST_Y = latitude, ST_X = longitude
      await qi.sequelize.query(`
        UPDATE ${TABLE}
        SET lat = IF(location IS NULL, lat, ST_Y(location)),
            lon = IF(location IS NULL, lon, ST_X(location))
      `);

      // Drop the location column now that we've copied values
      await qi.removeColumn(TABLE, 'location');
    }

    // 3) Add time_zone if missing
    const afterT = await qi.describeTable(TABLE);
    if (!afterT.time_zone) {
      await qi.addColumn(TABLE, 'time_zone', {
        type: Sequelize.STRING(75),
        allowNull: true
      });
    }

    // 4) Add indexes (idempotent-ish)
    // Composite index for bbox queries
    try {
      await qi.addIndex(TABLE, ['lat', 'lon'], { name: IDX_LAT_LON });
    } catch (_) { /* ignore if already exists */ }

    // Simple index on time_zone (useful if you filter/group by tz)
    try {
      await qi.addIndex(TABLE, ['time_zone'], { name: IDX_TIME_ZONE });
    } catch (_) { /* ignore if already exists */ }
  },

  async down(queryInterface, Sequelize) {
    const qi = queryInterface;

    // 1) Drop indexes
    try { await qi.removeIndex(TABLE, IDX_LAT_LON); } catch (_) {}
    try { await qi.removeIndex(TABLE, IDX_TIME_ZONE); } catch (_) {}

    const t = await qi.describeTable(TABLE);

    // 2) Recreate location column (POINT, nullable)
    if (!t.location) {
      await qi.addColumn(TABLE, 'location', {
        type: 'POINT',
        allowNull: true
      });
    }

    // 3) Backfill location from lon/lat if both present
    // (POINT(lon, lat) where lon/lat not null)
    await qi.sequelize.query(`
      UPDATE ${TABLE}
      SET location = IF(lon IS NOT NULL AND lat IS NOT NULL, POINT(lon, lat), location)
    `);

    // 4) Drop lat/lon columns if they exist
    const t2 = await qi.describeTable(TABLE);
    if (t2.lat) await qi.removeColumn(TABLE, 'lat');
    if (t2.lon) await qi.removeColumn(TABLE, 'lon');

    // 5) Drop time_zone column if it exists
    const t3 = await qi.describeTable(TABLE);
    if (t3.time_zone) await qi.removeColumn(TABLE, 'time_zone');

    // (Optional) Recreate spatial index if you want to restore it:
    // try {
    //   await qi.addIndex(TABLE, ['location'], {
    //     name: 'users_location_spatial_idx',
    //     type: 'SPATIAL'
    //   });
    // } catch (_) {}
  }
};
