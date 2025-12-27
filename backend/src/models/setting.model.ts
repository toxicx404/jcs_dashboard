import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface SettingAttributes {
    id: number;
    keyName: string;
    value?: string;
    type: 'string' | 'number' | 'boolean' | 'json';
    description?: string;
    updatedBy?: number;
}

interface SettingCreationAttributes extends Optional<SettingAttributes, 'id' | 'value' | 'type' | 'description' | 'updatedBy'> { }

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> {
    declare id: number;
    declare keyName: string;
    declare value: string | null;
    declare type: 'string' | 'number' | 'boolean' | 'json';
    declare description: string | null;
    declare updatedBy: number | null;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Setting.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        keyName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
            defaultValue: 'string',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        updatedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'settings',
        timestamps: true,
    }
);
