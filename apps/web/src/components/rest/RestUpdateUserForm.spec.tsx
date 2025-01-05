import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IGroup, IUserDtoWithGroups, userApi } from "@rest-adapter/ts-rest-contracts/user-contract";
import { initQueryClient, } from "@ts-rest/react-query";
import { getStyles } from './UserFormZod';
import { ThemeProvider } from '@mui/styles';
import theme from '../common/Theme';
import { getRestTheme } from './RestTheme';
import { replacer } from 'src/utils/test.utils';
import { UpdateUserForm } from './RestUpdateUserForm';
import { ICardUserProps } from '../common/UserCardContent';
import { IUpdateUserProps } from '../common/UserUpdateFormWithGroups';

vi.mock("@ts-rest/react-query", () => {
    const queryClient = {
        update: {
            useMutation: vi.fn()
        }
    }
    const initQueryClient = (_x: any, _y: any) => {
        return queryClient
    };
    return { initQueryClient };
})

vi.mock('../common/UserCardContent', () => ({
    UserCardContent: (props: ICardUserProps) => <div data-testid="UserCardContent">{`${JSON.stringify(props.groups)}`}</div>
}))


vi.mock('../common/UserUpdateFormWithGroups', () => ({
    UserUpdateFormWithGroups: (props: IUpdateUserProps) => <div data-testid="UserUpdateFormWithGroups">{`${JSON.stringify(props.groups)}`}</div>
}))

const getGroups = (userId: string): IGroup[] => {
    return [{ groupId: 'abc', groupName: 'GroupNameA', groupStatus: true, userId, userStatus: false }]
}

const user1: IUserDtoWithGroups = {
    //in case of a schema-first back, a _typename field is needed
    // __typename: 'User',
    age: 20,
    userId: '1',
    name: 'userAname',
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
describe('<UpdateUserForm />', () => {
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


    test('UpdateUserForm mounts properly if pended', async () => {
        const mutateMock = vi.fn()
        queryClient.update.useMutation.mockImplementation((arg1: any, arg2: any) => {
            return {
                mutate: mutateMock,
                isPending: true
            }
        })

        const wrapper = render(<ThemeProvider theme={getRestTheme(theme)}><UpdateUserForm {...user1} /></ThemeProvider>);
        expect(wrapper).toBeTruthy();

        const UserCardContent = screen.getByTestId('UserCardContent');
        expect(UserCardContent).toBeDefined()
        // Get by text using the React testing library
        const userName = screen.getByText(`${JSON.stringify(getGroups('1'))}`)

        expect(userName).toBeDefined()


    })


    test('UpdateUserForm mounts and groups are correctly transfered to a UserCard component', async () => {
        const userClick = userEvent.setup();

        const mutateMock = vi.fn()
        queryClient.update.useMutation.mockImplementation((arg1: any, arg2: any) => {
            return {
                mutate: mutateMock,
                isPending: false,
                error: undefined
            }
        })

        const wrapper = render(<ThemeProvider theme={getRestTheme(theme)}><UpdateUserForm {...user1} /></ThemeProvider>);
        expect(wrapper).toBeTruthy();
        const groupNamesOnScreen = screen.getByText(`${JSON.stringify(getGroups('1'))}`)

        expect(groupNamesOnScreen).toBeDefined()


    })


    test('no nuls or undefined in the styles', () => {
        const classes = getStyles(getRestTheme(theme));
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
    })

});