import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface PartnershipAttributes {
    id: number;
    organizationName: string;
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    linkedin: string;
    partnershipType: 'Sponsorship' | 'Event' | 'Workshop' | 'Other';
    message: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

interface PartnershipCreationAttributes extends Optional<PartnershipAttributes, 'id' | 'website' | 'linkedin' | 'status'> { }

export class Partnership extends Model<PartnershipAttributes, PartnershipCreationAttributes> {
    declare id: number;
    declare organizationName: string;
    declare contactPerson: string;
    declare email: string;
    declare phone: string;
    declare website: string;
    declare linkedin: string;
    declare partnershipType: 'Sponsorship' | 'Event' | 'Workshop' | 'Other';
    declare message: string;
    declare status: 'Pending' | 'Approved' | 'Rejected';

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Partnership.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        organizationName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contactPerson: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        website: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        linkedin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        partnershipType: {
            type: DataTypes.ENUM('Sponsorship', 'Event', 'Workshop', 'Other'),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            defaultValue: 'Pending',
        },
    },
    {
        sequelize,
        tableName: 'partnerships',
    }
);

export default Partnership;
