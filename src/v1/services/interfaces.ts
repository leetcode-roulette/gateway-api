export interface ResponseJson {
  message: string;
  tags?: TagData[];
  question?: ProblemData;
  questions?: ProblemData[];
  paging?: PagingData;
};

export interface TagData {
  id: number;
  name: string;
  name_slug: string;
  number_of_problems: number;
};

export interface ProblemData {
  title: string;
  title_slug: string;
  id: number;
  difficulty: number;
  is_premium: boolean;
  num_submitted: number;
  num_accepted: number;
};

export interface PagingData {
  total: number;
  page: number;
  pages: number;
};

export interface Query {
  limit: string;
  offset: string;
  difficulty: string;
  premium: string;
  q: string;
  sort: string;
  tags: string;
};

export interface Params {
  problemId: string
};

export interface MongooseQuery {
  difficulty?: Difficulty;
  isPremium?: boolean;
  title?: Search;
  problemId?: ProblemId;
};

interface Difficulty {
  "$in": number[];
};

interface Search {
  "$regex": string;
  "$options": string;
};

interface ProblemId {
  "$in": number[];
};
