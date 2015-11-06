BEGIN;
  CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    passwordHash text NOT NULL,
    salt text NOT NULL,
    admin boolean NOT NULL);

  CREATE TABLE drinktypes (
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL);

  CREATE TABLE ingredients (
    id serial NOT NULL PRIMARY KEY,
    name text NOT NULL,
    abv integer NOT NULL);

  CREATE TABLE drinks (
    id serial NOT NULL PRIMARY KEY,
    primaryName text NOT NULL,
    preparation text NOT NULL,
    accepted boolean NOT NULL,
    type integer NOT NULL REFERENCES drinktypes (id),
    writer integer NOT NULL REFERENCES users (id));

  CREATE TABLE drinkIngredients (
    drink integer NOT NULL REFERENCES drinks (id),
    ingredient integer NOT NULL REFERENCES ingredients (id),
    amount integer NOT NULL,
    PRIMARY KEY (drink, ingredient));

  CREATE TABLE additionalDrinkNames (
    drink integer NOT NULL REFERENCES drinks (id),
    name text NOT NULL,
    PRIMARY KEY (drink, name));
COMMIT;