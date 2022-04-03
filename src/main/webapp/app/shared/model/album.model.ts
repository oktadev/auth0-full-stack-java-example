import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';

export interface IAlbum {
  id?: number;
  title?: string;
  description?: string | null;
  created?: string | null;
  user?: IUser | null;
}

export const defaultValue: Readonly<IAlbum> = {};
