# Mapping Dada
### Charting the Interconnectedness of History

###### Riley Hoonan, Parsons School of Design
###### MS Data Visualization Candidate 2017
–
###### Submitted in partial fulfillment of the requirements for the degree of Master Science in Data Visualization at Parsons School of Design.

<br />
<br />
<br />

#### Introduction

In recent years, the wealth of data available over the internet has given birth to new approaches to intellectual history–ones not reliant on curation by academia, but by the public (or at least those with access to the digital domain). As with all things on the internet, this data can be gathered programmatically, offering opportunities to build new metrics for concepts previously considered unquantifiable. In question here: can we map the influence of a movement on contemporary culture? In doing so, can we measure the spread of said concept? And what do the contemporary interpretations tell us about how the original idea’s shape has transformed?

I attempt to answer these questions using Wikipedia’s link structure as a data source. This underlying set of interconnections allows us to gauge the cognitive proximity of concepts, without the limitations of geographic or chronologic distance, as determined by the community of amateur researchers powering Wikipedia. In building a model, we establish a single case study to act as the central node for our influence-network: the art movement Dada.

#### 1. Background
##### 1.0 Dada as a case study for a model to track cultural influence.

Cultural influence, while not currently quantified as a metric, is actively tracked through a multitude of historic and philosophical studies: art history, cultural history, intellectual history, “The History of Thought” and even Memetics (although the persistence of this last discipline is debatable). (Kronfeldner, 2014; Grafton, 2006; Marsden, 1999)

In embarking on building a metric for cultural influence, quantifiable through link structures, Dada is chosen because it is well documented through its contemporary publications and the analyses of the aforementioned disciplines (art history etc). Dada also enjoys the distinct strength of prominence in academia whilst generally falling outside the curriculums of mainstream culture, meaning it is less likely to suffer from over-representation in Wikipedia, as is often found with pop culture and art topics (Kittur et al, 2009; Halvais and Lackaff, 2009).

Further, ongoing debate on Dada as a modernist or postmodernist movement gives us means to compare the output of the model to expected results, a sort of theoretical hypothesis to test against. In *Challenging Modernity: Dada between Modern and Postmodern,* Mark Pegrum posits Dada as a particularly early postmodernist entity, standing directly opposed to power structures, parallel but not intersecting with modernism, which seeks instead to redesign said power structures. Indeed, in the *First International Dada Fair* (1920), Dadaists cement their opposition to the establishment with posters pronouncing “Art is Dead” and "Dada is the deliberate subversion of bourgeois values.” (Dachy, 2006)

Jean Arp, a central figure in Dada, furthers these anti-establishment ideals with anti-war sentiment:

> “In Zurich, we had no interest in the abattoirs of the World War, and devoted ourselves to fine art. While the thunder of artillery rumbled away in the distance, we were putting together collages, reciting, writing verse, and singing with all our hearts. We were looking for an elementary type of art that we thought would save mankind from the raging madness of those times. We aspired to a new order that could reestablish the balance between heaven and hell.”

Dada is deeply intertwined with politics, with (some argue unwanted) ties to the Kommunistische Partei Deutshlands (Kane, 1982), Huelsenberg’s assertions that “Dada is German Bolshevism” (Motherwell, 1951), a few members labeled as anarchists (often overlapping with communists), and a general distrust, and satire, of authority. At one point, Andre Breton argues the Dadaists will declare themselves in favor of any revolution, so long as it is in opposition to conservatism. Dada earns infamy among the ranks of authority figures through a variety of art pieces and pranks: depicting a police officer as a pig in the *First International Dada Fair*; a founding of a ‘Dada Republic’ where soldiers are summoned in reaction to a non-existent revolution; photocollage satires of major political figures...the list goes on. (Dachy, 2006) In these acts of dissidence, Dada extends beyond art movement into the space of direct action and political protest, providing a wellspring of inspiration for arts-activism to come.

We should expect Wikipedia’s link structure to reflect this. Conversely, a link structure that paints Dada as a friend to authoritarian figures would be worthy of skepticism, helping establish theoretical underpinnings for validation (or rejection) of our analysis.

