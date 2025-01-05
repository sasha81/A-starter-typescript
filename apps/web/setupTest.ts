

export function setupFetchStub(data: any) {
    return function fetchStub(_url: string) {
      return new Promise((resolve) => {
        resolve({
          json: () =>
            Promise.resolve({
              data,
            }),
        })
      })
    }
  }

 export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }