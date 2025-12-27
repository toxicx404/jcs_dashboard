import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface NotificationAttributes {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    isRead: boolean;
    link?: string;
    readAt?: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'type' | 'isRead' | 'link' | 'readAt'> { }

export class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> {
    declare id: number;
    declare userId: number;
    declare title: string;
    declare message: string;
    declare type: 'info' | 'success' | 'warning' | 'error';
    declare isRead: boolean;
    declare link: string | null;
    declare readAt: Date | null;

    declare readonly createdAt: Date;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
            defaultValue: 'info',
        },
        isRead: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        link: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        readAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'notifications',
        timestamps: true,
        updatedAt: false,
    }
);
