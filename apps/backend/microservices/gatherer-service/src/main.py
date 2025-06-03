from config.logging_config import logger
from factory.factory import build_gatherers
from dotenv import load_dotenv

def main() -> None:
    # create gatherers
    gatherers = build_gatherers()

    # load env variables
    load_dotenv()

    for gatherer in gatherers:
        gatherer.gather()

if __name__ == '__main__':
    main()