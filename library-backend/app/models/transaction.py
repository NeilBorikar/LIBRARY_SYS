from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionBase(BaseModel):
    user_id: str
    user_role: str   # student / staff
    book_id: str
    issued_at: datetime
    due_date: datetime
    returned_at: Optional[datetime] = None
    fine_amount: float = 0.0


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: str

    class Config:
        from_attributes = True
