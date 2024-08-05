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
---change fruit table
ALTER TABLE "fruit"
ADD COLUMN "imageUrl" VARCHAR(255);
----add fruit imageUrl
UPDATE "fruit"
SET "imageUrl" = 'https://i.pinimg.com/564x/d2/af/ee/d2afee77af23cee52b319b8c0d02dc12.jpg'
WHERE "id" = 4;
UPDATE "fruit"
SET "imageUrl" = 'https://i.pinimg.com/736x/a8/8e/c1/a88ec100b98b94a4f20858492e163b70.jpg'
WHERE "id" = 1;
UPDATE "fruit"
SET "imageUrl" = 'https://i.pinimg.com/originals/01/f9/0a/01f90a367906ba88e4fdfcfc7abeaa71.jpg'
WHERE "id" = 2;
UPDATE "fruit"
SET "imageUrl" = 'https://i.pinimg.com/736x/c3/21/43/c32143148efc0811535badd418920e35.jpg'
WHERE "id" = 3;

--Insert fruit data----
INSERT INTO "fruit" ("name", "current_price") VALUES
('Apple', 2.00),
('Orange', 2.00),
('Banana', 2.00),
('Grapes', 2.00);