Dada’s final strength as subject matter is its own documentation, helping dissolve some potential for misrepresentation found with other topics more reliant on secondary sources. From Tristan Tzara’s founding of Dada in 1915, the movement quickly evolves to form cells outside of Zurich, first in Europe and then to Japan, through Murayama, and the US, where Duchamp makes his home in New York. In this international arena, Dadaist thoughts and ideals are spread via magazines and art rags of the time–first and foremost, Hugo Ball and Tristan Tzara's *Dada* magazine, but just as importantly, *Merz,* Schwitter’s periodical; *391,* from Picabia in Barcelona; *Mavo,* from Murayama in Japan, and (albeit tangentially) *De Stijl,* which, while not directly related to Dada, is a close enough cousin through it’s author Theo Van Doesenberg and his ongoing collaborations with members of the movement, often operating under his Dadaist pseudonym, “Bonset”. (Dachy, 2006) Additionally, broad art magazines of the time, the art itself and art gallery records provide strong primary sources for its study and representation on Wikipedia.

In attempting to quantify influence, it is difficult to disentangle Dada from its particular moment in history, but by relying on link analysis, we have a start: authors have diligently and specifically linked their page to or from Dada, allowing us to track the chain of concepts as they evolve rather than rely upon chronological proximity. Ideally, network analyses helps define causal relationships by isolating the path from one concept to the next. In reality, these paths are multifaceted, and Dada is itself a culmination of and reaction to it’s own contemporary histories. On a theoretical basis, it is difficult to remove Dada from it's own influences: a reaction against war, nationalism, and destruction, inspiration from the great thinkers of its epoch, such as Nietzche, Freud and Marx, (Pegrum, 2000), and of course the cross pollination of other prominent art movements of the moment, like Cubism, Futurism, Expressionism, and especially Surrealism.

##### 1.1 Wikipedia as a Data Source: Strengths and Bias

Wikipedia does present some issues beyond the scope of our data collection. Specifically in question: the ‘quality’ of articles. As noted by Mesgari et al (2014), quality in this case is constituted by, and reviewed in, several categories: comprehensiveness (within articles, and across Wikipedia as a whole), its factual accuracy, breadth and presentation. While presentation is not of particularly impactful for our analysis, (as our data is collected programmatically, not read by humans) breadth, factual accuracy, and comprehensiveness are.

In breadth, Wikipedia reports that it is 60 times larger than any other english-language encyclopedia, with well over five million articles as of this writing (Wikipedia, 2017). Although the size of an encyclopedia alone is not normally cause célèbre amongst researchers, because each article increases our sample size, it increases the power of any statistical analyses applied to said data. Wikipedia's coverage is uneven, but it’s propensity for non-traditional, up-to-date crowdsourced encyclopedic information is still helpful, (Mesgari et al 2014) in that it more readily allows us to draw connections between Dada and contemporary cultural items.

Researchers have noted an unevenness in coverage on Wikipedia. In 2008, Halavais and Lackoff compared the topical distribution of books in print (from Bowkers Books in Print) vs. topical distribution of Wikipedia articles, and found differences in representation they attribute to the Wikipedia’s ‘geek culture’^1^: for articles on science and general history, Wikipedia is more voluminous, whereas for medicine, less so. In the center, with similar distributions between books in print and Wikipedia articles, was ‘Fine Art’, a category presumably including Dada, implying that Dada falls within a relatively ‘safe zone’ of neither under- nor over-representation.^2^

Further review on gender inclusion by Reagle and Rue (2011) finds that women are underrepresented in biographies, although article length does not vary significantly by gender, thereby increasing the likelihood that while women who are present will enjoy relatively comprehensive coverage, it’s likely that some of the important female contributors to Dada are left out.

#### 2. Data collection
##### 2.0 Methodology & Schema

Data is collected using a javascript program that traverses the HTML structure of a web page and collects data from it, called a scraper. In our analyses, two types of link are included: links mapping *from* an article to the article in question, and links mapping *to* an article in from the article in question. Wikipedia’s structure conveniently gives us this option by providing a “What Links Here Page” for most articles.

Links mapping from are collected *from* within the article itself by parsing the article’s HTML and collecting anchor tag ‘href’ values that link specifically to other articles within Wikipedia.

