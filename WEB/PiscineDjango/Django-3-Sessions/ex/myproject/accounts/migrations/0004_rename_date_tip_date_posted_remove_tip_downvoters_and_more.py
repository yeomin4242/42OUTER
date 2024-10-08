# Generated by Django 5.0.2 on 2024-04-23 09:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_remove_tip_downvote_remove_tip_upvote_tip_downvoters_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameField(
            model_name='tip',
            old_name='date',
            new_name='date_posted',
        ),
        migrations.RemoveField(
            model_name='tip',
            name='downvoters',
        ),
        migrations.RemoveField(
            model_name='tip',
            name='upvoters',
        ),
        migrations.AddField(
            model_name='tip',
            name='downvotes',
            field=models.ManyToManyField(related_name='downvoted_tips', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='tip',
            name='upvotes',
            field=models.ManyToManyField(related_name='upvoted_tips', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='tip',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
