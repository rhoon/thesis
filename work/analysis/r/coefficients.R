install.packages("ggplot2")
library("ggplot2")

#url coefficient analysis

url <- urlcoefficients

summary(urlcoefficients$value)

quantile(url$value, prob = seq(0, 1, length = 11), type = 5)
url$valTOP10[url$value <= 0.0188064075 ] <- 0 
url$valTOP10[url$value > 0.0188064075 ] <- 1


url$valQUARTILE[url$value <= 0.0006516 ] <- 1
url$valQUARTILE[url$value > 0.0006516 & url$value <= 0.0009597 ] <- 2
url$valQUARTILE[url$value > 0.0009597 & url$value <= 0.0055290 ] <- 3
url$valQUARTILE[url$value > 0.0055290 ] <- 4

hist((url$value), main = "PR() Dist: One Step from Dada", xlab = "PageRank")

ggplot(url, aes(value)) +
  geom_histogram()

ggplot(url, aes(value)) +
  geom_histogram(bins = 200)

ggplot(url, aes(value)) +
  geom_histogram(bins = 300)

ggplot(url, aes(value)) +
  geom_histogram(bins = 700)

