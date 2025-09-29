import { TOAST_VARIANT } from "../util/constants";

export type TToastVariant = typeof TOAST_VARIANT[keyof typeof TOAST_VARIANT];
export interface IToast {
  id:number;
  variant:TToastVariant
  message:string
}
