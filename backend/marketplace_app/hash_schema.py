from pydantic import BaseModel
from schemas import UserResponse

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None

class UserInDB(UserResponse):
    hashed_password: str