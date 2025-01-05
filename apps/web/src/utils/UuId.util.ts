import { v4 as uuid } from 'uuid'

export const UserId = (() => {
    const Id: { id: string | undefined } = {
        id: undefined
    }

    return {
        getUserId: () => {
            if (Id.id) return Id.id;
            else {
                Id.id = uuid()
                return Id.id;
            }
        }
    }
})()