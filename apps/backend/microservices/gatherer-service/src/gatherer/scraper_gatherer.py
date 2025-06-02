import logging
from gatherer.base import Gatherer
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from formatter._types import FormattedData
from tempfile import mkdtemp
import shutil

class ScraperGatherer(Gatherer):
    def gather(self):
        # logger = logging.getLogger("gatherer_service_logger.")
        options = Options()
        options.add_argument("--headless") # Run browser in the background

        tmpdir = mkdtemp()

        options.add_argument(f"--user-data-dir={tmpdir}") # Temp file for chrome to run headlessly
        driver = webdriver.Chrome(service=Service(), options=options)
        driver.get("https://www.google.com/maps")

        logger = logging.getLogger("gatherer_service.gatherer.scraper_gatherer")

        # click accept all GDPR cookies
        try:
            accept_button = driver.find_element(By.CSS_SELECTOR, "[aria-label='Accept all']")
            accept_button.click()
        # except NoSuchElementException:
        #     logger.exception("No GPDR cookie requirements detected")
        except Exception as e:
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
            data = self.formatter.format(item)
            print("DATA", data)
            # await self.queue.enqueue(data)
        
        driver.quit()
        shutil.rmtree(tmpdir)