import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';
import { NoteAttributes } from '../types/note.types';

type NoteCreationAttributes = Optional<NoteAttributes, 'id' | 'position' | 'createdAt' | 'updatedAt'>;

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    public id!: number;
    public title!: string;
    public content!: string;
    public position!: number | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Note.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        sequelize,
        tableName: 'notes',
        timestamps: true,
    }
);


export default Note;