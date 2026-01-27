import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ai_platform.settings')
django.setup()

from coding_app.models import Topic, Problem

def populate():
    print("Populating Topics and Problems...")
    
    topics_data = [
        {
            "name": "Arrays", 
            "slug": "arrays", 
            "desc": "Master the basics of data storage.", 
            "problems": [
                ("Two Sum", "Find indices of two numbers that add up to target.", "Beginner"),
                ("Max Subarray", "Find the contiguous subarray with the largest sum.", "Intermediate"),
                ("Rotate Image", "Rotate a 2D matrix by 90 degrees.", "Advanced")
            ]
        },
        {
            "name": "Strings", 
            "slug": "strings", 
            "desc": "Manipulation and parsing of text.",
            "problems": [
                ("Valid Anagram", "Check if two strings are anagrams.", "Beginner"),
                ("Longest Palindrome", "Find the longest palindromic substring.", "Intermediate"),
                ("Word Break", "Segment string into dictionary words.", "Advanced")
            ]
        },
        {
            "name": "Linked Lists", 
            "slug": "linked-lists", 
            "desc": "Nodes, pointers, and dynamic structures.",
            "problems": [
                ("Reverse List", "Reverse a singly linked list.", "Beginner"),
                ("Detect Cycle", "Determine if a linked list has a cycle.", "Intermediate"),
                ("Merge k Lists", "Merge k sorted linked lists.", "Advanced")
            ]
        },
        {
            "name": "Trees & Graphs", 
            "slug": "trees-graphs", 
            "desc": "Hierarchical data and network structures.",
            "problems": [
                ("Invert Binary Tree", "Invert a binary tree.", "Beginner"),
                ("Number of Islands", "Count islands in a grid.", "Intermediate"),
                ("Word Ladder", "Transform start word to end word.", "Advanced")
            ]
        },
        {
            "name": "Dynamic Programming", 
            "slug": "dp", 
            "desc": "Optimization through recursion and memoization.",
            "problems": [
                ("Climbing Stairs", "Count ways to climb stairs.", "Beginner"),
                ("Coin Change", "Fewest coins to make up amount.", "Intermediate"),
                ("Longest Increasing Subsequence", "Find the length of LIS.", "Advanced")
            ]
        }
    ]

    for idx, t_data in enumerate(topics_data):
        topic, created = Topic.objects.get_or_create(
            slug=t_data["slug"],
            defaults={"name": t_data["name"], "description": t_data["desc"], "order": idx}
        )
        if created:
            print(f"Created Topic: {topic.name}")
        else:
            print(f"Topic exists: {topic.name}")
            
        for p_title, p_desc, p_diff in t_data["problems"]:
            p, p_created = Problem.objects.get_or_create(
                title=p_title,
                defaults={
                    "description": p_desc,
                    "difficulty": p_diff,
                    "topic": topic,
                    "starter_code": f"# Solution for {p_title}\ndef solution():\n    pass"
                }
            )
            if p_created:
                print(f"  - Created Problem: {p_title}")

    print("Population Complete.")

if __name__ == "__main__":
    populate()
