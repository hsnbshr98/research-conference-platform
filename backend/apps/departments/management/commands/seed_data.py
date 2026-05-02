from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from apps.departments.models import Department
from apps.researchers.models import Researcher
from apps.conferences.models import Conference
from apps.papers.models import Paper


class Command(BaseCommand):
    help = "Seed the database with sample data for testing"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding sample data...")

        # Users
        admin_user, created = User.objects.get_or_create(
            username="adminuser",
            defaults={
                "email": "admin@gmai.com",
                "first_name": "Admin",
                "last_name": "User",
                "is_staff": True,
                "is_superuser": True,
            }
        )

        if created:
            admin_user.set_password("admin12345")
            admin_user.save()

        # Departments
        cs, _ = Department.objects.get_or_create(
            code="CS",
            defaults={
                "name": "Computer Science",
                "description": "Department focused on software engineering, AI, databases, and web systems.",
                "contact_email": "cs@gmai.com",
                "founded_date": "2018-01-10",
            }
        )

        ai, _ = Department.objects.get_or_create(
            code="AI",
            defaults={
                "name": "Artificial Intelligence",
                "description": "Department focused on machine learning, robotics, and intelligent systems.",
                "contact_email": "ai@gmai.com",
                "founded_date": "2020-03-15",
            }
        )

        se, _ = Department.objects.get_or_create(
            code="SE",
            defaults={
                "name": "Software Engineering",
                "description": "Department focused on software design, testing, and project development.",
                "contact_email": "se@gmai.com",
                "founded_date": "2019-06-20",
            }
        )

        # Researchers
        r1, _ = Researcher.objects.get_or_create(
            email="chaza.researcher@gmai.com",
            defaults={
                "first_name": "Chaza",
                "last_name": "Mokdad",
                "department": cs,
                "date_of_birth": "2002-05-12",
                "academic_rank": "Student",
            }
        )

        r2, _ = Researcher.objects.get_or_create(
            email="hussein.researcher@gmai.com",
            defaults={
                "first_name": "Hussein",
                "last_name": "bash",
                "department": ai,
                "date_of_birth": "2001-09-08",
                "academic_rank": "Research Assistant",
            }
        )

        r3, _ = Researcher.objects.get_or_create(
            email="hello.researcher@gmai.com",
            defaults={
                "first_name": "Hello",
                "last_name": "World",
                "department": se,
                "date_of_birth": "2002-02-18",
                "academic_rank": "Student",
            }
        )

        # Conferences
        conf1, _ = Conference.objects.get_or_create(
            name="International Conference on AI Research",
            defaults={
                "location": "Beirut",
                "description": "A conference discussing AI applications, research systems, and intelligent tools.",
                "contact_email": "ai.conf@gmai.com",
                "start_date": "2026-05-10",
                "end_date": "2026-05-12",
            }
        )
        conf1.organizers.set([r2])
        conf1.attendees.set([r1, r3])

        conf2, _ = Conference.objects.get_or_create(
            name="Web Systems and Django Conference",
            defaults={
                "location": "Tripoli",
                "description": "A technical conference about Django, Angular, databases, and backend systems.",
                "contact_email": "web.conf@gmai.com",
                "start_date": "2026-06-01",
                "end_date": "2026-06-03",
            }
        )
        conf2.organizers.set([r1])
        conf2.attendees.set([r2, r3])

        # Papers
        paper1, _ = Paper.objects.get_or_create(
            title="AI-Based Research Paper Management System",
            defaults={
                "abstract": "This paper presents a web-based system for organizing researchers, conferences, and academic papers.",
                "keywords": "AI, Django, Angular, Research",
                "conference": conf1,
                "corresponding_email": "chaza.researcher@gmai.com",
                "publication_date": "2026-05-11",
                "status": "Published",
            }
        )
        paper1.authors.set([r1, r2])

        paper2, _ = Paper.objects.get_or_create(
            title="Using Django and Angular for Academic Platforms",
            defaults={
                "abstract": "This paper explains how Django and Angular can be used together to build academic web platforms.",
                "keywords": "Django, Angular, API, Web",
                "conference": conf2,
                "corresponding_email": "hussein.researcher@gmai.com",
                "publication_date": "2026-06-02",
                "status": "Submitted",
            }
        )
        paper2.authors.set([r1, r3])

        self.stdout.write(self.style.SUCCESS("Sample data seeded successfully."))