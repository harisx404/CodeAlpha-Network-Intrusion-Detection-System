"""Authentication service — credential verification and token issuance."""

from backend.core.security import create_access_token, verify_password
from backend.models.user import User
from backend.repositories import user_repo
from sqlalchemy.ext.asyncio import AsyncSession


class AuthService:
    """Handles user authentication against stored credentials."""

    async def authenticate(
        self, session: AsyncSession, username: str, password: str
    ) -> User | None:
        """Return the user if the username/password pair is valid, else None.

        Verification runs even when the user is missing to keep the response
        time roughly constant and avoid leaking which usernames exist.
        """
        user = await user_repo.get_by_username(session, username=username)
        if not user:
            # Perform a dummy hash comparison to reduce timing side-channels.
            verify_password(password, _DUMMY_HASH)
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def issue_access_token(self, user: User) -> str:
        """Create a signed access token carrying the user's id and role."""
        return create_access_token({"sub": str(user.id), "role": user.role})


# Pre-computed bcrypt hash of a throwaway value, used only for timing
# equalisation so a missing user and a wrong password take the same time.
_DUMMY_HASH = "$2b$12$kbBOUDetml/GWLPlwlFURuP/6NdtOWihH.uYFioYqDuCTlNTwC8Ji"

auth_service = AuthService()
