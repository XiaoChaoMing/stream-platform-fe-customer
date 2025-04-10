export interface IChannel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const DefaultChannel: IChannel = {
  id: "",
  name: "",
  avatar: "",
  description: "",
  category: "",
  tags: [],
  createdAt: "",
  updatedAt: ""
};
