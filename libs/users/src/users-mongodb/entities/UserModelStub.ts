
//Needed to test CQRS functionality!  

export const getUserModelStub = (saveData: any, updateData?: any, findData?: any): any => {
  return class UserModelStub {

    constructor(private data: any) {

    }
    save = jest.fn().mockResolvedValue({ ...saveData, ...this.data });
    create = jest.fn().mockResolvedValue({ ...saveData, ...this.data });
    static findOne = jest.fn().mockResolvedValue([findData ? findData : saveData]);
    static find = jest.fn().mockImplementation((arg: any) => ({
      limit: (argIn: number) => ([findData ? findData : saveData])
    })
    );
    static findOneAndUpdate = jest.fn().mockResolvedValue(updateData);
    static deleteOne = jest.fn().mockResolvedValue(true);
  }
}  