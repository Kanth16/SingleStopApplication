import logging
import os.path
from logging.handlers import TimedRotatingFileHandler
def logger():
    try:
        formatter = logging.Formatter("%(asctime)s - %(process)d %(levelname)s - %(message)s")
        handler = TimedRotatingFileHandler(filename=os.path.join(os.path.dirname(os.path.dirname(__file__)),'logs','student.log'), when="s", interval=60, encoding='utf8')
        handler.suffix = "%Y-%m-%d_%H-%M-%S.log"
        handler.setFormatter(formatter)
        logger = logging.getLogger()
        logger.setLevel(logging.DEBUG)
        logger.addHandler(handler)
        return logger
    except Exception as e:
        return False