from app.database import transactions_collection


class AdminRepository:
    def get_daily_transactions(self, date):
        return list(
            transactions_collection.find(
                {"timestamp": {"$gte": date}}
            )
        )
