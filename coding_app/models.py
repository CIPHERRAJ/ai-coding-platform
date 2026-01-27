from django.db import models
from django.contrib.auth.models import User
import json

class Topic(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0, help_text="Order in the learning path")

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

class UserProfile(models.Model):
    SKILL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    skill_level = models.CharField(max_length=20, choices=SKILL_CHOICES, default='Beginner')
    problems_solved = models.IntegerField(default=0)
    # JSON to store topic-wise strength: {'Arrays': 0.8, 'DP': 0.2}
    topic_strength = models.JSONField(default=dict, blank=True)
    # Track if initial assessment is done
    assessment_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.skill_level}"

class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES)
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, related_name='problems')
    starter_code = models.TextField(default="# Write your code here\n")
    
    def __str__(self):
        return self.title

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    code = models.TextField()
    ai_feedback = models.TextField(blank=True, null=True)
    is_correct = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    time_taken = models.IntegerField(null=True, help_text="Time in seconds")

    def __str__(self):
        return f"{self.user.username} - {self.problem.title}"