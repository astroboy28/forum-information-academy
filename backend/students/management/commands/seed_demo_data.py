import random
from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from students.models import AttendanceRecord, Student

User = get_user_model()

FIRST_NAMES = ["Oshadha", "Kenji", "Maria", "Linh", "Arjun", "Yuki", "Carlos", "Fatima"]
LAST_NAMES = ["Paranamana", "Tanaka", "Santos", "Nguyen", "Sharma", "Sato", "Reyes", "Khan"]
NATIONALITIES = ["Sri Lanka", "Japan", "Philippines", "Vietnam", "India", "Nepal", "Indonesia"]
DEPARTMENTS = ["Information & Software / Global IT Course", "Business & IT Course"]
JLPT = ["NONE", "N5", "N4", "N3", "N2", "N1"]


class Command(BaseCommand):
    help = "Seed demo students and attendance records."

    def add_arguments(self, parser):
        parser.add_argument("--count", type=int, default=25)

    def handle(self, *args, **options):
        count = options["count"]
        created_count = 0
        for i in range(1, count + 1):
            student_number = f"2025{i:03d}"
            if Student.objects.filter(student_number=student_number).exists():
                continue
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            birth_year = random.randint(1998, 2007)
            Student.objects.create(
                student_number=student_number,
                call_name=first,
                full_name=f"{last.upper()} {first.upper()}",
                gender=random.choice(["M", "F"]),
                birthday=date(birth_year, random.randint(1, 12), random.randint(1, 28)),
                nationality=random.choice(NATIONALITIES),
                telephone_number="025-000-0000",
                mobile_phone_number="090-0000-0000",
                email=f"{first.lower()}.{last.lower()}{i}@example.com",
                address="Niigata, Japan",
                grade_level=random.choice(["1", "2", "3"]),
                department=random.choice(DEPARTMENTS),
                class_name=random.choice(["2-A", "2-B", "3-A"]),
                enrollment_date=date(2025, 4, 1),
                previous_school="Sample Senior High School",
                jlpt_level=random.choice(JLPT),
                previous_school_attendance_rate=round(random.uniform(85, 100), 2),
                present_school_attendance_rate=round(random.uniform(85, 100), 2),
            )
            created_count += 1
        self.stdout.write(self.style.SUCCESS(f"Seeded {created_count} students."))