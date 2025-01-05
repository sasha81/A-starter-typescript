import { describe, test, expect,} from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react";
import { CreateUserInput } from '@graphql-adapter/graphql-types/graphql-types';
import { errorMessages } from '@graphql-adapter-code/zod-schema/user-zod.schema';
import { GqlUserFormZod, textView, CREATE_USER, getSuccessMessage, getStyles } from './GqlUserFormZod';
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';
import { getGqlTheme } from './GqlTheme'
import { replacer } from 'src/utils/test.utils';

const user1: CreateUserInput = {
  name: 'User_A',
  age: 4321
};
const user2: CreateUserInput = {
  name: 'User_B',
  age: 6543
};

describe('<GqlUserFormZod />', () => {
  test('GqlUserFormZod mounts correctly and renders a success message if there is no error', async () => {
    const id = '1'
    const dataMock = { createUser: { id } }
    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: { input: user1 }
        },
        result: {
          data: dataMock

        }
      }

    ];

    const wrapper = render(
      <MockedProvider mocks={mocks}>
        <ThemeProvider theme={getGqlTheme(theme)}><GqlUserFormZod /></ThemeProvider>
      </MockedProvider>
    );
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
    await waitFor(() => {
      expect(screen.queryAllByText(getSuccessMessage(textView.mutationSuccess, dataMock)).length).toEqual(1)
    })

  })

  test('GqlUserFormZod mounts correctly and renders a error message if there is a network error', async () => {

    const errMsg = "A network error"
    //  const err = {message:errMsg, name:'Error'}    
    const err = new Error(errMsg)
    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: { input: user1 }
        },
        error: err
      }

    ];

    const wrapper = render(
      <MockedProvider mocks={mocks}>
        <ThemeProvider theme={getGqlTheme(theme)}><GqlUserFormZod /></ThemeProvider>
      </MockedProvider>
    );
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
    await waitFor(() => {
      expect(screen.queryAllByText(errMsg).length).toEqual(1)
    })

  })
  test('GqlUserFormZod mounts correctly and doesnt call its mutation if there is a zod verification error', async () => {
    let createMutationCalled = false;
    const id = '1'
    const results: any = { createUser: { id } }

    user1.name = "!"; user1.age = 1;

    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: { input: user1 }
        },
        result: () => {
          createMutationCalled = true;
          return { data: results }
        }
      }

    ];

    const wrapper = render(
      <MockedProvider mocks={mocks}>
        <ThemeProvider theme={getGqlTheme(theme)}><GqlUserFormZod /></ThemeProvider>
      </MockedProvider>
    );
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
    await waitFor(() => {
      expect(createMutationCalled).toBeFalsy()
      expect(screen.queryAllByText(errorMessages.name).length).toEqual(1)
      expect(screen.queryAllByText(errorMessages.age).length).toEqual(1)

    })
  })
  test('no nuls or undefined in the styles',()=>{
    const classes = getStyles(getGqlTheme(theme));
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })

});
