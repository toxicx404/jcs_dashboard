import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

interface EventAttributes {
  id: number;
  title: string;
  departmentId: number;
  departmentName: string;
  date: string;
  type: string;
  description: string;
  participants: number;
  sdgs: string[];
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  credits: number;
  imageUrl?: string;
  reportUrl?: string;
  submissionDate: string;
  feedback?: string;
  actionsTaken?: string;
  proofLink?: string;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'status' | 'credits' | 'feedback' | 'actionsTaken' | 'proofLink' | 'imageUrl' | 'reportUrl'> { }

export class Event extends Model<EventAttributes, EventCreationAttributes> {
  declare id: number;
  declare title: string;
  declare departmentId: number;
  declare departmentName: string;
  declare date: string;
  declare type: string;
  declare description: string;
  declare participants: number;
  declare sdgs: string[];
  declare status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  declare credits: number;
  declare imageUrl: string | null;
  declare reportUrl: string | null;
  declare submissionDate: string;
  declare feedback: string | null;
  declare actionsTaken: string | null;
  declare proofLink: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    participants: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sdgs: {
      type: DataTypes.JSON, // Use JSON for arrays in MySQL
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'),
      defaultValue: 'Approved',
    },
    credits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reportUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    submissionDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    actionsTaken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    proofLink: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    tableName: 'events',
  }
);