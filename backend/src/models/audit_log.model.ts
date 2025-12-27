import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface AuditLogAttributes {
    id: number;
    userId?: number;
    action: string;
    entityType: string;
    entityId: number;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'userId' | 'oldValues' | 'newValues' | 'ipAddress' | 'userAgent'> { }

export class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> {
    declare id: number;
    declare userId: number | null;
    declare action: string;
    declare entityType: string;
    declare entityId: number;
    declare oldValues: any | null;
    declare newValues: any | null;
    declare ipAddress: string | null;
    declare userAgent: string | null;

    declare readonly createdAt: Date;
}

AuditLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        action: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        entityType: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        entityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        oldValues: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        newValues: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'audit_logs',
        timestamps: true,
        updatedAt: false,
    }
);
