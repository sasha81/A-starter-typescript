import { describe, expect, test, vi } from "vitest";
import { UserId } from "./UuId.util";


describe('UuID', () => {


     test('Uuid.getUuid works correctly', () => {
          const uuid1 = UserId.getUserId();
          const uuid2 = UserId.getUserId();
          const uuid3 = UserId.getUserId();
          expect(uuid1).toEqual(uuid2)
          expect(uuid1).toEqual(uuid3)

     })

})