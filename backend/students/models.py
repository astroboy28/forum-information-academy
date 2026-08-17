import uuid
from datetime import date

from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models


phone_validator = RegexValidator(
    regex=r"^\+?[0-9\-() ]{7,20}$",
    message="Enter a valid phone number (digits, spaces, +, -, () allowed).",
)


class Student(models.Model):
    class Gender(models.TextChoices):
        MALE = "M", "Male"
        FEMALE = "F", "Female"
        OTHER = "O", "Other / Prefer not to say"

    class JLPTLevel(models.TextChoices):
        NONE = "NONE", "Not taken"
        N5 = "N5", "N5"
        N4 = "N4", "N4"
        N3 = "N3", "N3"
        N2 = "N2", "N2"
        N1 = "N1", "N1"

    class GradeLevel(models.TextChoices):
        YEAR_1 = "1", "1st Year"
        YEAR_2 = "2", "2nd Year"
        YEAR_3 = "3", "3rd Year"
        YEAR_4 = "4", "4th Year"
        GRADUATE = "G", "Graduate"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Linked login account - filled in once the student is issued a portal login (Session 17+).
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="student_profile",
    )

    # --- Identity -----------------------------------------------------
    student_number = models.CharField(max_length=20, unique=True, db_index=True)
    call_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200)
    full_name_kana = models.CharField(max_length=200, blank=True)
    gender = models.CharField(max_length=1, choices=Gender.choices)
    birthday = models.DateField()
    nationality = models.CharField(max_length=100)

    # --- Contact --------------------------------------------------------
    telephone_number = models.CharField(max_length=20, blank=True, validators=[phone_validator])
    mobile_phone_number = models.CharField(max_length=20, blank=True, validators=[phone_validator])
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=255, blank=True)

    # --- Academic placement --------------------------------------------
    grade_level = models.CharField(max_length=1, choices=GradeLevel.choices)
    department = models.CharField(max_length=150, blank=True)
    class_name = models.CharField(max_length=20, blank=True)
    enrollment_date = models.DateField()
    previous_school = models.CharField(max_length=200, blank=True)

    # --- JLPT ------------------------------------------------------------
    jlpt_level = models.CharField(max_length=4, choices=JLPTLevel.choices, default=JLPTLevel.NONE)

    # --- Attendance summaries --------------------------------------------
    previous_school_attendance_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    present_school_attendance_rate = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )

    # --- Photo -------------------------------------------------------------
    photo = models.ImageField(upload_to="student_photos/", blank=True, null=True)

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["student_number"]

    def __str__(self):
        return f"{self.student_number} {self.call_name}"

    @property
    def age(self) -> int:
        today = date.today()
        return (
            today.year - self.birthday.year
            - ((today.month, today.day) < (self.birthday.month, self.birthday.day))
        )


class AttendanceRecord(models.Model):
    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        LATE = "LATE", "Late"
        EXCUSED = "EXCUSED", "Excused"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices)
    note = models.CharField(max_length=255, blank=True)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]
        unique_together = ("student", "date")

    def __str__(self):
        return f"{self.student.student_number} - {self.date} - {self.status}"