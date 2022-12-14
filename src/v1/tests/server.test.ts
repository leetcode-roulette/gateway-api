import { app } from "../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { IProblem, ITag, Problems, ProblemTags, Tags } from "../models";
import { ProblemData } from "../services";
import { TagData } from "../services/interfaces";

beforeEach((done) => {
	mongoose.connect("mongodb://localhost:27017/JestDBV1", {}, () => done());
});

afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => done());
	});
});

test("GET /v1/problems", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await supertest(app)
		.get("/v1/problems")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toEqual(1);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems sort query string", async () => {
	await Problems.create({
		problemID: 2,
		problemFrontendID: 2,
		title: "First problem created",
		titleSlug: "first_problem_created",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Second problem created",
		titleSlug: "second_problem_created",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await supertest(app)
		.get("/v1/problems?sort=problemId")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toBe(2);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems premium query string", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
		isPremium: false,
	});

	await Problems.create({
		problemID: 2,
		problemFrontendID: 2,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 2,
		numAccepted: 1,
		numSubmitted: 1,
		isPremium: true,
	});

	await supertest(app)
		.get("/v1/problems?premium=false")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toBe(1);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems search query string", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "First problem",
		titleSlug: "first_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await Problems.create({
		problemID: 2,
		problemFrontendID: 2,
		title: "Second problem",
		titleSlug: "second_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await supertest(app)
		.get("/v1/problems?q=First")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toBe(1);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems difficulty query string", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await Problems.create({
		problemID: 2,
		problemFrontendID: 2,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 2,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await supertest(app)
		.get("/v1/problems?difficulty=1")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toBe(1);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems tags query string", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await Problems.create({
		problemID: 2,
		problemFrontendID: 2,
		title: "Test problem 2",
		titleSlug: "test_problem_2",
		difficulty: 3,
		numAccepted: 0,
		numSubmitted: 0,
	});

	await ProblemTags.create({
		tagSlug: "heap",
		problemID: 1,
	});

	await supertest(app)
		.get("/v1/problems?tags=heap")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeTruthy();
			expect(response.body.questions.length).toBe(1);

			const question: ProblemData = response.body.questions[0];
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});
});

test("GET /v1/problems/:problemId", async () => {
	const problem: IProblem = await Problems.create({
		problemID: 1,
		problemFrontendID: 1,
		title: "Test problem",
		titleSlug: "test_problem",
		difficulty: 1,
		numAccepted: 1,
		numSubmitted: 1,
	});

	await supertest(app)
		.get("/v1/problems/1")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.questions)).toBeFalsy();

			const question: ProblemData = response.body.question;
			expect(question.difficulty).toBe(problem.difficulty);
			expect(question.id).toBe(problem.problemID);
			expect(question.title).toBe(problem.title);
			expect(question.title_slug).toBe(problem.titleSlug);
			expect(question.is_premium).toBe(problem.isPremium);
		});

	await supertest(app).get("/v1/problems/2").expect(404);
});

test("GET /v1/tags", async () => {
	const tag: ITag = await Tags.create({
		name: "Heap",
		tagSlug: "heap",
	});

	await supertest(app)
		.get("/v1/tags")
		.expect(200)
		.then((response) => {
			expect(Array.isArray(response.body.tags)).toBeTruthy();
			expect(response.body.tags.length).toEqual(1);

			const t: TagData = response.body.tags[0];
			expect(t.name).toBe(tag.name);
			expect(t.tag_slug).toBe(tag.tagSlug);
		});
});
