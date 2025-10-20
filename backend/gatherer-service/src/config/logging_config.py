import logging

# Create or get the logger
logger = logging.getLogger("gatherer_service")
logger.setLevel(logging.DEBUG)

# Prevent multiple handlers if the logger is configured multiple times
if not logger.handlers:
    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.DEBUG)

    # Define log format
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)

    # Add handlers to logger
    logger.addHandler(stream_handler)