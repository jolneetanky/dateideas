from dotenv import load_dotenv
from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from tempfile import mkdtemp
import shutil
import os

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

def run() -> None:
        options = Options()
        options.add_argument("--headless") # Run browser in the background

        # temp directory for headless chrome to run each time
        tmpdir = mkdtemp()

        options.add_argument(f"--user-data-dir={tmpdir}") # Temp file for chrome to run headlessly
        driver = webdriver.Chrome(service=Service(), options=options)
        free_proxies = get_free_proxies(driver)
        print("NEW FILE!!")
        print(free_proxies)

        driver.quit()
        shutil.rmtree(tmpdir)

def main() -> None:
    # load env variables
    load_dotenv()
    
    run()

if __name__ == '__main__':
    main()