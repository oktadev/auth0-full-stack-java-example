import dayjs from 'dayjs';
import { IAlbum } from 'app/shared/model/album.model';
import { ITag } from 'app/shared/model/tag.model';

export interface IPhoto {
  id?: number;
  title?: string;
  description?: string | null;
  imageContentType?: string;
  image?: string;
  height?: number | null;
  width?: number | null;
  taken?: string | null;
  uploaded?: string | null;
  album?: IAlbum | null;
  tags?: ITag[] | null;
}

export const defaultValue: Readonly<IPhoto> = {};
