BEGIN;
  INSERT INTO users (email, passwordHash, salt, admin, active) VALUES ('admin@example.com', '8fab6a51b863a32e816b1a4962da89fabd6cc01a2dacf28541e96c4b00b0f06f97a1c72a719907bd6b2046bf12fd144510b9dafc84ff0e4a4fd560efdd73a7a4bf6e745d6fe98c1d33559707e3d81b13f4a46b0c3802698bfa4b9f2e39e053d484350f07fccc8f76a6a8f8a1669059dbb9cae8155b340dc0e2fd848d6625e235b083825def575b125507d83840dce8c23689f4ead1e2e69fd85469e950c069539b45768e9bd053736db028c1050cd6960521a68806e6230fd8aa9730c8892f1d67bfe03b1fe87e7b7d4a1c94c5371a1d427861dd43b4478337eec4937035fe31c14feebd187b4a7759fcc4f8a40c91687fe6a5be565e46a16117db5aa692411d35d9249f77b062f4f924000f5ce00410be421b49638fb55d3c3098241677851f7b6ce6b8f81174c3ed9efd42071bb4251e0fdc442a88f61c8e744b5a4f9b5c03bec2a8d4bd9cf0ab4dade02b7037aadd1b98a68bd81bc8fd639b69e228ece97a0aacf6d9727565cc50bc9299e53318ba12945cb68c5e065fc6703194bc0462b9d27097ea01d839abab0219f047729307ac2bb7cfe782185c614399ce0a13a8a92d99bfeef8c2b778a76eb484e7f903725706a8ca192f4e2057fb2ae01b337fec0452b2f79200a2c06aa9f494fbd4b6a2255f42b3e8ecbffc5735ccfd061fa353a2983e84e4d5dfc3a5808dca32296e085cef01fb6624166f6f3164db6a4a5dc7', 'salt', 'true', 'true');
  INSERT INTO users (email, passwordHash, salt, admin, active) VALUES ('user@example.com', '8fab6a51b863a32e816b1a4962da89fabd6cc01a2dacf28541e96c4b00b0f06f97a1c72a719907bd6b2046bf12fd144510b9dafc84ff0e4a4fd560efdd73a7a4bf6e745d6fe98c1d33559707e3d81b13f4a46b0c3802698bfa4b9f2e39e053d484350f07fccc8f76a6a8f8a1669059dbb9cae8155b340dc0e2fd848d6625e235b083825def575b125507d83840dce8c23689f4ead1e2e69fd85469e950c069539b45768e9bd053736db028c1050cd6960521a68806e6230fd8aa9730c8892f1d67bfe03b1fe87e7b7d4a1c94c5371a1d427861dd43b4478337eec4937035fe31c14feebd187b4a7759fcc4f8a40c91687fe6a5be565e46a16117db5aa692411d35d9249f77b062f4f924000f5ce00410be421b49638fb55d3c3098241677851f7b6ce6b8f81174c3ed9efd42071bb4251e0fdc442a88f61c8e744b5a4f9b5c03bec2a8d4bd9cf0ab4dade02b7037aadd1b98a68bd81bc8fd639b69e228ece97a0aacf6d9727565cc50bc9299e53318ba12945cb68c5e065fc6703194bc0462b9d27097ea01d839abab0219f047729307ac2bb7cfe782185c614399ce0a13a8a92d99bfeef8c2b778a76eb484e7f903725706a8ca192f4e2057fb2ae01b337fec0452b2f79200a2c06aa9f494fbd4b6a2255f42b3e8ecbffc5735ccfd061fa353a2983e84e4d5dfc3a5808dca32296e085cef01fb6624166f6f3164db6a4a5dc7', 'salt', 'false', 'true');
  INSERT INTO users (email, passwordHash, salt, admin, active) VALUES ('disabled@example.com', '8fab6a51b863a32e816b1a4962da89fabd6cc01a2dacf28541e96c4b00b0f06f97a1c72a719907bd6b2046bf12fd144510b9dafc84ff0e4a4fd560efdd73a7a4bf6e745d6fe98c1d33559707e3d81b13f4a46b0c3802698bfa4b9f2e39e053d484350f07fccc8f76a6a8f8a1669059dbb9cae8155b340dc0e2fd848d6625e235b083825def575b125507d83840dce8c23689f4ead1e2e69fd85469e950c069539b45768e9bd053736db028c1050cd6960521a68806e6230fd8aa9730c8892f1d67bfe03b1fe87e7b7d4a1c94c5371a1d427861dd43b4478337eec4937035fe31c14feebd187b4a7759fcc4f8a40c91687fe6a5be565e46a16117db5aa692411d35d9249f77b062f4f924000f5ce00410be421b49638fb55d3c3098241677851f7b6ce6b8f81174c3ed9efd42071bb4251e0fdc442a88f61c8e744b5a4f9b5c03bec2a8d4bd9cf0ab4dade02b7037aadd1b98a68bd81bc8fd639b69e228ece97a0aacf6d9727565cc50bc9299e53318ba12945cb68c5e065fc6703194bc0462b9d27097ea01d839abab0219f047729307ac2bb7cfe782185c614399ce0a13a8a92d99bfeef8c2b778a76eb484e7f903725706a8ca192f4e2057fb2ae01b337fec0452b2f79200a2c06aa9f494fbd4b6a2255f42b3e8ecbffc5735ccfd061fa353a2983e84e4d5dfc3a5808dca32296e085cef01fb6624166f6f3164db6a4a5dc7', 'salt', 'false', 'false');

  INSERT INTO drinkTypes (name, description) VALUES ('shotti', 'Pieni, yleensä 4cl kokoinen vahva juoma.');
  INSERT INTO drinkTypes (name, description) VALUES ('cocktail', 'Sekoitettu juoma jossa on vähintään kolmea eri ainesosaa.');
  INSERT INTO drinkTypes (name, description) VALUES ('booli', 'Sekoitettu juoma jota yleensä tarjoillaan juhlissa isosta boolimaljasta.');

  INSERT INTO ingredients (name, abv) VALUES ('Vodka', 40);
  INSERT INTO ingredients (name, abv) VALUES ('Gin', 40);
  INSERT INTO ingredients (name, abv) VALUES ('Dry vermouth', 18);
  INSERT INTO ingredients (name, abv) VALUES ('Karpalomehu', 0);
  INSERT INTO ingredients (name, abv) VALUES ('Schweppes Russchian', 0);
  INSERT INTO ingredients (name, abv) VALUES ('Karpalolikööri', 20);

  INSERT INTO drinks (primaryName, preparation, type, writer, accepted) VALUES ('Martini', 'Kaada ainesosat sekoituslasiin jossa on jäitä. Sekoita hyvin. Siivilöi jäähdytettyyn martinilasiin. Koristele oliivilla.', 2, 1, 'true');
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (1, 2, 60);
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (1, 3, 10);

  INSERT INTO drinks (primaryName, preparation, type, writer, accepted) VALUES ('Karpalobooli', 'Sekoita ainesosat boolimaljassa. Lisää jäitä ja marjoja koristeeksi.', 3, 3, 'true');
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (2, 1, 500);
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (2, 4, 500);
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (2, 5, 1500);
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (2, 6, 750);

  INSERT INTO drinks (primaryName, preparation, type, writer, accepted) VALUES ('Vodka Martini', 'Kaada ainesosat sekoituslasiin jossa on jäitä. Sekoita hyvin. Siivilöi jäähdytettyyn martinilasiin. Koristele oliivilla.', 2, 1, 'true');
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (3, 1, 60);
  INSERT INTO drinkIngredients (drink, ingredient, amount) VALUES (3, 3, 10);
  INSERT INTO additionalDrinkNames (drink, name) VALUES (3, 'Vodkatini');
COMMIT;
