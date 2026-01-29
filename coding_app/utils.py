import os
import google.generativeai as genai

# Configure API Key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

def get_model():
    return genai.GenerativeModel('gemini-2.5-flash')

def assess_initial_skill(submissions):
    """
    submissions: list of dicts {'question': str, 'code': str}
    Returns: dict {'skill_level': str, 'topic_strength': dict, 'feedback': str}
    """
    if not GEMINI_API_KEY:
        return {'skill_level': "Beginner", 'topic_strength': {}, 'feedback': "AI unavailable."}

    model = get_model()
    prompt = "Evaluate the coding skills based on these solutions. \n"
    for sub in submissions:
        prompt += f"Question: {sub.get('question', 'Unknown')}\nCode: {sub.get('code', '')}\n\n"
    
    prompt += """
    Analyze the code for logic, time complexity, and error patterns.
    Output a JSON object with this structure (do not use markdown code blocks):
    {
        "skill_level": "Beginner" | "Intermediate" | "Advanced",
        "topic_strength": {"Arrays": 0.0-1.0, "Strings": 0.0-1.0, "Loops": 0.0-1.0},
        "feedback": "Short summary of strengths and weaknesses."
    }
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip().replace("```json", "").replace("```", "")
        import json
        return json.loads(text)
    except Exception as e:
        print(f"AI Error: {e}")
        return {'skill_level': "Beginner", 'topic_strength': {}, 'feedback': "Error during analysis."}


def evaluate_submission(problem_desc, code):
    """
    Returns (bool is_correct, str feedback)
    """
    if not GEMINI_API_KEY:
        return False, "AI API Key missing."

    model = get_model()
    prompt = f"""
    Problem Description: {problem_desc} 
    
    Student Code:
    {code}
    
    Task:
    1. Determine if the code solves the problem correctly.
    2. Be lenient with function names unless a specific name is mandatory for the logic.
    3. Provide constructive feedback.
    
    Output Format:
    CORRECT: [True/False]
    FEEDBACK: [Your feedback here]
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        
        is_correct = "CORRECT: True" in text or "CORRECT: true" in text
        
        # Simple parsing logic
        feedback_parts = text.split("FEEDBACK:")
        feedback = feedback_parts[1].strip() if len(feedback_parts) > 1 else text
        
        return is_correct, feedback
    except Exception as e:
        return False, f"AI Error: {e}"

def get_ai_help(problem_desc, current_code, user_question):
    if not GEMINI_API_KEY:
        return "AI API Key missing."

    model = get_model()
    prompt = f"""
    Context: {problem_desc}
    Current Code: {current_code}
    Student Question: {user_question}
    
    Provide a helpful, educational answer without giving away the full solution immediately if possible.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {e}"
