import { Types } from "mongoose";
import { UserAggregate } from "./user.aggregate";
import { convertMongoUserToUserAggregate, convertUserAggregateToMongoUser } from "./entity-to-aggregate-converter";



describe('MongoUser And UserAggregate converter', () => {
    const id = 1, name = 'A', age = 12, mongoId = new Types.ObjectId(id), userId = 'abcd';
    const user = { userId, name, age }
    const mongoUser = { _id: mongoId, ...user }
    const userAggregate = new UserAggregate(userId, name, age);

    test('convertMongoUserToUserAggregate', () => {

        expect(convertMongoUserToUserAggregate(mongoUser)).toEqual(userAggregate)
    });

    test('convertUserAggregateToMongoUser', () => {
        expect(convertUserAggregateToMongoUser(userAggregate)).toEqual(user)
    });
})