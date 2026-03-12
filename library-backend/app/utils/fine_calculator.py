from datetime import datetime, timedelta
from typing import Union

class FineCalculator:
    """Utility class for calculating library fines"""
    
    FINE_PER_DAY = 5.0  # ₹5 per day for late returns
    DAMAGE_FINE = 100.0  # ₹100 for damaged books
    LOST_FINE = 500.0    # ₹500 for lost books
    
    @staticmethod
    def calculate_fine(due_date: Union[datetime, str], return_date: Union[datetime, str] = None) -> float:
        """
        Calculate fine amount based on due date and return date
        
        Args:
            due_date: The due date for the book
            return_date: The actual return date (defaults to current date if not provided)
            
        Returns:
            float: Fine amount in rupees
        """
        if isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        
        if return_date is None:
            return_date = datetime.now()
        elif isinstance(return_date, str):
            return_date = datetime.fromisoformat(return_date.replace('Z', '+00:00'))
        
        # Calculate days overdue
        days_overdue = (return_date - due_date).days
        
        if days_overdue <= 0:
            return 0.0
        
        return float(days_overdue * FineCalculator.FINE_PER_DAY)
    
    @staticmethod
    def calculate_damage_fine() -> float:
        """Calculate damage fine"""
        return FineCalculator.DAMAGE_FINE
    
    @staticmethod
    def calculate_lost_fine() -> float:
        """Calculate lost book fine"""
        return FineCalculator.LOST_FINE
    
    @staticmethod
    def get_fine_breakdown(due_date: Union[datetime, str], return_date: Union[datetime, str] = None) -> dict:
        """
        Get detailed breakdown of fine calculation
        
        Args:
            due_date: The due date for the book
            return_date: The actual return date
            
        Returns:
            dict: Detailed fine breakdown
        """
        if isinstance(due_date, str):
            due_date = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
        
        if return_date is None:
            return_date = datetime.now()
        elif isinstance(return_date, str):
            return_date = datetime.fromisoformat(return_date.replace('Z', '+00:00'))
        
        days_overdue = max(0, (return_date - due_date).days)
        fine_amount = FineCalculator.calculate_fine(due_date, return_date)
        
        return {
            "due_date": due_date.isoformat(),
            "return_date": return_date.isoformat(),
            "days_overdue": days_overdue,
            "fine_per_day": FineCalculator.FINE_PER_DAY,
            "total_fine": fine_amount,
            "fine_type": "late_return" if days_overdue > 0 else "no_fine"
        }
    
    @staticmethod
    def get_reminder_thresholds() -> dict:
        """Get reminder thresholds in days"""
        return {
            "due_soon": 2,  # 2 days before due date
            "overdue": 0,   # On due date and after
            "high_fine": 100.0  # Alert when fine exceeds ₹100
        }
