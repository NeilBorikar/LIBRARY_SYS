from pydantic import BaseModel
from datetime import datetime


class IssueTransactionResponse(BaseModel):
    user_type: str
    user_id: str
    book_id: str
    issue_date: datetime
    due_date: datetime
    status: str


class ReturnTransactionResponse(BaseModel):
    user_type: str
    user_id: str
    book_id: str
    return_date: datetime


class FineTransactionResponse(BaseModel):
    user_type: str
    user_id: str
    book_id: str
    amount: int
    payment_mode: str
    paid_at: datetime
