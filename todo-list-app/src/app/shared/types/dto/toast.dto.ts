import { TToastVariant } from '../toast.interface';

export interface AddToastDto {
  variant: TToastVariant;
  message: string;
}
