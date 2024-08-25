# Generated by Django 5.0.2 on 2024-04-23 21:29

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0005_rename_date_posted_tip_date'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='tip',
            name='can_delete',
            field=models.ManyToManyField(blank=True, related_name='can_delete_tips', to=settings.AUTH_USER_MODEL),
        ),
    ]
