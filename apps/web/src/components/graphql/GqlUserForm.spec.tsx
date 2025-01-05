import { describe, test, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react";
import { GqlUserForm, textView, CREATE_USER, getSuccessMessage } from './GqlUserForm';
import { GraphQLError } from 'graphql';
import { CreateUserInput } from '@graphql-adapter/graphql-types/graphql-types';


const user1: CreateUserInput = {
  name: 'User_A',
  age: 4321
};
const user2: CreateUserInput = {
  name: 'User_B',
  age: 6543
};
describe('<GqlUserForm />', () => {



  test('GqlUserForm mounts correctly and renders a success message if there is no error', async () => {
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
        <GqlUserForm />
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

  test('GqlUserForm mounts correctly and renders a error message if there is a network error', async () => {

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
        <GqlUserForm />
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
  test('GqlUserForm mounts correctly and renders a error message if there is a gql error', async () => {

    const errMsg1 = "Gql Error msg 1";
    const errMsg2 = "Gql Error msg 2";
    //  const err = {message:errMsg, name:'Error'}    
    const err1 = new GraphQLError(errMsg1)
    const err2 = new GraphQLError(errMsg2)
    const results: any = {
      errors: [err1, err2]
    };



    const userClick = userEvent.setup();
    const mocks = [
      {
        request: {
          query: CREATE_USER,
          variables: { input: user1 }
        },
        result: results
      }

    ];

    const wrapper = render(
      <MockedProvider mocks={mocks}>
        <GqlUserForm />
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
      expect(screen.queryAllByText(errMsg1 + ' ' + errMsg2).length).toEqual(1)

    })

  })

});

