import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface EventCommentAttributes {
    id: number;
    eventId: number;
    userId?: number;
    comment: string;
    isInternal: boolean;
}

interface EventCommentCreationAttributes extends Optional<EventCommentAttributes, 'id' | 'userId' | 'isInternal'> { }

export class EventComment extends Model<EventCommentAttributes, EventCommentCreationAttributes> {
    declare id: number;
    declare eventId: number;
    declare userId: number | null;
    declare comment: string;
    declare isInternal: boolean;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

EventComment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isInternal: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'event_comments',
        timestamps: true,
    }
);
