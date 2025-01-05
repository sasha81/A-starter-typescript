import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export interface IMongoUser {
    readonly userId: string;

    name: string;

    age: number
}

export class WithMongoId {
    _id: Types.ObjectId
}

@Schema()
export class MongoUser extends WithMongoId implements IMongoUser {
    @Prop({ type: String, required: true, unique: true })
    userId: string;

    @Prop()
    name: string;
    @Prop()
    age: number
}


export const UserSchema = SchemaFactory.createForClass(MongoUser);
export type UserDocument = HydratedDocument<MongoUser>;
