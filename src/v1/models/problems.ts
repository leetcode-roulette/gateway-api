import mongoose, { Model, Schema } from "mongoose";
import { IProblem } from "./";

const problemsSchema : Schema<IProblem> = new mongoose.Schema({
  problemId: 'number',
  title: 'string',
  titleSlug: 'string',
  isPremium: 'boolean',
  difficulty: 'number',
  frontEndId: 'number'
});

const Problems : Model<IProblem> = mongoose.model('problems', problemsSchema);

export {
  Problems
};