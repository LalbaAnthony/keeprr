export interface NoteAttributes {
    id: number;
    title: string;
    content: string;
    position: number | null;
    createdAt?: Date;
    updatedAt?: Date;
}