import { afterEach, describe, expect, it, vi } from "vitest";
import { IGroupListProps } from "./GroupList";
import { IGroup, IUserDtoWithGroups } from "@rest-adapter/ts-rest-contracts/user-contract";
import { getGqlTheme } from "../graphql/GqlTheme";
import { ThemeProvider } from '@mui/styles';
import { ICardUserProps, UserCardContent, getStyles } from "./UserCardContent";
import { render, waitFor, screen } from "@testing-library/react";
import { SelectChangeEvent } from "@mui/material";
import theme from "./Theme";
import { replacer } from "src/utils/test.utils";


vi.mock('../common/GroupList', () => ({
    GroupList: (props:IGroupListProps) => <div data-testid="GroupListContent">{`${JSON.stringify(props.groups)}`}</div>
}))

const getGroups=(userId:string):IGroup[]=>{
    return [{groupId:'abc',groupName:'A',groupStatus:true,userId, userStatus:false}]
    };

    const user1: IUserDtoWithGroups = {
        //in case of a schema-first back, a _typename field is needed
        // __typename: 'User',
        age: 20,
        userId: '1',
        name: 'userAname',
        groups: getGroups('1')
    }

    const props:ICardUserProps={
        setUpdateActive: function (arg: boolean): void {
           
        },
        setOpenError: function (arg: boolean): void {
            
        },
        openError: false,
        errorMsg: "",
        isPending: false,       
        group: "",
        onGroupChange: function (event: SelectChangeEvent): void {},       
        ...user1
    }
describe('<UserCardContent/>',()=>{
   
    it('should mount correctly',()=>{
        const wrapper = render(
            <ThemeProvider theme={theme} ><UserCardContent {...props}  /></ThemeProvider>
                  );
          expect(wrapper).toBeTruthy();
       
    });
    it('should render user name, age, and provide props to a <GroupList/>',async ()=>{
        const wrapper = render(
            <ThemeProvider theme={theme} ><UserCardContent {...props}  /></ThemeProvider>
                  );
          expect(wrapper).toBeTruthy();
          await waitFor( ()=>{
            const users = screen.getAllByTestId("GroupListContent")
            expect(users.length).toEqual(1)
           expect(users[0].textContent).toEqual(`${JSON.stringify(user1.groups)}`)
            expect(screen.getByText(user1.name)).toBeDefined()
          })
    });
    it('getStyles does not produce null or undefined values', () => {
        const classes = getStyles(theme);
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
      })
})