"""initial schema

Revision ID: 0001
Revises: 
Create Date: 2026-09-03 22:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import geoalchemy2

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Extension for PostGIS
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis')

    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('role', sa.Enum('farmer', 'agronomist', 'admin', name='userrole'), nullable=False),
        sa.Column('preferences_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table('farms',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('location_name', sa.String(), nullable=True),
        sa.Column('boundary', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('fields',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('crop_type', sa.Enum('cotton', 'soybean', 'mixed', name='croptype'), nullable=False),
        sa.Column('boundary', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_fields_boundary_gist', 'fields', ['boundary'], unique=False, postgresql_using='gist')

    op.create_table('drones',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mac_address', sa.String(), nullable=False),
        sa.Column('model', sa.String(), nullable=False),
        sa.Column('firmware_version', sa.String(), nullable=True),
        sa.Column('status', sa.Enum('active', 'inactive', 'maintenance', name='dronestatus'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_drones_mac_address'), 'drones', ['mac_address'], unique=True)

    op.create_table('missions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('farm_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('drone_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('field_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=True),
        sa.Column('status', sa.Enum('scheduled', 'syncing', 'processed', 'completed', name='missionstatus'), nullable=False),
        sa.Column('coverage_area_ha', sa.Float(), nullable=False),
        sa.Column('sensors_used', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['drone_id'], ['drones.id'], ),
        sa.ForeignKeyConstraint(['farm_id'], ['farms.id'], ),
        sa.ForeignKeyConstraint(['field_id'], ['fields.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('datasets',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mission_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('type', sa.Enum('rgb', 'lidar', 'multispectral', 'ndvi', name='datasettype'), nullable=False),
        sa.Column('s3_url', sa.String(), nullable=False),
        sa.Column('file_size_bytes', sa.BigInteger(), nullable=False),
        sa.Column('checksum_sha256', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table('predictions',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('mission_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('disease_class', sa.String(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('severity', sa.Enum('mild', 'moderate', 'severe', name='severityenum'), nullable=False),
        sa.Column('affected_area_ha', sa.Float(), nullable=False),
        sa.Column('geom', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('recommended_action', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_predictions_geom_gist', 'predictions', ['geom'], unique=False, postgresql_using='gist')

    op.create_table('terrain_metrics',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('field_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('metric_type', sa.Enum('slope', 'water_risk', 'drainage', name='metrictype'), nullable=False),
        sa.Column('value', sa.Float(), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('geom', geoalchemy2.types.Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['field_id'], ['fields.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_terrain_metrics_geom_gist', 'terrain_metrics', ['geom'], unique=False, postgresql_using='gist')

    op.create_table('alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('mission_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('severity', sa.Enum('low', 'medium', 'high', 'critical', name='alertseverity'), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['mission_id'], ['missions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('alerts')
    op.drop_table('terrain_metrics')
    op.drop_table('predictions')
    op.drop_table('datasets')
    op.drop_table('missions')
    op.drop_table('drones')
    op.drop_table('fields')
    op.drop_table('farms')
    op.drop_table('users')
    sa.Enum('low', 'medium', 'high', 'critical', name='alertseverity').drop(op.get_bind())
    sa.Enum('slope', 'water_risk', 'drainage', name='metrictype').drop(op.get_bind())
    sa.Enum('mild', 'moderate', 'severe', name='severityenum').drop(op.get_bind())
    sa.Enum('rgb', 'lidar', 'multispectral', 'ndvi', name='datasettype').drop(op.get_bind())
    sa.Enum('scheduled', 'syncing', 'processed', 'completed', name='missionstatus').drop(op.get_bind())
    sa.Enum('active', 'inactive', 'maintenance', name='dronestatus').drop(op.get_bind())
    sa.Enum('cotton', 'soybean', 'mixed', name='croptype').drop(op.get_bind())
    sa.Enum('farmer', 'agronomist', 'admin', name='userrole').drop(op.get_bind())
