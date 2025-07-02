from pydantic_settings import BaseSettings, SettingsConfigDict
from src.shared.types.env_type import EnvironmentMode
from functools import lru_cache


class EnvironmentConfig(BaseSettings):
    NODE_ENV: EnvironmentMode
    ML_PORT: int
    GITHUB_TOKEN: str

    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    @property
    def isDevMode(self) -> bool:
        return self.NODE_ENV == EnvironmentMode.Development


@lru_cache
def get_env():
    return EnvironmentConfig.model_validate({})
