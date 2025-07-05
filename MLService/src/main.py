import asyncio
from fastapi import FastAPI

from modules.data_scraper.data_scraper_service import DataScraperService
from modules.file_manager.file_manager_service import FileManagerService
from config.env_config import EnvironmentConfig, get_env
import uvicorn


async def main():
    for e in DataScraperService().getFilesData():
        FileManagerService().save("stash.txt", e)


# app = FastAPI()

if __name__ == "__main__":
    #     env: EnvironmentConfig = get_env()
    #     uvicorn.run(app=app, port=env.ML_PORT, reload=env.isDevMode)
    asyncio.run(main())
