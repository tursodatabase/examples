export interface Author {
  id?: number;
	first_name: string;
	last_name: string;
  bio?: string;
	slug: string;
	email?: string;
	socials?: Socials;
	youtube?: string;
	avatar: string;
	created_at?: number;
  posts?: Blog[];
}

export interface Blog {
  id?: number;
  title: string;
	description: string;
  slug: string;
  content?: string;
	hero: string;
  author?: Author;
  created_at: number;
  publish_date?: number;
  published?: boolean;
}

export interface Socials {
  twitter?: string;
  website?: string;
}