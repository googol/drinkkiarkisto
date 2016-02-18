# drinkkiarkisto [![Build Status](https://travis-ci.org/googol/drinkkiarkisto.svg?branch=master)](https://travis-ci.org/googol/drinkkiarkisto) [![Dependency Status](https://david-dm.org/googol/drinkkiarkisto.svg)](https://david-dm.org/googol/drinkkiarkisto) [![Heroku](https://heroku-badge.herokuapp.com/?app=peaceful-scrubland-8625)](https://peaceful-scrubland-8625.herokuapp.com/)

Yksinkertainen web-sovellus drinkkireseptien tallentamiseen ja etsimiseen.

Tehty alunperin Helsingin Yliopiston tietojenkäsittelytieteiden Tietokantasovellus-kurssin harjoitustyönä.

## Tehtävänanto
Tämä harjoitustyö perustuu valmiiseen drinkkiarkisto-aiheeseen. Aiheen kuvaus: http://advancedkittenry.github.io/suunnittelu_ja_tyoymparisto/aiheet/Drinkkiarkisto.html

## Demoinstanssi
Tämänhetkinen kehitysversio pyörii osoitteessa: https://peaceful-scrubland-8625.herokuapp.com/

## Dokumentaatio
Dokumentaatio kootaan [dokumentaatio.pdf-tiedostoon demoinstanssissa](https://peaceful-scrubland-8625.herokuapp.com/doc/documentation.pdf)

## Kehitysympäristö
Ohjelmiston kehitysympäristönä voit käyttää vagrantia. Asenna vagrant sekä virtualbox, ja aja `vagrant up` projektikansiossa. Tämä luo virtuaalikoneen jossa voit ajaa ohjelmaa. Komennolla `vagrant ssh` saat yhteyden virtuaalikoneeseen, jossa voit komennolla `npm start` käynnistää serverin. Serveri on tavoitettavissa osoittessa http://localhost:3000/ niin virtuaalikoneella kuin hostilla. Jotta selainjavascript toimisi, on ennen serverin käynnistystä ajettava `npm run bundle` joka kääntää selaimelle sopivan javascript-paketin. Kehityksessä voi käyttää `npm run bundle watch`-komentoa joka kääntää automaattisesti paketin kun lähdekoodiin tallennetaan muutoksia.

## Koodin rakenne
- .editorconfig
  - Tekstieditorien asetuksia tälle projektille. Katso: http://editorconfig.org/
- .travis.yml
  - Travis CI -konfiguraatio automaattisille buildeille. Katso: https://travis-ci.org/
- Vagrantfile
  - Vagrant-kehitysympäristön konfiguraatio
- bootstrap.js
  - Koodin entry-point. Initialisoi babelin joka kääntää es6-koodia vanhempaan syntaksiin.
- doc/
  - Dokumentaation lähteet
- scripts/
  - Apuriskriptejä kehitysympäristöön
- sql/
  - Sql-skriptit mm. tietokannan, taulujen ja testidatan luontiin, sekä niiden poistamiseen
- src/
  - Lähdekoodi ohjelmistolle.
- src/controllers.js
  - Serverin controllerien moduuli. Kokoaa src/controllers-kansiossa olevat luokat yhteen.
- src/controllers/
  - Serverin controlleriluokat erillisissä tiedostoissa.
- src/data.js
  - Tietokantayhteyksien moduuli. Kokoaa src/data-kansiossa olevat luokat yhteen.
- src/data/
  - Tietokantayhteyksien luokat yksittäisissä tiedostoissa.
- src/middleware.js
  - Serverin middelewaret. Julkaisee serverin reiteille omia middlewareja, sekä funktion joka lisää serverin yleiset middlewaret serverille.
- src/routes.js
  - Serverin reititystiedot.
- src/server.js
  - Serverin päätiedosto. Konfiguroi serverin ja käynnistää sen.
- src/validation.js
  - Serveripään datavalidoinnin moduuli. Kokoaa src/validation-kansiossa olevat luokat ja funktiot yhteen.
- src/validation/
  - Luokkia ja funktioita datan validoimiseen serverissä.
- src/views/
  - Näkymät ejs-templateina
- vagrant/
  - Konfiguraatiotiedostoja kehitysympäristöön
