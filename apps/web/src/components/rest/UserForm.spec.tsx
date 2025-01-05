import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IUserDto, userApi } from "@rest-adapter/ts-rest-contracts/user-contract";
import { initQueryClient, } from "@ts-rest/react-query";
import { act } from "react";
import { UserForm, textView } from './UserForm';


vi.mock("@ts-rest/react-query", () => {
  const queryClient = {
    create: {
      useMutation: vi.fn()
    }
  }
  const initQueryClient = (_x: any, _y: any) => {
    return queryClient
  };
  return { initQueryClient };
})

const user1: IUserDto = {
  name: 'User_A',
  age: 4321
};
const user2: IUserDto = {
  name: 'User_B',
  age: 6543
};
describe('<UserForm />', () => {
  let queryClient: any;

  beforeEach(() => {
    //@ts-ignore
    // vi.spyOn(global, "fetch").mockImplementation(setupFetchStub(workSpaceResponse))
    queryClient = initQueryClient(userApi, {
      baseUrl: import.meta.env.VITE_USER_URL,
      baseHeaders: {},
    })

  });
  afterEach(() => {
    vi.clearAllMocks();
  });


  test('UserForm mounts properly if pended', async () => {
    const mutateMock = vi.fn()
    queryClient.create.useMutation.mockImplementation((arg1: any, arg2: any) => {
      return {
        mutate: mutateMock,
        isPending: true
      }
    })

    const wrapper = render(<UserForm />);
    expect(wrapper).toBeTruthy();
    const procName = screen.getByText(textView.processing)

    expect(procName.textContent).toEqual(textView.processing)


  })

  test('UserForm mounts properly and ready to enter new User', async () => {
    const mutateMock = vi.fn()
    queryClient.create.useMutation.mockImplementation((arg1: any, arg2: any) => {
      return {
        mutate: mutateMock,
        isPending: false
      }
    })

    const wrapper = render(<UserForm />);
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library
    const enterNewUser = screen.getByText(textView.enterNewUser)
    expect(enterNewUser.textContent).toEqual(textView.enterNewUser)



  })
  test('UserForm mounts and calls the mutation when a new User is entered', async () => {
    const userClick = userEvent.setup();

    const mutateMock = vi.fn()
    queryClient.create.useMutation.mockImplementation((arg1: any, arg2: any) => {
      return {
        mutate: mutateMock,
        isPending: false,
        error: undefined
      }
    })

    const wrapper = render(<UserForm />);
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library
    const enterNewUser = screen.getByText(textView.enterNewUser)
    expect(enterNewUser.textContent).toEqual(textView.enterNewUser)
    await act(async () => {
      await userClick.type(screen.getByPlaceholderText(textView.namePlaceholder), user1.name)
      await userClick.clear(screen.getByPlaceholderText(textView.agePlaceholder))
      await userClick.type(screen.getByPlaceholderText(textView.agePlaceholder), String(user1.age))
      await userClick.click(screen.getByRole('button'))
    })
    expect(mutateMock).toBeCalledWith({ body: user1 })
  })
  test('UserForm mounts renders a error message if a mutation failed with an error', async () => {
    const userClick = userEvent.setup();
    const errBody = 'User name violates rules'
    const mutateMock = vi.fn()
    queryClient.create.useMutation.mockImplementation((arg1: any, arg2: any) => {
      return {
        mutate: mutateMock,
        isPending: false,
        error: {
          body: errBody
        }
      }
    })

    const wrapper = render(<UserForm />);
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library     
    await waitFor(() => {
      expect(screen.queryAllByText(errBody).length).toEqual(1)
    })
  })
  test('UserForm mounts renders a success message if a mutation succeds', async () => {
    const userClick = userEvent.setup();
    const errBody = 'User name violates rules'
    const mutateMock = vi.fn()
    queryClient.create.useMutation.mockImplementation((arg1: any, arg2: any) => {
      return {
        mutate: mutateMock,
        isPending: false,
        error: undefined,
        data: {
          body: user1
        }
      }
    })

    const wrapper = render(<UserForm />);
    expect(wrapper).toBeTruthy();

    // Get by text using the React testing library     
    await waitFor(() => {
      expect(screen.queryAllByText(textView.mutationSuccess).length).toEqual(1)
    })
  })

});
