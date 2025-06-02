from formatter.base import Formatter
from formatter._types import FormattedData
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
import re # python's regex lib

class ScraperFormatter(Formatter):
    def format(self, data: WebElement) -> FormattedData:
        name = data.find_element(By.CSS_SELECTOR, "div.fontHeadlineSmall").text
        link = data.find_element(By.CSS_SELECTOR, "a[jsaction]").get_attribute("href")

        # stars, number of reviews
        reviews_element = data.find_element(By.CSS_SELECTOR, "span[role='img']")
        reviews_text = reviews_element.get_attribute("aria-label")
        match = re.match(r"(\d+\.\d+) stars (\d+[,]*\d+) Reviews", reviews_text)
        if match:
            stars = float(match.group(1))
        review_count = int(match.group(2).replace(",", ""))

        info_div = data.find_element(By.CSS_SELECTOR, ".fontBodyMedium")
        spans = info_div.find_elements(By.XPATH, ".//span[not(@*) or @style]")
        details = [span.text for span in spans if span.text.strip()]
        print(f"Stars: {stars}, Reviews: {review_count}")
        print(f"Business: {name}, Link: {link}")
        print("Details:", details)

        return FormattedData(name, link)