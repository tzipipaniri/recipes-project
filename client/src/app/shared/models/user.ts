import { Role } from "../role";

export interface User {
    _id: String;
    firstName:String;
    lastName:String;
    username: string;
    password: String;
    email:String;
    address:String;
    role:Role;
}
