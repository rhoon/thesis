### coefficient
Distribution of PageRank scores on first level scrape:
![](charts/urldist-1step.png)<br />
Quartiles:<br />
1st - 0.0006516 (lowest possible score: 0.0006285) <br />
Median - 0.0009597<br />
3rd - 0.0055290<br />
Max - 0.0828100<br />
<br />
##### Score algorithm (coefficient.js) - April 15th 2017

```
for (var j in args[url].mapsFrom) {
  rankOut[iteration][url] += (args[mfurl].rank/args[mfurl].mapsToLen);
}
```

Will need to be modified to include distance from dada argument. Rank is initialized at 1/N where N is the total number of urls scraped.
`args[mfurl].mapsToLen` is the total number of outward-bound links from a link pointing at the current URL. `rankOut[iteration][url]` is the score.

### cleaned data
total links: 777047 <br />
unique links: 309097 <br />

### pointers
has any links: 309097 <br />
more than 2 links: 118492 <br />
more than 5 links: 26911 <br />
more than 10 links: 9025 <br />
more than 20 links: 3082 <br />
more than 50 links: 890 <br />
more than 100 links: 375 <br />
more than 200 links: 110 <br />
more than 300 links: 33 <br />
[ 'Dada',
  'Cubism',
  'Surrealism',
  'Avant-garde',
  'Impressionism',
  'Section_d%27Or',
  'Marcel_Duchamp',
  'Modern_art',
  'Tristan_Tzara',
  'Modernism',
  'Minimalism',
  'Pablo_Picasso',
  'Fluxus',
  'Symbolism_(arts)',
  'Expressionism',
  'Pop_art',
  'Abstract_expressionism',
  'Art_movement',
  'Futurism',
  'Color_Field',
  'Salon_d%27Automne',
  'Soci%C3%A9t%C3%A9_des_Artistes_Ind%C3%A9pendants',
  'Constructivism_(art)',
  'Incoherents',
  'Rafael_Trelles',
  'Fauvism',
  'Relationship_between_avant-garde_art_and_American_pop_culture',
  'Scuola_Romana',
  'Guglielmo_Janni',
  'Minimalism_(visual_arts)',
  'Soci%C3%A9t%C3%A9_Normande_de_Peinture_Moderne',
  'Bauhaus',
  'Conceptual_art' ] <br />
more than 500 links: 4 <br />
[ 'Dada', 'Surrealism', 'Avant-garde', 'Expressionism' ] <br />
 <br />

### Improvements since uncleaned data: <br />
43k+ unique urls removed <br />
150k+ total links removed <br />
