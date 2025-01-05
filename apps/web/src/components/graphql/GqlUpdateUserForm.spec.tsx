import { describe, test, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IGroup, IUserDtoWithGroups } from "@rest-adapter/ts-rest-contracts/user-contract";
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';
import { replacer } from 'src/utils/test.utils';
import { ICardUserProps } from '../common/UserCardContent';
import { IUpdateUserProps } from '../common/UserUpdateFormWithGroups';
import { UPDATE_USER, UpdateUserForm, getStyles } from './GqlUpdateUserForm';
import { getGqlTheme } from './GqlTheme';
import { MockedProvider } from '@apollo/client/testing';


vi.mock('../common/UserCardContent', () => ({
  UserCardContent: (props: ICardUserProps) => <div data-testid="UserCardContent">{`${JSON.stringify(props.groups)}`}</div>
}))


vi.mock('../common/UserUpdateFormWithGroups', () => ({
  UserUpdateFormWithGroups: (props: IUpdateUserProps) => <div data-testid="UserUpdateFormWithGroups">{`${JSON.stringify(props.groups)}`}</div>
}))

const getGroups = (userId: string): IGroup[] => {
  return [{ groupId: 'abc', groupName: 'GroupNameA', groupStatus: true, userId, userStatus: false }]
}
const user1 = {
  age: 20,
  userId: '1',
  name: 'userAname',
}
const user1WithGr: IUserDtoWithGroups = {
  //in case of a schema-first back, a _typename field is needed
  // __typename: 'User',
  ...user1,
  groups: getGroups('1')
}
const user2: IUserDtoWithGroups = {
  //in case of a schema-first back, a _typename field is needed
  //  __typename: 'User',
  age: 23,
  userId: '2',
  name: 'userBname',
  groups: getGroups('2')
}
describe('<UpdateUserGqlForm />', () => {

  const dataMock = { updateUser: { ...user1 } }

  const mocks = [
    {
      request: {
        query: UPDATE_USER,
        variables: { input: user1 }
      },
      result: {
        data: dataMock

      }
    }

  ];

  afterEach(() => {
    vi.clearAllMocks();
  });


  test('UpdateUserForm mounts properly if pended', async () => {


    const wrapper = render(
      <MockedProvider mocks={mocks}>
        <ThemeProvider theme={getGqlTheme(theme)}><UpdateUserForm {...user1WithGr} /></ThemeProvider>
      </MockedProvider>
    );
    expect(wrapper).toBeTruthy();

    const UserCardContent = screen.getByTestId('UserCardContent');
    expect(UserCardContent).toBeDefined()
    // Get by text using the React testing library
    const userName = screen.getByText(`${JSON.stringify(getGroups('1'))}`)

    expect(userName).toBeDefined()


  })


  test('UpdateUserForm mounts and groups are correctly transfered to a UserCard component', async () => {



    const wrapper = render(<MockedProvider mocks={mocks}>
      <ThemeProvider theme={getGqlTheme(theme)}><UpdateUserForm {...user1WithGr} /></ThemeProvider>
    </MockedProvider>);
    expect(wrapper).toBeTruthy();
    const groupNamesOnScreen = screen.getByText(`${JSON.stringify(getGroups('1'))}`)

    expect(groupNamesOnScreen).toBeDefined()


  })


  test('no nuls or undefined in the styles', () => {
    const classes = getStyles(getGqlTheme(theme));
    expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
    expect(JSON.stringify(classes, replacer)).not.toContain('null')
  })

});