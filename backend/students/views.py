from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response

from .filters import StudentFilter
from .models import AttendanceRecord, Student
from .permissions import IsAdminOrOwnStudentReadOnly, IsStaffUser
from .serializers import (
    AttendanceRecordSerializer,
    StudentDetailSerializer,
    StudentListSerializer,
)


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrOwnStudentReadOnly]
    filterset_class = StudentFilter
    search_fields = ["student_number", "call_name", "full_name", "full_name_kana", "email", "nationality"]
    ordering_fields = ["student_number", "call_name", "birthday", "grade_level", "enrollment_date", "jlpt_level"]
    ordering = ["student_number"]

    def get_permissions(self):
        if self.action == "upload_photo":
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        qs = Student.objects.all().prefetch_related("attendance_records")
        user = self.request.user
        return qs if user.is_staff else qs.filter(user=user)

    def get_serializer_class(self):
        return StudentListSerializer if self.action == "list" else StudentDetailSerializer

    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request):
        student = Student.objects.filter(user=request.user).first()
        if not student:
            return Response({"detail": "No linked student record."}, status=404)
        return Response(StudentDetailSerializer(student).data)

    @action(detail=True, methods=["post"], url_path="photo", parser_classes=[MultiPartParser, FormParser])
    def upload_photo(self, request, pk=None):
        student = self.get_object()
        if not request.user.is_staff and student.user_id != request.user.id:
            return Response({"detail": "You may only update your own photo."}, status=status.HTTP_403_FORBIDDEN)
        photo = request.FILES.get("photo")
        if not photo:
            return Response({"detail": "No photo file provided."}, status=status.HTTP_400_BAD_REQUEST)
        student.photo = photo
        student.save(update_fields=["photo", "updated_at"])
        return Response(StudentDetailSerializer(student).data)


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    filterset_fields = ["student", "status", "date"]
    ordering_fields = ["date"]
    ordering = ["-date"]

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsStaffUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = AttendanceRecord.objects.select_related("student")
        user = self.request.user
        return qs if user.is_staff else qs.filter(student__user=user)

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user)