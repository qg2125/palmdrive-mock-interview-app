import {
  pgTable,
  text,
  timestamp,
  serial,
  integer,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

// 大学表
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("university_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 项目/专业表
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  universityId: integer("university_id").references(() => universities.id),
  programUId: varchar("program_unique_id").notNull(),
  name: text("program_name").notNull(),
  degreeType: text("degree_type"),
  imageUrl: text("image_url"),
  interviewInstructions: text("interview_instructions"),
  // 问题选择相关字段
  useAllQuestions: boolean("use_all_questions").notNull().default(true),
  numberOfQuestions: integer("number_of_questions"),
  // 新增计时模式字段
  useGlobalTiming: boolean("use_global_timing").notNull().default(false),
  // 全局计时的时间设置（当useGlobalTiming为true时使用）
  globalPreparationSeconds: integer("global_preparation_seconds"),
  globalRecordingSeconds: integer("global_recording_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 面试题目表
export const interviewQuestions = pgTable("interview_questions", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").references(() => programs.id),
  questionText: text("question_text").notNull(),
  // 这些时间字段仅在program的useGlobalTiming为false时使用
  preparationTimeSeconds: integer("preparation_time_seconds"),
  recordingTimeSeconds: integer("recording_time_seconds"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAnswers = pgTable("user_answers", {
  id: serial("id").primaryKey(),
  programUniqueId: varchar("program_unique_id", { length: 255 }).notNull(),
  question: text("question").notNull(),
  userAns: text("user_ans").notNull(),
  feedback: text("feedback"),
  improvedAnswer: text("improved_answer"),
  userEmail: varchar("user_email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
