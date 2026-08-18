from rest_framework import permissions


class IsAdminOrOwnStudentReadOnly(permissions.BasePermission):
    """Staff get full CRUD on every student. A regular user may only READ
    their own linked Student record."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.method not in permissions.SAFE_METHODS:
            return False
        return getattr(obj, "user_id", None) == request.user.id


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)