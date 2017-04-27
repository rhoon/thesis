[Desktop Prototype](/visualization/prototypes-r3.pdf)

[Written Thesis](/writing/writtenThesis.md)

[Reading List](/writing/readingList.md)

# Mapping Dada

### Features:
1. Visualized conceptual and historical ties from contemporary figures and movements to Dada.
2. Sort through categories to isolate different components of the art movement and it’s ideological offspring.
3. See the quantified strength of network nodes to gauge the most power points of influence.
4. Visually clustered offshoots based on common influences.
5. Search available article titles for specific uses.
6. Zoom and pan to navigate the network in-depth.


### Quantifying the Influence of a 1920’s Art Movement through Wikipedia's Link Structure

This thesis is an investigation of linked article structures, Wikipedia metadata, and what we can learn from analyzing these complex networks - for instance, how does an art movement’s influence spread over time? And geographically? Can we measure said influence quantitatively? The thesis attempts to build a model using Dada as an example, using network analysis and ranking algorithms, to answer these questions and visualize these relationships to allow the audience to judge the effectiveness of said model.

I have chosen Dada as a topic because it is both well documented and (not having made it into public school curriculums) not especially well known outside the design and art community. I believe that this analysis will yield some surprising results on the influence of what many would consider to be a relatively obscure art movement (compared to Cubism or Impressionism) from a short period of time and it’s vast implications both within and outside of the art and design communities.

I will approach the model from several vantage points:

1) A discussion of wikipedia as a source; it’s strengths (it has a great deal of breadth; it’s article formatting is relatively consistent, allowing for data collection; it is open to automated data collection needed to sort through vast quantities of information) and it’s weaknesses (it has been shown to be biased towards popular culture topics; while ‘accuracy’ is reasonably high compared other encyclopedias, sometimes the articles are not as complete as other sources; the over-representation of gender/race in some topics and not others)

2) An analysis of the link structure, and how ‘historic influence’ can be quantified (with inspiration from Larry Page’s PageRank algorithm) using the ‘proximity’ of the topic e.g. how many links away from Dada it is, and the ‘strength’ of the influence, speaking roughly, how many different pathways connect it to Dada.

3) An overview of Network Analyses and their use both visually and quantitatively in similar spaces. Some of the ground breakers in this space include Manuel Lima’s exhaustive documentation of networks, (Visual Complexity: Mapping Patterns of Information & The book of trees : visualizing branches of knowledge), Dietmar Offenhuber’s Semaspace (http://residence.aec.at/didi/FLweb/), NYT Labs’ Cascade tool, which makes a similar attempt to follow the dissemination of an article over time (http://nytlabs.com/projects/cascade.html)  and especially Chris Harrison’s ClusterBall, which maps wikipedia’s structure around broad topics (http://www.chrisharrison.net/index.php/Visualizations/ClusterBall).

The body of the thesis investigation will be centered around a visual tool that allows the viewers to explore the network of connections as they emerge from Dada; assuming location data is available, over space; assuming time data is available, over time as well. The audience will be introduced to the data set, how it has been collected, and a few example points, and then encouraged to explore at their will.

I am hoping that this work will appeal to art and cultural historians and enthusiasts, especially those interested in those fields’ intersection with the digital humanities. I anticipate that Wikipedians may have at least a passing interest in this project as well, and hope that those interested in measuring influence (sociologists, philosophers and intellectual historians) will have some interest in the model itself.


# Thesis

1. A wikipedia crawler to map the cultural influence of Dada;
2. to better understand how Dada is connected to contemporary life;
3. and understand how link structures can reveal the migration of ideas.

# Mind Map

![](writing/mindMapV1.jpg)

# Storyboard

![](writing/storyboard-v1.jpg)
