import json
from fastapi import FastAPI
from modules.BR_describer.BR_describer_service import BRDescriberService
from modules.data_parser.data_parser_module import DataParserModule
from modules.data_scraper.data_scraper_service import DataScraperService
from config.env_config import EnvironmentConfig, get_env
import uvicorn

from modules.dataset_manager.dataset_manager_service import DatasetManagerService


def main():
    # app = FastAPI()
    #     env: EnvironmentConfig = get_env()
    #     uvicorn.run(app=app, port=env.ML_PORT, reload=env.isDevMode)
    scraper = DataScraperService()
    parser = DataParserModule().service
    datasetManager = DatasetManagerService()
    describer = BRDescriberService()
    for sql in scraper.getFilesData(150):
        parsedList = parser.parse(sql)
        if len(parsedList) < 1:
            continue
        query = [describer.describe(parsed) for parsed in parsedList]
        datasetManager.save(
            "data.csv",
            {"description": [" ".join(query)], "object": [json.dumps(parsedList, ensure_ascii=False)]},
            "a",
        )


if __name__ == "__main__":
    main()
