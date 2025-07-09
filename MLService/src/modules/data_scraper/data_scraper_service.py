import asyncio
import time
from tqdm.asyncio import tqdm
from modules.data_parser.data_parser_service import DataParserService
from config.env_config import get_env
from github import Github, Auth
from github.PaginatedList import PaginatedList
from github.ContentFile import ContentFile


class DataScraperService:
    _query = '"CREATE TABLE" language:SQL'
    _github: Github
    _paginatedList: PaginatedList[ContentFile]
    _batchSize: int

    def __init__(self) -> None:
        env = get_env()
        auth = Auth.Token(env.GITHUB_TOKEN)
        self._github = Github(auth=auth)
        self._paginatedList = self._github.search_code(self._query)
        self._batchSize: int = 9

    async def _fetchPage(self, pageNum: int):
        try:
            page = await asyncio.to_thread(self._paginatedList.get_page, pageNum)
            return page
        except Exception as e:
            print(f"Error fetching page {pageNum}: {e}")
            raise Exception(f"Error fetching page {pageNum}: {e}")

    async def _fetchFileData(self, file: ContentFile):
        try:
            content = await asyncio.to_thread(file.repository.get_contents, file.path)
        except Exception as e:
            print(f"Error getting file content: {e}")
            raise Exception(f"Error getting file content: {e}")
        if isinstance(content, list):
            raise Exception("Wrong content")
        return content.decoded_content.decode()

    async def _fetchFilesDataByPage(self, page: int) -> list[str]:
        filesDataList: list[str] = []
        data = await self._fetchPage(pageNum=page)
        for file in data:
            filesDataList.append(await self._fetchFileData(file=file))
        return filesDataList

    async def _fetchFileDataBatchWithProgress(self, startPage: int, endPage: int):
        results: list[str] = []
        tasks = [self._fetchFilesDataByPage(i) for i in range(startPage, endPage)]
        pbar = tqdm(total=len(tasks), desc="Fetching pages")
        for task in asyncio.as_completed(tasks):
            results.extend(await task)
            pbar.update(1)
        pbar.close()
        return results

    async def _fetchFileDataInBatches(self, totalPages: int):
        for startPage in range(0, totalPages, self._batchSize):
            endPage = min(startPage + self._batchSize, totalPages)
            print(f"Processing pages {startPage} to {endPage - 1}")
            batch_results = await self._fetchFileDataBatchWithProgress(
                startPage, endPage
            )
            if endPage <= totalPages:
                yield batch_results
                print(f"Waiting 60 seconds before next batch...")
                await asyncio.sleep(60)

    async def getFilesData(self, totalPages: int = 100):
        return self._fetchFileDataInBatches(totalPages)
