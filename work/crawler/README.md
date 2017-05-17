# Contents of files

### Crawler

* *collect.js* <br />
The central hub in the hub-and-spokes crawler code set. Conditional file requests fire in order based on URL type, with a randomly generated delay between 1.5 and 3.5 seconds per page request. These requests are contained within a two-layer recursive loop that allows the crawler to move through an array of objects passed to it. Files are written in batches to avoid over-burdening server memory and to allow the crawler to function piecemeal if necessary. Typically run from an EC2 instance.

* *s-detect.js* <br />
A modular file used to detect and keep easy track of URLs meant to be excluded from the final set and prevent them from being scraped; the replacement for `p-dataCleaning.js` from the analysis directory.

* *s-mainPage.js* <br />
Scraper for the main Wikipedia article.

* *s-mapsFrom.js* <br />
Scraper for the 'What links here' page per article.

* *s-wikiData.js* <br />
Scraper for the WikiData object per article; URL for this is retrieved by `s-mainPage.js`.

### Other Files

* *ranRange.js* <br />
Generates the random selected URLs for which to gather the sample data.

* *dups.json* <br />
A log of all previously collected URLs to avoid redundancy in `collect.js`.
