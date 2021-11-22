export interface TagInfo {
  id?: number;
  creator?: {
    nickname: string;
    uid: string;
  };
  name: string;
  sortOrder: number;
}

export interface TagList {
  data: TagInfo[];
  meta: {
    offset: number;
    length: number;
    quantity: number;
  };
}
