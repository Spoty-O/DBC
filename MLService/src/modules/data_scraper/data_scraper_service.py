from src.modules.data_parser.data_parser_service import DataParser
from src.config.env_config import get_env
from github import Github
from github import Auth


class DataScraper:
    __query = '"CREATE TABLE" language:SQL'
    __github: Github
    __pagesCount: int
    __parser: DataParser

    def __init__(self, pagesCount: int = 1) -> None:
        env = get_env()
        auth = Auth.Token(env.GITHUB_TOKEN)
        self.__github = Github(auth=auth)
        self.__pagesCount = pagesCount
        self.__parser = DataParser()

    def getFilesData(self):
        filesDataList: list[str] = []
        response = self.__github.search_code(query=self.__query)
        for i in range(self.__pagesCount):
            results = response.get_page(i)
            for file in results:
                content = file.repository.get_contents(file.path)
                if isinstance(content, list):
                    continue
                decodedContent = content.decoded_content.decode()
                filesDataList.append(decodedContent)
        self.__parser.parseSqlTextToObject(filesDataList)


DataScraper().getFilesData()
