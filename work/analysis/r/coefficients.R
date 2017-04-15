#url coefficient analysis

url <- urlcoefficients

summary(urlcoefficients$value)

url$valQUARTILE[url$value <= 0.0006516 ] <- 1
url$valQUARTILE[url$value > 0.0006516 & url$valQUARTILE <= 0.0009597 ] <- 2
url$valQUARTILE[url$value > 0.0009597 & url$valQUARTILE <= 0.0055290 ] <- 3
url$valQUARTILE[url$value > 0.0055290 ] <- 4

freqtable(url$valQUARTILE)

hist((url$valQUARTILE), main = "title1", xlab = "label1")
hist((url$value), main = "PR() Dist: One Step from Dada", xlab = "PageRank")
