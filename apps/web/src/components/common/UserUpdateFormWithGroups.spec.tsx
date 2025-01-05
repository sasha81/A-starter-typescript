import { afterEach, describe, expect, it, vi } from "vitest";
import { IGroupListProps } from "./GroupList";
import { IGroup, IUserDtoWithGroups } from "@rest-adapter/ts-rest-contracts/user-contract";
import { getGqlTheme } from "../graphql/GqlTheme";
import { ThemeProvider } from '@mui/styles';
import { ICardUserProps, UserCardContent } from "./UserCardContent";
import { render, waitFor, screen } from "@testing-library/react";
import { SelectChangeEvent } from "@mui/material";
import { IUpdateUserProps, UserUpdateFormWithGroups, getStyles } from "./UserUpdateFormWithGroups";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";
import { ChangeEvent } from "react";
import { act } from "react";
import userEvent from '@testing-library/user-event'
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

    const props:IUpdateUserProps={
        handleSubmit: function (arg: any): void {
           
        },
        register: function <TFieldName extends string = string>(name: TFieldName, options?: RegisterOptions<any, TFieldName> | undefined): any {
            if(name==='name') return {
                    defaultValue:user1.name,
                    placeholder:user1.name
                 }
            else return {
                defaultValue:user1.age,
                placeholder:user1.age.toString()
                 }
        },
        errors: {name:false},
        group: "",
       
        onGroupChange: function (event: SelectChangeEvent): void {
           
        },
        ...user1
    }

const getProps=(onChange: (arg:ChangeEvent)=>void, handleSubmit:(args:any)=>void):IUpdateUserProps=>(
    {
        handleSubmit,
        register: function <TFieldName extends string = string>(name: TFieldName, options?: RegisterOptions<any, TFieldName> | undefined): any {
            if(name==='name') return {
                    defaultValue:user1.name,
                    placeholder:user1.name,
                    onChange
                 }
            else return {
                defaultValue:user1.age,
                placeholder:user1.age.toString(),
                onChange
                 }
        },
        errors: {name:false},
        group: "",
      
        onGroupChange: function (event: SelectChangeEvent): void {
           
        },
        ...user1
    }

)

describe('<UserUpdateFormWithGroups/>',()=>{
   
    it('should mount correctly',()=>{
        const wrapper = render(
            <ThemeProvider theme={theme} ><UserUpdateFormWithGroups {...props}  /></ThemeProvider>
                  );
          expect(wrapper).toBeTruthy();
       
    });
    it('should render user name, age, and sprovide props to a <GroupList/>',async ()=>{
        const wrapper = render(
            <ThemeProvider theme={theme} ><UserUpdateFormWithGroups {...props}  /></ThemeProvider>
                  );
          expect(wrapper).toBeTruthy();
          await waitFor( ()=>{
            const users = screen.getAllByTestId("GroupListContent")
            expect(users.length).toEqual(1)
           expect(users[0].textContent).toEqual(`${JSON.stringify(user1.groups)}`)
            expect(screen.getByPlaceholderText(user1.name)).toBeDefined()
          })
       
    });
    it('should render call onChange newName.legth times + String(newAge).length + 2 (cleans) when name text is entered',async ()=>{
        const userClick = userEvent.setup();
        const newName='Aaaaa',newAge=99
        const mockChange = vi.fn().mockImplementation((e) => e.preventDefault()), mockHandle = vi.fn().mockImplementation((e) => e.preventDefault())
        const wrapper = render(
            <ThemeProvider theme={theme} > <UserUpdateFormWithGroups {...getProps(mockChange, mockHandle)}  /></ThemeProvider>
                  );
          expect(wrapper).toBeTruthy();
          await act(async () => {
            await userClick.clear(screen.getByPlaceholderText(user1.name))
            await userClick.type(screen.getByPlaceholderText(user1.name), newName);
            await userClick.clear(screen.getByPlaceholderText(user1.age))
            await userClick.type(screen.getByPlaceholderText(user1.age), String(newAge))         
            await userClick.click(screen.getByRole('button'))
          })
          expect(mockChange.mock.calls.length).toEqual(newName.length+1+String(newAge).length +1)         
          expect(mockHandle).toBeCalled()
       
    });
    it('getStyles does not produce null or undefined values', () => {
        const classes = getStyles(theme);
        expect(JSON.stringify(classes, replacer)).not.toContain('undefined')
        expect(JSON.stringify(classes, replacer)).not.toContain('null')
      })
})