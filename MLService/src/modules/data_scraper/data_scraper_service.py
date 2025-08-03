import asyncio
from tqdm.asyncio import tqdm
from config.env_config import get_env
from github import Github, Auth
from github.PaginatedList import PaginatedList
from github.ContentFile import ContentFile


class DataScraperService:
    _query = "CREATE TABLE"
    _github: Github
    _paginatedList: PaginatedList[ContentFile]

    def __init__(self) -> None:
        env = get_env()
        auth = Auth.Token(env.GITHUB_TOKEN)
        self._github = Github(auth=auth, per_page=1000)
        self.size = 100

    def _fetchPaginatedPages(self):
        try:
            paginatedList = self._github.search_code(
                query=self._query, order="desc", language="SQL", size=f">{self.size}"
            )
            self.size += 50
            return paginatedList
        except Exception as e:
            raise Exception(f"Error getting paginated pages: {e}")

    def _fetchPage(self, paginatedList: PaginatedList[ContentFile], pageNum: int):
        try:
            page = paginatedList.get_page(pageNum)
            return page
        except Exception as e:
            raise Exception(f"Error fetching page {pageNum}: {e}")

    def _fetchFileData(self, file: ContentFile):
        try:
            content = file.repository.get_contents(path=file.path)
        except Exception as e:
            raise Exception(f"Error getting file content: {e}")
        if isinstance(content, list):
            raise Exception("Wrong content")
        return content.decoded_content.decode()

    def _fetchFileDataInBatchesWithProgress(self, totalPages: int):
        pbar = tqdm(total=totalPages, desc="Fetching pages")
        page = 10
        while page < totalPages:
            paginatedList = self._fetchPaginatedPages()
            for pageNum in range(9):
                if page >= totalPages:
                    break
                data = self._fetchPage(paginatedList=paginatedList, pageNum=pageNum)
                for file in data:
                    yield self._fetchFileData(file=file)
                pbar.update(1)
                page += 1
        pbar.close()

    def getFilesData(self, totalPages: int = 100):
        return self._fetchFileDataInBatchesWithProgress(totalPages)
