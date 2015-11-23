# drinkkiarkisto [![Build Status](https://travis-ci.org/googol/drinkkiarkisto.svg?branch=master)](https://travis-ci.org/googol/drinkkiarkisto) [![Dependency Status](https://david-dm.org/googol/drinkkiarkisto.svg)](https://david-dm.org/googol/drinkkiarkisto) [![Heroku](https://heroku-badge.herokuapp.com/?app=peaceful-scrubland-8625)](https://peaceful-scrubland-8625.herokuapp.com/)

Tietokantasovellus-kurssin harjoitustyö

## Tehtävänanto
Tämä harjoitustyö perustuu valmiiseen drinkkiarkisto-aiheeseen. Aiheen kuvaus: http://advancedkittenry.github.io/suunnittelu_ja_tyoymparisto/aiheet/Drinkkiarkisto.html

## Demoinstanssi
Tämänhetkinen kehitysversio pyörii osoitteessa: https://peaceful-scrubland-8625.herokuapp.com/

### Kirjautuminen
Demoinstanssilla on kaksi käyttäjää valmiina: admin@example.com ja user@example.com. Molempien salasana on password. Ensimäinen on admin ja toinen peruskäyttäjä, joka ei tosin tässä vaiheessa vielä vaikuta ohjelmiston käyttäytymiseen.

## Dokumentaatio
Dokumentaatio kootaan [dokumentaatio.pdf-tiedostoon demoinstanssissa](https://peaceful-scrubland-8625.herokuapp.com/doc/documentation.pdf)

## Kehitysympäristö
Ohjelmiston kehitysympäristönä voit käyttää vagrantia. Asenna vagrant sekä virtualbox, ja aja `vagrant up` projektikansiossa. Tämä luo virtuaalikoneen jossa voit ajaa ohjelmaa. Komennolla `vagrant ssh` saat yhteyden virtuaalikoneeseen, jossa voit komennolla `npm start` käynnistää serverin. Serveri on tavoitettavissa osoittessa http://localhost:3000/ niin virtuaalikoneella kuin hostilla.

## Koodin rakenne
- bootstrap.js
  - Koodin entry-point. Initialisoi babelin joka kääntää es6-koodia vanhempaan syntaksiin.
- src/
  - Serverin tiedostot.
- src/server.js
  - Serverin päätiedosto. Konfiguroi serverin ja sen reitit ja käynnistää sen.
- src/data.js
  - Tietokantayhteyksien moduuli
- src/data/
  - Tietokantayhteyksien luokat yksittäisissä tiedostoissa
- src/views/
  - Näkymät ejs-templateina
- scripts/
  - Apuriskriptejä kehitysympäristöön
- vagrant/
  - Konfiguraatiotiedostoja kehitysympäristöön
- sql/
  - Sql-skriptit mm. tietokannan, taulujen ja testidatan luontiin, sekä niiden poistamiseen
- doc/
  - Dokumentaation lähteet
