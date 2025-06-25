import logging

def initLogger(name: str):
    # Create a custom logger
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG) # Set logs of level "DEBUG" & above to be visible

    # Create formatter
    formatter = logging.Formatter('%(asctime)s - [%(name)s] - %(levelname)s - %(message)s')

    # Define handlers
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)

    # Add formatter to handlers
    console_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(console_handler)    

    return logger