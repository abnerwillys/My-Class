-- -> Delete and Create Database if necessary
-- DROP DATABASE IF EXISTS myclass;
-- CREATE DATABASE myclass;

CREATE TABLE "students" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "birth" timestamp NOT NULL,
  "grade_school" text NOT NULL,
  "course_load" int NOT NULL,
  "teacher_id" int
);

CREATE TABLE "teachers" (
  "id" SERIAL PRIMARY KEY,
  "avatar_url" text NOT NULL,
  "name" text NOT NULL,
  "birth" timestamp NOT NULL,
  "graduation" text NOT NULL,
  "class_type" text NOT NULL,
  "expertise" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now())
);

ALTER TABLE "students" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");