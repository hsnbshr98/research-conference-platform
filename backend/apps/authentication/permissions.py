from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnlyAuthenticated(BasePermission):
    """
    Logged-in users can view.
    Only admin/staff can create, update, or delete.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return request.user.is_staff


class IsResearcherOwnerOrAdmin(BasePermission):
    """
    Logged-in users can view researcher profiles.
    Admin can edit/delete all profiles.
    Normal users can edit/delete only their own researcher profile.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_staff:
            return True

        return obj.user == request.user


class IsPaperAuthorOrAdmin(BasePermission):
    """
    Logged-in users can view papers.
    Admin can edit/delete all papers.
    Researchers can edit/delete only papers where they are an author.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        if request.user.is_staff:
            return True

        return obj.authors.filter(user=request.user).exists()