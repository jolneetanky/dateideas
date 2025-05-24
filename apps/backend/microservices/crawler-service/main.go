package main

import (
	"github.com/jolneetanky/dateideas/apps/backend/microservices/crawler-service/internal/crawler"
)

func main() {
	seedurl := "https://www.scrapingcourse.com/ecommerce/"

	// call crawl function
	crawler.Crawl(seedurl, 1)
}
