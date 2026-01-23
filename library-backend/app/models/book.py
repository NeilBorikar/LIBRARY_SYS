from pydantic import BaseModel, Field
from datetime import datetime


class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    total_copies: int = Field(..., ge=1)
    available_copies: int = Field(..., ge=0)


class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
