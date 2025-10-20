import logging
from gatherer.base import Gatherer
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
# from seleniumwire import webdriver as wiredriver
# from webdriver_manager.chrome import ChromeDriverManager
from formatter._types import FormattedData
from tempfile import mkdtemp
import shutil
import os
import random
import time

# Get free proxies for rotating
def get_free_proxies(driver):
    proxy_website = os.getenv('IP_PROXY_WEBSITE')
    driver.get(proxy_website)

    table = driver.find_element(By.TAG_NAME, 'table')
    thead = table.find_element(By.TAG_NAME, 'thead').find_elements(By.TAG_NAME, 'th')
    tbody = table.find_element(By.TAG_NAME, 'tbody').find_elements(By.TAG_NAME, 'tr')

    headers = []
    for th in thead:
        headers.append(th.text.strip())

        proxies = []
    for tr in tbody:
        proxy_data = {}
        tds = tr.find_elements(By.TAG_NAME, 'td')
        for i in range(len(headers)):
            proxy_data[headers[i]] = tds[i].text.strip()
        proxies.append(proxy_data)
    
    return proxies

# passes in the working proxies to a driver.
# def rorate_proxy(working_proxies):

class ScraperGatherer(Gatherer):
    def gather(self):
        # get free proxies.
        # TODO: After DB has been setup, take from that DB. But for now, we can just keep scraping first.
        proxy_driver = webdriver.Chrome()
        free_proxies = get_free_proxies(proxy_driver)
        print("FREE PROXIES", free_proxies)

        # logger = logging.getLogger("gatherer_service_logger.")
        options = Options()
        options.add_argument("--headless") # Run browser in the background

        # temp directory for headless chrome to run each time
        tmpdir = mkdtemp()
        options.add_argument(f"--user-data-dir={tmpdir}") # Temp file for chrome to run headlessly

        # number of retries for proxy rotation
        retries = len(free_proxies)
        for _ in range(retries):
            random_proxy = random.choice(free_proxies)
            print("USING PROXY", random_proxy)

            proxy_options = {
                "https": f"{random_proxy['IP Address']}:{random_proxy['Port']}",
                "http": f"{random_proxy['IP Address']}:{random_proxy['Port']}",
            }
            print("PROXY OPTIONS", proxy_options)
            # try:
            #     # Initialize Chrome driver with Selenium-Wire, using the random proxy
            #     driver = wiredriver.Chrome(
            #         service=Service()
            #     )

        driver = webdriver.Chrome(service=Service(), options=options)
        driver.get("https://www.google.com/maps")

        logger = logging.getLogger("gatherer_service.gatherer.scraper_gatherer")

        # click accept all GDPR cookies
        try:
            accept_button = driver.find_element(By.CSS_SELECTOR, "[aria-label='Accept all']")
            accept_button.click()
        except NoSuchElementException:
            logger.info("No GPDR cookie requirements detected")
        
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
            # await self.queue.enqueue(data)
        driver.quit()
        shutil.rmtree(tmpdir)