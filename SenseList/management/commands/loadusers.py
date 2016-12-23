from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = "creates a bunch of users"

    def handle(self, *args, **options):
        from django.contrib.auth.models import User
        users = ["rik", "james"]
        for user in users:
            u = User.objects.create_user(user, password='rochester')
            u.first_name = user
            u.save()
