from enum import Enum


class EnvironmentMode(str, Enum):
    Development = "development"
    Production = "production"
