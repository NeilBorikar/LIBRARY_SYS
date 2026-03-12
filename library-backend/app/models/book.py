from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# ---------- REQUEST ----------

class BookCreate(BaseModel):
    book_name: str
    author: Optional[str] = None
    isbn: Optional[str] = None
    quantity: int = Field(..., ge=0)


class BookUpdateQuantity(BaseModel):
    quantity: int = Field(..., ge=0)


# ---------- RESPONSE ----------

class BookResponse(BaseModel):
    id: str
    book_name: str
    author: Optional[str]
    isbn: Optional[str]
    quantity: int
