# Contents of files

* *analysisNotes.MD* <br />
Contains output of from various stages of data cleaning, restructuring and building the coefficient.

### Pipeline

1. *dataCleaning.js* <br />
Further cleaning of scraped data. Removes unwanted files that may introduce more noise than signal into visualization and analysis.

2. *prototypeData.js* <br />
A compressor specifically for prototyping visualization. Removes any URLs not yet scraped from the dataset.

3. *nodeLinkStructure.js* <br />
Restructures cleaned (post dataCleaning.js) data to fit into d3's force chart format.

4. *coefficient.js* <br />
Building a ranking coefficient to use in narrowing the dataset and establishing strength of relationship to Dada.

_____

* *metaDataReader.js* <br />
A working file to help with cursory analysis of the data set: finding specific URLs, checking for properties, etc.

* *hash.js* <br />
Counts instances of various URLs.

* *hashMeta.js* <br />
Gives a rough idea of the distribution of various URLs.
