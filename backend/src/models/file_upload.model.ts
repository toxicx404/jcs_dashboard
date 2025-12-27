import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface FileUploadAttributes {
    id: number;
    filename: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    uploadedBy?: number;
    eventId?: number;
    uploadType: 'event_image' | 'proof_document' | 'other';
}

interface FileUploadCreationAttributes extends Optional<FileUploadAttributes, 'id' | 'uploadedBy' | 'eventId' | 'uploadType'> { }

export class FileUpload extends Model<FileUploadAttributes, FileUploadCreationAttributes> {
    declare id: number;
    declare filename: string;
    declare originalName: string;
    declare filePath: string;
    declare fileSize: number;
    declare mimeType: string;
    declare uploadedBy: number | null;
    declare eventId: number | null;
    declare uploadType: 'event_image' | 'proof_document' | 'other';

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date; // Note: SQL only has createdAt, but Sequelize adds updatedAt by default unless disabled. existing scheme only shows createdAt. I should probably enable timestamps but maybe disable updatedAt if the table doesn't have it.
    // Wait, looking at the SQL schema for file_uploads:
    // createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    // There is NO updatedAt.
}

FileUpload.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        originalName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        filePath: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        fileSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        mimeType: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        uploadedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        eventId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        uploadType: {
            type: DataTypes.ENUM('event_image', 'proof_document', 'other'),
            defaultValue: 'other',
        },
    },
    {
        sequelize,
        tableName: 'file_uploads',
        timestamps: true,
        updatedAt: false, // Disable updatedAt as it is not in the schema
    }
);
