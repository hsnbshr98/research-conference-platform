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

        # =========================
        # USERS
        # =========================

        admin_user, created = User.objects.get_or_create(
            username="adminuser",
            defaults={
                "email": "admin@gmail.com",
                "first_name": "Admin",
                "last_name": "User",
                "is_staff": True,
                "is_superuser": True,
            }
        )
        if created:
            admin_user.set_password("admin12345")
            admin_user.save()

        user1, created = User.objects.get_or_create(
            username="maya",
            defaults={
                "email": "maya.hassan@example.com",
                "first_name": "Maya",
                "last_name": "Hassan",
            }
        )
        if created:
            user1.set_password("user12345")
            user1.save()

        user2, created = User.objects.get_or_create(
            username="omar",
            defaults={
                "email": "omar.khaled@example.com",
                "first_name": "Omar",
                "last_name": "Khaled",
            }
        )
        if created:
            user2.set_password("user12345")
            user2.save()

        user3, created = User.objects.get_or_create(
            username="sara",
            defaults={
                "email": "sara.nasser@example.com",
                "first_name": "Sara",
                "last_name": "Nasser",
            }
        )
        if created:
            user3.set_password("user12345")
            user3.save()

        user4, created = User.objects.get_or_create(
            username="ali",
            defaults={
                "email": "ali.mansour@example.com",
                "first_name": "Ali",
                "last_name": "Mansour",
            }
        )
        if created:
            user4.set_password("user12345")
            user4.save()

        user5, created = User.objects.get_or_create(
            username="nour",
            defaults={
                "email": "nour.farhat@example.com",
                "first_name": "Nour",
                "last_name": "Farhat",
            }
        )
        if created:
            user5.set_password("user12345")
            user5.save()

        # =========================
        # DEPARTMENTS
        # =========================

        cs, _ = Department.objects.get_or_create(
            code="CS",
            defaults={
                "name": "Computer Science",
                "description": "Department focused on programming, algorithms, databases, and software systems.",
                "contact_email": "cs@example.com",
                "founded_date": "2018-01-10",
            }
        )

        ai, _ = Department.objects.get_or_create(
            code="AI",
            defaults={
                "name": "Artificial Intelligence",
                "description": "Department focused on machine learning, robotics, data mining, and intelligent systems.",
                "contact_email": "ai@example.com",
                "founded_date": "2020-03-15",
            }
        )

        se, _ = Department.objects.get_or_create(
            code="SE",
            defaults={
                "name": "Software Engineering",
                "description": "Department focused on software design, testing, project management, and web development.",
                "contact_email": "se@example.com",
                "founded_date": "2019-06-20",
            }
        )

        cyber, _ = Department.objects.get_or_create(
            code="CYB",
            defaults={
                "name": "Cybersecurity",
                "description": "Department focused on network security, cryptography, ethical hacking, and secure systems.",
                "contact_email": "cyber@example.com",
                "founded_date": "2021-09-01",
            }
        )

        ds, _ = Department.objects.get_or_create(
            code="DS",
            defaults={
                "name": "Data Science",
                "description": "Department focused on data analytics, statistics, visualization, and big data platforms.",
                "contact_email": "datascience@example.com",
                "founded_date": "2022-02-12",
            }
        )

        net, _ = Department.objects.get_or_create(
            code="NET",
            defaults={
                "name": "Networking and Cloud Computing",
                "description": "Department focused on distributed systems, cloud infrastructure, and computer networks.",
                "contact_email": "networking@example.com",
                "founded_date": "2020-10-05",
            }
        )

        # =========================
        # RESEARCHERS
        # =========================

        r1, _ = Researcher.objects.get_or_create(
            email="maya.hassan@example.com",
            defaults={
                "user": user1,
                "first_name": "Maya",
                "last_name": "Hassan",
                "department": cs,
                "date_of_birth": "1994-04-12",
                "academic_rank": "associate",
                "biography": "Researcher interested in academic web platforms, database systems, and digital transformation.",
            }
        )

        r2, _ = Researcher.objects.get_or_create(
            email="omar.khaled@example.com",
            defaults={
                "user": user2,
                "first_name": "Omar",
                "last_name": "Khaled",
                "department": ai,
                "date_of_birth": "1991-09-08",
                "academic_rank": "assistant",
                "biography": "AI researcher focused on machine learning, natural language processing, and intelligent applications.",
            }
        )

        r3, _ = Researcher.objects.get_or_create(
            email="sara.nasser@example.com",
            defaults={
                "user": user3,
                "first_name": "Sara",
                "last_name": "Nasser",
                "department": se,
                "date_of_birth": "1998-02-18",
                "academic_rank": "lecturer",
                "biography": "Lecturer and researcher in software testing, frontend systems, and agile development.",
            }
        )

        r4, _ = Researcher.objects.get_or_create(
            email="ali.mansour@example.com",
            defaults={
                "user": user4,
                "first_name": "Ali",
                "last_name": "Mansour",
                "department": cyber,
                "date_of_birth": "1993-11-25",
                "academic_rank": "professor",
                "biography": "Professor working on cryptography, secure communication, and cyber risk assessment.",
            }
        )

        r5, _ = Researcher.objects.get_or_create(
            email="nour.farhat@example.com",
            defaults={
                "user": user5,
                "first_name": "Nour",
                "last_name": "Farhat",
                "department": ds,
                "date_of_birth": "1996-07-30",
                "academic_rank": "student",
                "biography": "Graduate student researching data visualization, dashboards, and research analytics.",
            }
        )

        r6, _ = Researcher.objects.get_or_create(
            email="layla.abboud@example.com",
            defaults={
                "first_name": "Layla",
                "last_name": "Abboud",
                "department": net,
                "date_of_birth": "1989-12-04",
                "academic_rank": "assistant",
                "biography": "Researcher focused on distributed systems, load balancing, and cloud-based academic services.",
            }
        )

        r7, _ = Researcher.objects.get_or_create(
            email="karim.saad@example.com",
            defaults={
                "first_name": "Karim",
                "last_name": "Saad",
                "department": cs,
                "date_of_birth": "1992-03-19",
                "academic_rank": "lecturer",
                "biography": "Researcher interested in Django, REST APIs, backend design, and database-driven platforms.",
            }
        )

        r8, _ = Researcher.objects.get_or_create(
            email="reem.khoury@example.com",
            defaults={
                "first_name": "Reem",
                "last_name": "Khoury",
                "department": ai,
                "date_of_birth": "1995-08-14",
                "academic_rank": "student",
                "biography": "Graduate student studying AI-assisted research discovery and recommendation systems.",
            }
        )

        # =========================
        # CONFERENCES
        # =========================

        conf1, _ = Conference.objects.get_or_create(
            name="International Conference on AI Research",
            defaults={
                "location": "Beirut",
                "description": "A conference discussing AI applications, research systems, intelligent tools, and academic innovation.",
                "contact_email": "ai.conf@example.com",
                "start_date": "2026-05-10",
                "end_date": "2026-05-12",
            }
        )
        conf1.organizers.set([r2, r8])
        conf1.attendees.set([r1])

        conf2, _ = Conference.objects.get_or_create(
            name="Web Systems and Django Conference",
            defaults={
                "location": "Tripoli",
                "description": "A technical conference about Django, Angular, REST APIs, databases, and backend systems.",
                "contact_email": "web.conf@example.com",
                "start_date": "2026-06-01",
                "end_date": "2026-06-03",
            }
        )
        conf2.organizers.set([r1, r7])
        conf2.attendees.set([r2])

        conf3, _ = Conference.objects.get_or_create(
            name="Cybersecurity and Digital Trust Summit",
            defaults={
                "location": "Jounieh",
                "description": "A summit focused on cybersecurity, cryptography, secure systems, and digital trust.",
                "contact_email": "cyber.conf@example.com",
                "start_date": "2026-07-15",
                "end_date": "2026-07-17",
            }
        )
        conf3.organizers.set([r4])
        conf3.attendees.set([r3])

        conf4, _ = Conference.objects.get_or_create(
            name="Data Science and Analytics Forum",
            defaults={
                "location": "Saida",
                "description": "A forum covering data analytics, visualization, predictive models, and research insights.",
                "contact_email": "data.conf@example.com",
                "start_date": "2026-08-05",
                "end_date": "2026-08-06",
            }
        )
        conf4.organizers.set([r5])
        conf4.attendees.set([r6])

        conf5, _ = Conference.objects.get_or_create(
            name="Cloud Computing and Distributed Systems Workshop",
            defaults={
                "location": "Byblos",
                "description": "A workshop on cloud computing, distributed systems, load balancing, and scalable applications.",
                "contact_email": "cloud.conf@example.com",
                "start_date": "2026-09-20",
                "end_date": "2026-09-22",
            }
        )
        conf5.organizers.set([r6])
        conf5.attendees.set([r7])

        # =========================
        # PAPERS
        # =========================

        paper1, _ = Paper.objects.get_or_create(
            title="AI-Based Research Paper Management System",
            defaults={
                "abstract": "This paper presents a web-based system for organizing researchers, conferences, and academic papers.",
                "keywords": "AI, Django, Angular, Research",
                "conference": conf1,
                "corresponding_email": "maya.hassan@example.com",
                "publication_date": "2026-05-11",
                "status": "published",
            }
        )
        paper1.authors.set([r1, r2])

        paper2, _ = Paper.objects.get_or_create(
            title="Using Django and Angular for Academic Platforms",
            defaults={
                "abstract": "This paper explains how Django and Angular can be used together to build academic web platforms.",
                "keywords": "Django, Angular, API, Web",
                "conference": conf2,
                "corresponding_email": "omar.khaled@example.com",
                "publication_date": "2026-06-02",
                "status": "submitted",
            }
        )
        paper2.authors.set([r1, r3])

        paper3, _ = Paper.objects.get_or_create(
            title="Secure Authentication for Research Management Systems",
            defaults={
                "abstract": "This paper studies token-based authentication and permission control in academic management systems.",
                "keywords": "Authentication, Tokens, Security, Django REST",
                "conference": conf3,
                "corresponding_email": "ali.mansour@example.com",
                "publication_date": "2026-07-16",
                "status": "accepted",
            }
        )
        paper3.authors.set([r4, r7])

        paper4, _ = Paper.objects.get_or_create(
            title="Data Visualization for Academic Research Insights",
            defaults={
                "abstract": "This paper discusses dashboards and visual tools that help universities analyze research output.",
                "keywords": "Data Science, Visualization, Analytics, Dashboard",
                "conference": conf4,
                "corresponding_email": "nour.farhat@example.com",
                "publication_date": "2026-08-05",
                "status": "draft",
            }
        )
        paper4.authors.set([r5])

        paper5, _ = Paper.objects.get_or_create(
            title="Load Balancing Strategies in Cloud-Based University Platforms",
            defaults={
                "abstract": "This paper compares different load balancing strategies for scalable university and research platforms.",
                "keywords": "Cloud, Load Balancing, Distributed Systems, Scalability",
                "conference": conf5,
                "corresponding_email": "layla.abboud@example.com",
                "publication_date": "2026-09-21",
                "status": "submitted",
            }
        )
        paper5.authors.set([r6, r7])

        paper6, _ = Paper.objects.get_or_create(
            title="Improving Research Discovery Using Recommendation Systems",
            defaults={
                "abstract": "This paper explores how recommendation systems can help researchers discover relevant papers and conferences.",
                "keywords": "Recommendation Systems, AI, Research Discovery",
                "conference": conf1,
                "corresponding_email": "reem.khoury@example.com",
                "publication_date": "2026-05-12",
                "status": "accepted",
            }
        )
        paper6.authors.set([r8, r2])

        paper7, _ = Paper.objects.get_or_create(
            title="REST API Design for Academic Information Systems",
            defaults={
                "abstract": "This paper explains API design practices for academic systems that manage researchers, papers, and conferences.",
                "keywords": "REST API, Django, Backend, Academic Systems",
                "conference": conf2,
                "corresponding_email": "karim.saad@example.com",
                "publication_date": "2026-06-03",
                "status": "published",
            }
        )
        paper7.authors.set([r7, r1])

        self.stdout.write(self.style.SUCCESS("Sample data seeded successfully."))