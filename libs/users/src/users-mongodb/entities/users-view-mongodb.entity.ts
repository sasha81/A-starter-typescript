import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { WithMongoId } from "./users-mongodb.entity";
import mongoose, { HydratedDocument } from 'mongoose';

export class Group {
    readonly groupId: string;
    readonly groupName: string;
    readonly groupStatus: boolean;
    readonly userId: string;
    readonly userStatus: boolean;

}


@Schema()
export class MongoUserView extends WithMongoId {
    @Prop({ type: String, required: true, unique: true })
    userId: string;

    @Prop()
    name: string;
    @Prop()
    age: number;

    @Prop({ type: Map, of: Object })
    groups: Map<string, Group>
}


export const UserViewSchema = SchemaFactory.createForClass(MongoUserView);
export type UserViewDocument = HydratedDocument<MongoUserView>;
