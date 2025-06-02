from config.logging_config import logger
from factory.factory import build_gatherers

def main() -> None:
    # create gatherers
    gatherers = build_gatherers()

    for gatherer in gatherers:
        gatherer.gather()

if __name__ == '__main__':
    main()