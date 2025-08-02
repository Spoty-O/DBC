import json
from fastapi import FastAPI
from modules.BR_describer.BR_describer_service import BRDescriberService
from modules.data_parser.data_parser_module import DataParserModule
from modules.file_manager.file_manager_service import FileManagerService
from config.env_config import EnvironmentConfig, get_env
import uvicorn


def main():
    # app = FastAPI()
    #     env: EnvironmentConfig = get_env()
    #     uvicorn.run(app=app, port=env.ML_PORT, reload=env.isDevMode)
    parser = DataParserModule().service
    fileManager = FileManagerService()
    text = fileManager.read('stash.txt')
    res = parser.parse(text)
    BRDescriberService().parse(res[0])



if __name__ == "__main__":
    main()
