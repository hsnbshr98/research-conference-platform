from rest_framework import viewsets, filters
from .models import Department
from .serializers import DepartmentSerializer
from apps.authentication.permissions import IsAdminOrReadOnlyAuthenticated
#from rest_framework.permissions import IsAuthenticatedOrReadOnly

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminOrReadOnlyAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'code', 'contact_email']
    ordering_fields = ['name', 'code', 'founded_date']