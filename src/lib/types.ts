export interface Question {
	id: string;
	question: string;
	createdAt: number;
	expireDate: number;
	choices: Choice[];
}

export interface Choice {
	id: string;
	choice: string;
	questionId: string;
	question?: Question;
	votes?: Vote[];
}

export interface Vote {
	id: string;
	choiceId: string;
	country: string;
	voterId?: string;
	createdAt: number;
}
