package crawler

import (
	"fmt"

	"github.com/gocolly/colly"
)

var visitedUrls = make(map[string]bool)

func Crawl(currUrl string, maxDepth int) {
	// create a new collector
	c := colly.NewCollector(
		colly.MaxDepth(maxDepth),
	)

	// ATTACH CALLBACKS TO DETERMINE WHAT COLLECTOR DOES UPON VISITING URL
	// extract and log page title
	// recursively visit nested links until max depth reached
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		// get absolute URL
		link := e.Request.AbsoluteURL(e.Attr("href"))
		// check if current URL has already been visited
		if link != "" && !visitedUrls[link] {
			// add current URL to visitedUrls
			visitedUrls[link] = true
			fmt.Println("FOUND LINK:", link)
			// visit current URL recursively
			e.Request.Visit(link)
		}
	})

	// called BEFORE a url request
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Crawling", r.URL)
	})

	// handle request errors
	c.OnError(func(res *colly.Response, err error) {
		fmt.Println("Request URL:", res.Request.URL, "failed with response:", res, "\nError:", err)
	})

	// visit seed URL
	err := c.Visit(currUrl)
	if err != nil {
		fmt.Println("Error visiting page:", err)
	}
}
