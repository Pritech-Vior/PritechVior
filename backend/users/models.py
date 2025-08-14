from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('project_manager', 'Project Manager'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('treasury', 'Treasury'),
        ('sales_marketing', 'Sales/Marketing'),
        ('customer_support', 'Customer Support'),
        ('instructor', 'Instructor'),
        ('student', 'Student'),
        ('client', 'Client'),
        ('learner', 'Learner'),
        ('guest', 'Guest'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='guest')
