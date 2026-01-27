from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Problem, Submission

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['user', 'skill_level', 'problems_solved', 'topic_strength', 'assessment_completed']

class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = ['id', 'title', 'description', 'difficulty', 'starter_code']

class SubmissionSerializer(serializers.ModelSerializer):
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    class Meta:
        model = Submission
        fields = ['id', 'problem_title', 'code', 'ai_feedback', 'is_correct', 'timestamp']
