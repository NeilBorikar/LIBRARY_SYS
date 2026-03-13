from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from ..repositories.student_repo import StudentRepository
from ..repositories.library_staff_repo import LibraryStaffRepository
from ..repositories.transaction_repo import TransactionRepository
from ..utils.fine_calculator import FineCalculator


class DashboardService:
    """Core dashboard data service"""
    
    def __init__(self):
        self.student_repo = StudentRepository()
        self.library_repo = LibraryStaffRepository()
        self.transaction_repo = TransactionRepository()
        self.fine_calculator = FineCalculator()
    
    async def get_student_dashboard(self, student_prn: str) -> Dict[str, Any]:
        """Get student-specific dashboard data"""
        try:
            # Get student's active issues
            active_issues = await self.transaction_repo.get_user_transactions(
                "student", student_prn, status="issued"
            )
            
            # Get student's returned books
            returned_books = await self.transaction_repo.get_user_transactions(
                "student", student_prn, status="returned"
            )
            
            # Calculate total fine amount
            total_fine = sum(
                transaction.get("fine_amount", 0) 
                for transaction in returned_books 
                if transaction.get("fine_amount", 0) > 0
            )
            
            # Get recent activity
            recent_activity = await self.transaction_repo.get_user_recent_activity(
                "student", student_prn, limit=10
            )
            
            return {
                "active_issues": len(active_issues),
                "total_fine_amount": total_fine,
                "currently_issued": active_issues,
                "books_returned": len(returned_books),
                "recent_activity": recent_activity,
                "last_updated": datetime.utcnow()
            }
            
        except Exception as e:
            raise Exception(f"Error fetching student dashboard: {str(e)}")
    
    async def get_library_dashboard(self) -> Dict[str, Any]:
        """Get library staff dashboard data"""
        try:
            # Get library statistics
            stats = await self.library_repo.get_library_stats()
            
            # Get overdue books
            overdue_books = await self.transaction_repo.get_overdue_books()
            
            # Get pending fines
            pending_fines = await self.transaction_repo.get_pending_fines()
            
            # Get recent activity
            recent_activity = await self.transaction_repo.get_recent_activity(limit=20)
            
            # Get defaulter students
            defaulter_students = await self.get_defaulter_students()
            
            return {
                "total_books": stats.get("total_books", 0),
                "issued_books": stats.get("issued_books", 0),
                "available_books": stats.get("available_books", 0),
                "overdue_books": len(overdue_books),
                "pending_fines": sum(fine.get("amount", 0) for fine in pending_fines),
                "recent_activity": recent_activity,
                "defaulter_students": defaulter_students,
                "last_updated": datetime.utcnow()
            }
            
        except Exception as e:
            raise Exception(f"Error fetching library dashboard: {str(e)}")
    
    async def get_college_dashboard(self) -> Dict[str, Any]:
        """Get college staff dashboard data"""
        try:
            # Get overall statistics
            library_stats = await self.library_repo.get_library_stats()
            student_stats = await self.student_repo.get_student_statistics()
            staff_stats = await self.library_repo.get_staff_statistics()
            
            # Get recent activity
            recent_activity = await self.transaction_repo.get_recent_activity(limit=15)
            
            return {
                "total_students": student_stats.get("total_students", 0),
                "total_staff": staff_stats.get("total_staff", 0),
                "total_books": library_stats.get("total_books", 0),
                "issued_books": library_stats.get("issued_books", 0),
                "available_books": library_stats.get("available_books", 0),
                "recent_activity": recent_activity,
                "last_updated": datetime.utcnow()
            }
            
        except Exception as e:
            raise Exception(f"Error fetching college dashboard: {str(e)}")
    
    async def get_global_stats(self) -> Dict[str, Any]:
        """Get global statistics for all dashboards"""
        try:
            library_stats = await self.library_repo.get_library_stats()
            student_stats = await self.student_repo.get_student_statistics()
            staff_stats = await self.library_repo.get_staff_statistics()
            
            # Get overdue books
            overdue_books = await self.transaction_repo.get_overdue_books()
            
            # Get pending fines
            pending_fines = await self.transaction_repo.get_pending_fines()
            
            return {
                "total_books": library_stats.get("total_books", 0),
                "issued_books": library_stats.get("issued_books", 0),
                "available_books": library_stats.get("available_books", 0),
                "overdue_books": len(overdue_books),
                "pending_fines": sum(fine.get("amount", 0) for fine in pending_fines),
                "total_users": student_stats.get("total_students", 0) + staff_stats.get("total_staff", 0),
                "last_updated": datetime.utcnow()
            }
            
        except Exception as e:
            raise Exception(f"Error fetching global stats: {str(e)}")
    
    async def get_defaulter_students(self) -> List[Dict[str, Any]]:
        """Get list of students with overdue books"""
        try:
            overdue_books = await self.transaction_repo.get_overdue_books()
            
            # Group by student
            defaulters = {}
            for book in overdue_books:
                if book["user_type"] == "student":
                    student_id = book["user_id"]
                    if student_id not in defaulters:
                        # Get student details
                        student = await self.student_repo.get_student_by_prn(student_id)
                        defaulters[student_id] = {
                            "student_prn": student_id,
                            "student_name": student.get("name", "Unknown") if student else "Unknown",
                            "student_email": student.get("email", "") if student else "",
                            "overdue_books": [],
                            "total_fine": 0
                        }
                    
                    defaulters[student_id]["overdue_books"].append({
                        "book_name": book["book_name"],
                        "due_date": book["due_date"],
                        "days_overdue": (datetime.utcnow() - book["due_date"]).days
                    })
                    
                    # Calculate fine for this book
                    fine = self.fine_calculator.calculate_fine(
                        book["due_date"], 
                        datetime.utcnow()
                    )
                    defaulters[student_id]["total_fine"] += fine
            
            return list(defaulters.values())
            
        except Exception as e:
            raise Exception(f"Error fetching defaulter students: {str(e)}")
    
    async def send_manual_reminder(self, student_prn: str) -> Dict[str, Any]:
        """Send manual reminder to student"""
        try:
            # Get student details
            student = await self.student_repo.get_student_by_prn(student_prn)
            if not student:
                raise ValueError("Student not found")
            
            # Get overdue books
            overdue_books = await self.transaction_repo.get_user_overdue_books(
                "student", student_prn
            )
            
            if not overdue_books:
                raise ValueError("No overdue books found for this student")
            
            # Calculate total fine
            total_fine = sum(
                self.fine_calculator.calculate_fine(
                    book["due_date"], 
                    datetime.utcnow()
                )
                for book in overdue_books
            )
            
            # Here you would integrate with email service
            # For now, we'll just log the reminder
            reminder_data = {
                "student_prn": student_prn,
                "student_name": student["name"],
                "student_email": student["email"],
                "overdue_books": overdue_books,
                "total_fine": total_fine,
                "reminder_sent_at": datetime.utcnow()
            }
            
            # Log reminder (in production, this would send email)
            await self.transaction_repo.log_reminder(reminder_data)
            
            return {
                "success": True,
                "student_email": student["email"],
                "student_name": student["name"],
                "overdue_books_count": len(overdue_books),
                "total_fine": total_fine,
                "message": f"Reminder sent successfully to {student['name']}"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# Singleton instance
dashboard_service = DashboardService()
