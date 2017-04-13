# Contents of files
Listed roughly in order of importance.


### dataCleaning.js
Further cleaning of scraped data. Removes unwanted files that may introduce more noise than signal into visualization and analysis.

### nodeLinkStructure.js
Restructures cleaned (post dataCleaning.js) data to fit into d3's force chart format.

### prototypeData.js
A compressor specifically for prototyping visualization. Removes any URLs not yet scraped from the dataset.

### metaDataReader.js
A working file to help with cursory analysis of the data set: finding specific URLs, checking for properties, etc.

### hash.js
Counts instances of various URLs.

### hashMeta.js
Gives a rough idea of the distribution of various URLs.
