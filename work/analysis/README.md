# Contents of files

* *analysisNotes.MD* <br />
Contains output of from various stages of data cleaning, restructuring and building the coefficient.

* *inspector.js* <br />
For taking a quick glance at the data with node.

* *inspector.ipynb* <br />
For taking a quick glance at the data with python.

* *r Directory* <br />
For taking a look at ranked values with R.

### Pipeline

0. (Deprecated) *p-dadaCleaning.js* <br />
Further cleaning of scraped data. Removes unwanted files that may introduce more noise than signal into visualization and analysis. Not used in the current pipeline; integrated into crawler.

1. *p-rootCalc.js* <br />
Assigns urls to the 'root' array based on next closest links to Dada.

2. *p-reduce.js* <br />
A compressor specifically for prototyping visualization. Removes any URLs not yet scraped from the dataset. Calls ranking (p-rank) algorithm in cycles.

3. *p-rank.js* <br />
Modular. Applies the ranking algorithm to the url set passed to it, returns a top-quartile set and a full set of urls and ranks.

4. *p-prototype.js* <br />
Restructures cleaned (post dataCleaning.js) data to fit into d3's force chart format, a node / link structure, and adds other minor structures to help power the interface.
