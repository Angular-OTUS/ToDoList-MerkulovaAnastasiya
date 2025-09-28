export type TToastVariant = 'success' | 'error'

export interface IToast {
  id:number;
  variant:TToastVariant
  message:string
}
