from tqdm import tqdm
from modules.data_parser.data_parser_service import DataParserService
from config.env_config import get_env
from github import Github, Auth
from github.PaginatedList import PaginatedList
from github.ContentFile import ContentFile


class DataScraperService:
    __query = '"CREATE TABLE" language:SQL'
    __github: Github
    __paginatedList: PaginatedList[ContentFile]

    def __init__(self) -> None:
        env = get_env()
        auth = Auth.Token(env.GITHUB_TOKEN)
        self.__github = Github(auth=auth)
        self.__paginatedList = self.__github.search_code(self.__query)

    async def getFilesDataByPage(self, page: int) -> list[str]:
        filesDataList: list[str] = []
        try:
            results = self.__paginatedList.get_page(page)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            return filesDataList
        for file in results:
            try:
                content = file.repository.get_contents(file.path)
            except Exception as e:
                print(f"Error getting file content: {e}")
                continue
            if isinstance(content, list):
                continue
            decodedContent = content.decoded_content.decode()
            filesDataList.append(decodedContent)
        return filesDataList

    async def getFilesData(self):
        for i in tqdm(range(100)):

