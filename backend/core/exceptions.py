from fastapi import HTTPException, status

class BaseNIDSError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

class NotFoundError(HTTPException):
    def __init__(self, detail: str = "Item not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class ValidationException(HTTPException):
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)

class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
