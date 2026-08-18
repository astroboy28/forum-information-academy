from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Student


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        student = Student.objects.filter(user=user).first()
        return Response({
            "id": user.id,
            "username": user.username,
            "is_staff": user.is_staff,
            "role": "admin" if user.is_staff else "student",
            "student_id": str(student.id) if student else None,
        })