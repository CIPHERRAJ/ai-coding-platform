from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import UserProfile, Problem, Submission, Topic
from .serializers import UserProfileSerializer, ProblemSerializer, SubmissionSerializer
from .utils import assess_initial_skill, evaluate_submission, get_ai_help

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'username': user.username})

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})
    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['GET'])
def get_assessment_questions(request):
    # Diagnostic questions
    questions = [
        {
            "id": 101,
            "title": "Reverse a String",
            "description": "Write a function to reverse a string without using built-in reverse functions.",
            "starter_code": "def reverse_string(s):\n    # Your code here\n    pass"
        },
        {
            "id": 102,
            "title": "Find Duplicates",
            "description": "Find the duplicate number in an array of integers.",
            "starter_code": "def find_duplicate(nums):\n    # Your code here\n    pass"
        },
        {
            "id": 103,
            "title": "Valid Parentheses",
            "description": "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            "starter_code": "def is_valid(s):\n    # Your code here\n    pass"
        }
    ]
    return Response(questions)

@api_view(['POST'])
def assessment_api(request):
    submissions = request.data.get('submissions', [])
    # submissions format: [{'question': '...', 'code': '...'}, ...]
    
    # Assess via AI
    result = assess_initial_skill(submissions)
    
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    profile.skill_level = result.get('skill_level', 'Beginner')
    profile.topic_strength = result.get('topic_strength', {})
    profile.assessment_completed = True
    profile.save()
    
    return Response(result)

@api_view(['GET'])
def dashboard_data(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    
    # Organize by Topics
    topics = Topic.objects.all()
    topic_data = []
    
    for topic in topics:
        # Filter problems based on skill level (Adaptive Logic placeholder)
        # In a real engine, this would be more complex
        problems = Problem.objects.filter(topic=topic)
        topic_data.append({
            "id": topic.id,
            "name": topic.name,
            "slug": topic.slug,
            "description": topic.description,
            "problems": ProblemSerializer(problems, many=True).data
        })
        
    # Get unassigned problems too
    misc_problems = Problem.objects.filter(topic__isnull=True)
    if misc_problems.exists():
        topic_data.append({
            "id": 0,
            "name": "Mixed Practice",
            "slug": "mixed",
            "description": "General problems",
            "problems": ProblemSerializer(misc_problems, many=True).data
        })

    return Response({
        'profile': UserProfileSerializer(profile).data,
        'learning_path': topic_data
    })

@api_view(['POST'])
def submit_code(request, problem_id):
    try:
        problem = Problem.objects.get(id=problem_id)
    except Problem.DoesNotExist:
        return Response({'error': 'Problem not found'}, status=404)
        
    code = request.data.get('code')
    
    is_correct, feedback = evaluate_submission(problem.description, code)
    
    Submission.objects.create(
        user=request.user,
        problem=problem,
        code=code,
        ai_feedback=feedback,
        is_correct=is_correct
    )
    
    if is_correct:
        profile = request.user.userprofile
        profile.problems_solved += 1
        
        # Update specific topic strength if applicable
        if problem.topic:
            current_strength = profile.topic_strength.get(problem.topic.name, 0.0)
            # Simple increment logic
            profile.topic_strength[problem.topic.name] = min(current_strength + 0.1, 1.0)
            
        # Global Level Up Logic
        if profile.problems_solved == 5 and profile.skill_level == 'Beginner':
            profile.skill_level = 'Intermediate'
        elif profile.problems_solved == 15 and profile.skill_level == 'Intermediate':
            profile.skill_level = 'Advanced'
            
        profile.save()
        
    return Response({'is_correct': is_correct, 'feedback': feedback})

@api_view(['POST'])
def reset_profile(request):
    profile = request.user.userprofile
    profile.skill_level = 'Beginner'
    profile.problems_solved = 0
    profile.topic_strength = {}
    profile.assessment_completed = False
    profile.save()
    
    # Optional: Delete submissions? 
    # Submission.objects.filter(user=request.user).delete()
    
    return Response({'status': 'reset'})

@api_view(['POST'])
def ask_ai(request):
    question = request.data.get('question')
    code = request.data.get('code')
    context = request.data.get('context')
    
    answer = get_ai_help(context, code, question)
    return Response({'answer': answer})

@api_view(['GET'])
def user_history(request):
    submissions = Submission.objects.filter(user=request.user).order_by('-timestamp')
    return Response(SubmissionSerializer(submissions, many=True).data)