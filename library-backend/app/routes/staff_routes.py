from fastapi import APIRouter, HTTPException, status
from app.repositories.staff_repo import StaffRepository
from app.models.staff import StaffCreate, StaffResponse

router = APIRouter(prefix="/staff", tags=["Staff"])

staff_repo = StaffRepository()


@router.post("/register", response_model=StaffResponse)
def register_staff(staff: StaffCreate):
    try:
        staff_id = staff_repo.create_staff(staff.dict())
        created_staff = staff_repo.find_by_id(staff_id)
        created_staff["id"] = str(created_staff["_id"])
        return created_staff
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff(staff_id: str):
    staff = staff_repo.find_by_id(staff_id)
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found"
        )
    staff["id"] = str(staff["_id"])
    return staff


@router.post("/{staff_id}/deposit-paid")
def mark_deposit_paid(staff_id: str):
    success = staff_repo.mark_deposit_paid(staff_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff not found"
        )
    return {"message": "Security deposit marked as paid"}
