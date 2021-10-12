import { IPhoto } from 'app/shared/model/photo.model';

export interface ITag {
  id?: number;
  name?: string;
  photos?: IPhoto[] | null;
}

export const defaultValue: Readonly<ITag> = {};
