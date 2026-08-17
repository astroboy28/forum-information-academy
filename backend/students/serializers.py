from rest_framework import serializers

from .models import AttendanceRecord, Student


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_number = serializers.CharField(source="student.student_number", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ["id", "student", "student_number", "date", "status", "note", "recorded_by", "created_at"]
        read_only_fields = ["id", "created_at", "recorded_by"]


class StudentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the paginated list view."""
    age = serializers.IntegerField(read_only=True)
    gender_display = serializers.CharField(source="get_gender_display", read_only=True)
    grade_level_display = serializers.CharField(source="get_grade_level_display", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "student_number", "call_name", "full_name", "gender",
            "gender_display", "age", "nationality", "grade_level",
            "grade_level_display", "class_name", "jlpt_level", "is_active", "photo",
        ]


class StudentDetailSerializer(serializers.ModelSerializer):
    """Full serializer for retrieve / create / update."""
    age = serializers.IntegerField(read_only=True)
    attendance_records = AttendanceRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Student
        fields = [
            "id", "user", "student_number", "call_name", "full_name", "full_name_kana",
            "gender", "birthday", "age", "nationality", "telephone_number",
            "mobile_phone_number", "email", "address", "grade_level", "department",
            "class_name", "enrollment_date", "previous_school", "jlpt_level",
            "previous_school_attendance_rate", "present_school_attendance_rate",
            "photo", "is_active", "attendance_records", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_email(self, value):
        qs = Student.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value