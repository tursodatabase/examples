from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(100))
    user_name: Mapped[str] = mapped_column(String(50), unique=True)
    delete_id: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[int]
    links: Mapped[List["Link"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    def __repr__(self) -> str:
        return f"Question(id={self.id!r}, email={self.email!r}, full_name={self.full_name!r}, user_name={self.user_name!r}, created_at={self.created_at})"

class Link(Base):
    __tablename__ = "links"
    id: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete='CASCADE'))
    website: Mapped[str] = mapped_column(String(100))
    link: Mapped[str]
    created_at: Mapped[int]
    user: Mapped["User"] = relationship(back_populates="links")
    def __repr__(self) -> str:
        return f"Choice(id={self.id!r}, user_id={self.user_id!r}, website={self.website!r}, link={self.link!r}, created_at={self.created_at!r})"