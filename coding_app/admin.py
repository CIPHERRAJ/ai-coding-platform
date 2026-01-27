from django.contrib import admin
from .models import UserProfile, Problem, Submission, Topic

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'skill_level', 'problems_solved', 'assessment_completed')

@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Problem)
class ProblemAdmin(admin.ModelAdmin):
    list_display = ('title', 'difficulty', 'topic')
    list_filter = ('difficulty', 'topic')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'problem', 'is_correct', 'timestamp')
    list_filter = ('is_correct', 'timestamp')
