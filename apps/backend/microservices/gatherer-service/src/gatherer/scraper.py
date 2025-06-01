import logging
import re # python's regex lib
from gatherer.base import Gatherer
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class Scraper(Gatherer):
    def gather(self):
        # logger = logging.getLogger("gatherer_service_logger.")
        options = Options()
        options.add_argument(" - headless") # Run browser in the background
        driver = webdriver.Chrome(service=Service(), options=options)
        driver.get("https://www.google.com/maps")

        logger = logging.getLogger("gatherer_service.gatherer.scraper")

        # click accept all GDPR cookies
        try:
            accept_button = driver.find_element(By.CSS_SELECTOR, "[aria-label='Accept all']")
            accept_button.click()
        except NoSuchElementException:
            logger.exception("No GPDR cookie requirements detected")
        
        # fill in search bar and click search button
        search_box = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#searchboxinput"))
        )
        search_box.send_keys("Italian restaurants")
        search_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Search']")
        search_button.click()

        # extract info
        business_items = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.XPATH, '//div[@role="feed"]//div[contains(@jsaction, "mouseover:pane")]'))
        )

        for item in business_items:
            name = item.find_element(By.CSS_SELECTOR, "div.fontHeadlineSmall").text
            link = item.find_element(By.CSS_SELECTOR, "a[jsaction]").get_attribute("href")

            # stars, number of reviews
            reviews_element = item.find_element(By.CSS_SELECTOR, "span[role='img']")
            reviews_text = reviews_element.get_attribute("aria-label")
            match = re.match(r"(\d+\.\d+) stars (\d+[,]*\d+) Reviews", reviews_text)
            if match:
                stars = float(match.group(1))
            review_count = int(match.group(2).replace(",", ""))

            info_div = item.find_element(By.CSS_SELECTOR, ".fontBodyMedium")
            spans = info_div.find_elements(By.XPATH, ".//span[not(@*) or @style]")
            details = [span.text for span in spans if span.text.strip()]
            print(f"Stars: {stars}, Reviews: {review_count}")
            print(f"Business: {name}, Link: {link}")
            print("Details:", details)