In addition to the links themselves, categorical information associated with Wikipedia’s ‘Wikidata’ objects is also collected. Wikidata objects feature relatively unstructured categorical details per article, adhering to a key:value pair schema, where values are often arrays. As such, our collection reflects the unstructured nature of this categorical data, but allows additional analysis and classification.

Ultimately, the schema is flexible to accommodate the variety of different types of input it may or may not find on a wikipedia page, but it’s general structure is outlined in the key value pair. The data is stored in JSON format as follows, with Francis Picabia as a truncated example.

```
{ distance: 1,
  roots: [ 'Dada' ],
  url: 'Francis_Picabia',
  mapsFrom:
   [ 'Dada','Edvard_Munch','Erik_Satie','Franz_Kafka','The_Metamorphosis','Georges_Braque', … ],
  mapsTo: [ 'Cubism','Dada','Surrealism','Avant-garde','Impressionism','Pointillism', … ],
  wikiData: 'https://www.wikidata.org/wiki/Q157321',
  image: '//upload.wikimedia.org/wikipedia/en/thumb/9/9f/Francis_Picabia%2C_1919%2C_Danse_de_Saint-Guy%2C_The_Little_Review%2C_Picabia_number%2C_Autumn_1922.jpg/240px-Francis_Picabia%2C_1919%2C_Danse_de_Saint-Guy%2C_The_Little_Review%2C_Picabia_number%2C_Autumn_1922.jpg',
  title: 'Francis Picabia',
  metaData:
   { 'instance of': [ 'human' ],
     'sex or gender': [ 'male' ],
     'country of citizenship': [ 'France' ],
     'date of birth': [ '1879' ],
     'date of death': [ '1953' ],
     'place of burial': [ 'Montmartre Cemetery' ],
     occupation: [ 'painter', 'writer', 'screenwriter', 'poet' ], },
  rank: '0.010049' }
```

######This example is greatly reduced and purely for sake of illustrating the data structure. While Picabia is included in the data set, the mapsTo and mapsFrom arrays are too large to be a practical illustration.

Line by line, we see a distance property, indicating how many links from Dada a particular item is (in this case, a distance of ‘1’ means a page is linked to directly). Second, a roots property, which allows us to programatically follow the various link paths back to their origin (Dada) to better examine their relationships. Unlike the others, this property is computed after the data is collected, from the *mapsFrom* and *mapsTo* arrays, rather than gathered from the scraper directly.

The *url* property provides a path back to the page when appended to the wikipedia url, https://en.wikipedia.org/wiki/.

*mapsTo* contains the links from Francis_Picabia to other pages; *mapsFrom* contains the links from other pages to Francis_Picabia. The example shown lists particularly small arrays, and is not true to the dataset – in practice, the *mapsFrom* array had a mean average of 22 (standard deviation of 112) unique URLs, although many exceed that, with a maximum of 1680 unique URLs in a single set. mapsTo had a more compressed range, with a maximum of 825 unique URLs, and a mean average of 68 links. Hopefully this begins to illustrate scope: for instance, with a list of 1000 collected data objects like Picabia above, assuming the same average, we would have a combined total of 90,000 URLs, not accounting for duplicates.

*title* is simply the title of the page, useful primarily for the visualization and interface. image is the collected by the scraper as the first image that it encounters on the page that is not a product of wikipedia itself, such as a logo, and like the title is gathered to assist in the construction of the graphic interface accompanying the visualization.

The afore-mentioned *metaData* property is a particularly dynamic object that transforms based upon the data readily available as described above. In this case, we see basic information about Mr. Picabia generally representative of how other humans might appear, but these objects expand and contract to contain information about locations and date; a full list of the possible key value pairs available is contained in *Appendix A: WikiData Properties.*

Last, *rank* is the calculated “WikiRank” value, described in depth in *2.21*.

##### 2.1 Initial Exclusions

Links collected for the *mapsTo* and *mapsFrom* arrays are limited to the body text of the article from which they originate; tables appearing underneath articles are not included because they are categorical in nature. Also excluded are general categorical pages, as any analysis using link structure to weight relevance would be dismantled by categories too broad to ascribe meaning (such as ‘Art’). Links to pages that are not articles themselves are excluded as much as possible: ‘Talk’, ‘User’, and ‘Portal’ pages are not included as they are more related to the structure of Wikipedia’s community than the topics themselves.

