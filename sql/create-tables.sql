BEGIN;
  CREATE TABLE users (
    id serial NOT NULL PRIMARY KEY,
    email text NOT NULL UNIQUE,
    passwordHash text NOT NULL,
    salt text NOT NULL,
    admin boolean NOT NULL DEFAULT 'false',
    active boolean NOT NULL DEFAULT 'true');

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
    drink integer NOT NULL REFERENCES drinks (id) ON DELETE CASCADE,
    ingredient integer NOT NULL REFERENCES ingredients (id),
    amount integer NOT NULL,
    PRIMARY KEY (drink, ingredient));

  CREATE TABLE additionalDrinkNames (
    drink integer NOT NULL REFERENCES drinks (id) ON DELETE CASCADE,
    name text NOT NULL,
    PRIMARY KEY (drink, name));

  CREATE TABLE session (
    sid varchar NOT NULL COLLATE "default",
    sess json NOT NULL,
    expire timestamp(6) NOT NULL,
    PRIMARY KEY (sid)
  ) WITH (OIDS=FALSE);
COMMIT;
