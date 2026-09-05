"""phase 2 and phase 3 tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-04 20:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table('soil_sensor_stations',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('field_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('station_code', sa.String(), nullable=False),
        sa.Column('location', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=False),
        sa.Column('soil_type', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['field_id'], ['fields.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('station_code')
    )
    op.create_index('ix_soil_sensor_stations_location_gist', 'soil_sensor_stations', ['location'], unique=False, postgresql_using='gist')

    op.create_table('soil_metric_readings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('station_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('moisture_percentage', sa.Float(), nullable=False),
        sa.Column('temperature_celsius', sa.Float(), nullable=False),
        sa.Column('nitrogen_mg_kg', sa.Float(), nullable=False),
        sa.Column('phosphorus_mg_kg', sa.Float(), nullable=False),
        sa.Column('potassium_mg_kg', sa.Float(), nullable=False),
        sa.Column('ec_ds_m', sa.Float(), nullable=False),
        sa.Column('recorded_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['station_id'], ['soil_sensor_stations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('drone_telemetry_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('drone_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mission_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('location', geoalchemy2.types.Geometry(geometry_type='POINT', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=False),
        sa.Column('altitude_m', sa.Float(), nullable=False),
        sa.Column('velocity_m_s', sa.Float(), nullable=True),
        sa.Column('heading_deg', sa.Float(), nullable=True),
        sa.Column('pitch_deg', sa.Float(), nullable=True),
        sa.Column('roll_deg', sa.Float(), nullable=True),
        sa.Column('battery_percentage', sa.Float(), nullable=False),
        sa.Column('rtk_fix_status', sa.String(), nullable=True),
        sa.Column('signal_rssi_dbm', sa.Float(), nullable=True),
        sa.Column('jetson_temp_celsius', sa.Float(), nullable=True),
        sa.Column('telemetry_metadata', sa.JSON(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['drone_id'], ['drones.id'], ),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_drone_telemetry_logs_location_gist', 'drone_telemetry_logs', ['location'], unique=False, postgresql_using='gist')

def downgrade() -> None:
    op.drop_table('drone_telemetry_logs')
    op.drop_table('soil_metric_readings')
    op.drop_table('soil_sensor_stations')