Some pages are included in the link structure but are ‘dead ends’ in the network–that is, pages may link *to* them but no pages will link *from* them. Included in this category are image pages, which do not contain the same sort of outward-bound links collected from the body text of articles, and ‘Book’ pages. ‘Wikisource’, ‘Wikiquote’ and ‘Draft’ pages are fully excluded because they lack a homogenous page structure to collect data from, or otherwise introduce more noise than signal.

Unfortunately, due to limitations in scope, non-English pages are not included in this model, although a properly language-robust model built on the same general premise would reasonably include them. Because of this, one would expect that some of the more detailed information on international players of Dada is limited in representation.

Importantly, duplicates are not recorded; the set only lists unique URLs. To clarify, in the set of all URLs in all *mapsTo* and *mapsFrom* arrays, there are duplicates, but within a single object (such as the ‘Francis_Picabia’ object from the earlier example) *mapsTo* will not have duplicates within it, and *mapsFrom* will not have dupicates within it. Between the two, there may be duplicates; e.g. Dada links directly to Picabia, and is logged in the mapsFrom array, but Picabia links to Dada, so Dada is also logged in the mapsTo array.

In essence, pages and links are curated to keep the data congruent and the model parsimonious. The guiding principles for inclusion were that links were human crafted (or in the case of ‘What Links Here’ pages, a collection of human crafted links) and part of an article, rather than discussion, or machine generated. A final list of excluded pages can be found in *Appendix B: Complete List of Exclusions.*

##### 2.20 Data Collection Process

Data collection began with the single article for Dada. While early versions of the scraper returned nearly 2000 total links in the *mapsFrom* and *mapsTo* arrays, the most refined (to better exclude the categories described above) version, last run on 4/26/2017, returned a list of 1454 urls in the *mapsFrom* array and 202 urls in the *mapsTo* array.

These urls were scraped, returning data points following the schema described in section 2.0 for each url. In the earlier, less filtered set, combining the *mapsTo* and *mapsFrom* arrays resulted in a list of 777,047 links total, of which 309,097 urls are unique.

While many steps were taken to make the scraper as scalable as possible, gathering over a quarter million data points for the analysis was not a viable option within the scope of the project, and further would likely introduce more noise than signal, making it difficult to gather insight from the collected data.

A metaphor might better illustrate the issue at hand: designing a map requires a curatorial hand in what geographic features to include and exclude. A map of a nation cannot show every nook and cranny of a creek winding through a neighborhood; similarly, this representation should be limited to the most ‘monumental’ features in the conceptual spatialization of Dada.

Establishing a more nuanced sense of ‘relevance’ allows this massive set to be filtered appropriately.

##### 2.21 Designing a Ranking Algorithm

To do this, a ranking algorithm was built. URLs were ranked using the PageRank algorithm (designed by Larry Page of Google fame), in conjunction with a penalty for distance to create a ‘WikiRank’, shown in Figure 2.a, below, to establish a hierarchy of relevance to Dada. PageRank’s values give us a sense of the proportion of links pointing at a page to the links pointing at it; pages that have many links pointing at them (*mapsFrom*) will be ranked higher, whereas pages that only point at others (*mapsTo*) will be ranked lower. (Page, 1998)

While PageRank is generally designed to be used in an iterative context, due to the closed nature of the set this was unnecessary and only compounded the relationship already made clear in a single iteration.

For the initial analysis, all of the URLs gathered so far were used to get a better sense of the scope and data included, but in future iterations, the WikiRank algorithm was only run on an *‘in-network’* set, or rather, the intersection of URLs contained in each *mapsTo* and *mapsFrom* array with the set of URLs scraped so far.

![](img-assets/RankEquation.png)
###### Fig. 2.a - ‘WikiRank’ Equation, generating a rank per page proportionate to the importance of the article and distance from Dada.
###### m is the total number of urls contained in the mapsTo current article being ranked; L is the total number of in-network URLs; mapsTo is the total number of in-network URLs for article i; And distance is the number of links away from Dada article i is (at this point in the analysis, always 1)
