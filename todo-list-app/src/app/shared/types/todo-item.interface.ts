import { TODO_STATUS } from "../util/constants";

export type TTodoStatus = typeof TODO_STATUS[keyof typeof TODO_STATUS];

export interface ITodoItem {
  id:number;
  text:string;
  description:string;
  status:TTodoStatus
}
