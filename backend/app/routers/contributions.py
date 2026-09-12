from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contribution, Member, Task
from app.schemas import ContributionResponse, ContributionCreate
from app.services.attribution import SCORE_WEIGHTS

router = APIRouter(prefix="/api/contributions", tags=["Contributions Ledger"])

@router.get("", response_model=List[ContributionResponse])
def get_contributions(
    member_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: Optional[int] = Query(100),
    db: Session = Depends(get_db)
):
    query = db.query(Contribution)

    if member_id and member_id != "ALL":
        query = query.filter(Contribution.member_id == member_id)
    if category and category != "ALL":
        query = query.filter(Contribution.category == category)
    if level and level != "ALL":
        query = query.filter(Contribution.level == level)
    if search:
        query = query.filter(
            Contribution.title.ilike(f"%{search}%") |
            Contribution.id.ilike(f"%{search}%") |
            Contribution.category.ilike(f"%{search}%")
        )

    contributions = query.order_by(Contribution.created_at.desc()).limit(limit).all()
    return contributions

@router.post("", response_model=ContributionResponse)
def create_contribution(payload: ContributionCreate, db: Session = Depends(get_db)):
    member = db.query(Member).filter(Member.id == payload.member_id).first()
    if not member:
        raise HTTPException(status_code=400, detail="Member not found")

    cid = payload.id
    if not cid:
        count = db.query(Contribution).count()
        cid = f"C-{count + 1:02d}"

    if db.query(Contribution).filter(Contribution.id == cid).first():
        cid = f"C-{int(datetime.utcnow().timestamp()) % 10000}"

    points = payload.points
    if not points:
        points = SCORE_WEIGHTS.get(payload.level or "Medium", 2)

    contrib = Contribution(
        id=cid,
        member_id=payload.member_id,
        task_id=payload.task_id,
        title=payload.title,
        category=payload.category or "Development",
        level=payload.level or "Medium",
        hours=payload.hours or 2.0,
        points=points,
        verified=payload.verified if payload.verified is not None else True,
        time_label="Just now",
        date=payload.date or datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(contrib)
    db.commit()
    db.refresh(contrib)
    return contrib

@router.put("/{contrib_id}", response_model=ContributionResponse)
def update_contribution(contrib_id: str, payload: ContributionCreate, db: Session = Depends(get_db)):
    contrib = db.query(Contribution).filter(Contribution.id == contrib_id).first()
    if not contrib:
        raise HTTPException(status_code=404, detail="Contribution not found")

    contrib.title = payload.title
    contrib.member_id = payload.member_id
    contrib.task_id = payload.task_id
    contrib.category = payload.category or contrib.category
    contrib.level = payload.level or contrib.level
    contrib.hours = payload.hours or contrib.hours
    contrib.points = payload.points or SCORE_WEIGHTS.get(contrib.level, 2)
    contrib.verified = payload.verified if payload.verified is not None else contrib.verified

    db.commit()
    db.refresh(contrib)
    return contrib

@router.delete("/{contrib_id}")
def delete_contribution(contrib_id: str, db: Session = Depends(get_db)):
    contrib = db.query(Contribution).filter(Contribution.id == contrib_id).first()
    if not contrib:
        raise HTTPException(status_code=404, detail="Contribution not found")

    db.delete(contrib)
    db.commit()
    return {"success": True, "message": f"Contribution {contrib_id} deleted"}
