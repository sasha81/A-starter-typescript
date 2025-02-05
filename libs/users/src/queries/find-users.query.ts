import { DEFAULT_QUERY_LIMIT } from "../config/default-consts";
export class FindAllUsersQuery {
    lim: number;
    constructor(lim?:number){
        this.lim = lim !==undefined ? lim : DEFAULT_QUERY_LIMIT;
    }
}