from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_api, name='api_register'),
    path('login/', views.login_api, name='api_login'),
    path('assessment/questions/', views.get_assessment_questions, name='api_assessment_questions'),
    path('assessment/submit/', views.assessment_api, name='api_assessment_submit'),
    path('dashboard/', views.dashboard_data, name='api_dashboard'),
    path('submit/<int:problem_id>/', views.submit_code, name='api_submit'),
    path('reset/', views.reset_profile, name='api_reset'),
    path('ask/', views.ask_ai, name='api_ask'),
    path('history/', views.user_history, name='api_history'),
]
