from datetime import datetime, timedelta
from typing import Dict, Any, List
import re


class DataValidators:
    """Utility class for data validation"""
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number (Indian format)"""
        pattern = r'^[6-9]\d{9}$'
        return re.match(pattern, phone.replace(" ", "").replace("-", "")) is not None
    
    @staticmethod
    def validate_prn(prn: str) -> bool:
        """Validate PRN format"""
        if not prn or len(prn) < 5:
            return False
        return prn.replace(" ", "").isalnum()
    
    @staticmethod
    def validate_staff_id(staff_id: str) -> bool:
        """Validate staff ID format"""
        if not staff_id or len(staff_id) < 3:
            return False
        return staff_id.replace(" ", "").isalnum()
    
    @staticmethod
    def validate_password(password: str) -> bool:
        """Validate password strength"""
        if len(password) < 6:
            return False
        return True
    
    @staticmethod
    def validate_book_name(book_name: str) -> bool:
        """Validate book name"""
        if not book_name or len(book_name.strip()) < 2:
            return False
        return len(book_name.strip()) <= 200
    
    @staticmethod
    def validate_isbn(isbn: str) -> bool:
        """Validate ISBN format"""
        if not isbn:
            return True  # ISBN is optional
        
        # Remove hyphens and spaces
        clean_isbn = isbn.replace("-", "").replace(" ", "")
        
        # ISBN-10 or ISBN-13
        return len(clean_isbn) == 10 or len(clean_isbn) == 13
    
    @staticmethod
    def validate_quantity(quantity: int) -> bool:
        """Validate book quantity"""
        return isinstance(quantity, int) and quantity > 0 and quantity <= 1000
    
    @staticmethod
    def validate_date_range(issue_date: datetime, due_date: datetime) -> bool:
        """Validate date range for book issue"""
        if not isinstance(issue_date, datetime) or not isinstance(due_date, datetime):
            return False
        
        # Due date should be after issue date
        if due_date <= issue_date:
            return False
        
        # Issue date should not be too far in the past (max 30 days)
        if issue_date < datetime.utcnow() - timedelta(days=30):
            return False
        
        # Due date should not be too far in the future (max 1 year)
        if due_date > datetime.utcnow() + timedelta(days=365):
            return False
        
        return True
    
    @staticmethod
    def validate_user_type(user_type: str) -> bool:
        """Validate user type"""
        valid_types = ["student", "staff", "library", "admin"]
        return user_type in valid_types
    
    @staticmethod
    def validate_fine_amount(amount: float) -> bool:
        """Validate fine amount"""
        return isinstance(amount, (int, float)) and amount >= 0 and amount <= 10000


class DataFormatters:
    """Utility class for data formatting"""
    
    @staticmethod
    def format_date(date: datetime, format_str: str = "%Y-%m-%d") -> str:
        """Format datetime to string"""
        if not isinstance(date, datetime):
            return ""
        return date.strftime(format_str)
    
    @staticmethod
    def format_datetime(date: datetime) -> str:
        """Format datetime to readable string"""
        if not isinstance(date, datetime):
            return ""
        return date.strftime("%Y-%m-%d %H:%M:%S")
    
    @staticmethod
    def format_currency(amount: float, currency: str = "₹") -> str:
        """Format currency amount"""
        if not isinstance(amount, (int, float)):
            return f"{currency}0.00"
        return f"{currency}{amount:.2f}"
    
    @staticmethod
    def format_phone(phone: str) -> str:
        """Format phone number"""
        if not phone:
            return ""
        
        clean_phone = phone.replace(" ", "").replace("-", "")
        if len(clean_phone) == 10 and clean_phone.isdigit():
            return f"+91 {clean_phone[:5]} {clean_phone[5:]}"
        
        return phone
    
    @staticmethod
    def format_name(name: str) -> str:
        """Format person name (proper case)"""
        if not name:
            return ""
        return " ".join(word.capitalize() for word in name.strip().split())
    
    @staticmethod
    def format_book_title(title: str) -> str:
        """Format book title (title case)"""
        if not title:
            return ""
        
        # Title case with exceptions
        exceptions = ["a", "an", "the", "and", "but", "or", "for", "nor", "on", "at", "to", "from", "by"]
        words = title.lower().split()
        
        formatted_words = []
        for i, word in enumerate(words):
            if i == 0 or word not in exceptions:
                formatted_words.append(word.capitalize())
            else:
                formatted_words.append(word)
        
        return " ".join(formatted_words)
    
    @staticmethod
    def truncate_text(text: str, max_length: int = 50) -> str:
        """Truncate text with ellipsis"""
        if not text or len(text) <= max_length:
            return text
        return text[:max_length] + "..."
    
    @staticmethod
    def format_user_type(user_type: str) -> str:
        """Format user type for display"""
        type_map = {
            "student": "Student",
            "staff": "College Staff",
            "library": "Library Staff",
            "admin": "Administrator"
        }
        return type_map.get(user_type, user_type.title())


class ResponseHelpers:
    """Utility class for API response formatting"""
    
    @staticmethod
    def success_response(data: Any = None, message: str = "Success") -> Dict[str, Any]:
        """Format success response"""
        response = {
            "success": True,
            "message": message
        }
        if data is not None:
            response["data"] = data
        return response
    
    @staticmethod
    def error_response(message: str, error_code: str = None) -> Dict[str, Any]:
        """Format error response"""
        response = {
            "success": False,
            "error": message
        }
        if error_code:
            response["error_code"] = error_code
        return response
    
    @staticmethod
    def paginated_response(
        items: List[Any], 
        page: int, 
        page_size: int, 
        total: int
    ) -> Dict[str, Any]:
        """Format paginated response"""
        return {
            "success": True,
            "data": items,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "total_pages": (total + page_size - 1) // page_size,
                "has_next": page * page_size < total,
                "has_prev": page > 1
            }
        }


# Singleton instances
validators = DataValidators()
formatters = DataFormatters()
response_helpers = ResponseHelpers()
