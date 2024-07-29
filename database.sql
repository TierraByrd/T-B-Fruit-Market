-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
---User Table---
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "total_cash" DECIMAL(10, 2) DEFAULT 100.00 
);

---Fruit Table---
CREATE TABLE "fruit" (
	"id" SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
    "current_price" DECIMAL(10, 2) NOT NULL
);

---Purchased Fruit Table ---
CREATE TABLE "purchased_fruit" (
	"id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "fruit_id" INTEGER NOT NULL,
    "purchased_price" DECIMAL(10, 2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE,
    FOREIGN KEY ("fruit_id") REFERENCES "fruit"("id") ON DELETE CASCADE
);