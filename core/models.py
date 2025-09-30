from django.db import models

from django.contrib.auth.models import AbstractUser


# 1. Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('freelancer', 'Freelancer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # username still required by AbstractUser

    def __str__(self):
        return f"{self.username} ({self.role})"

# 2. Profile
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    skills = models.TextField()  # can store as comma-separated, or JSON later
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    availability = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.full_name


# 3. Project
class Project(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)
    skills_required = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# 4. Proposal
class Proposal(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="proposals")
    freelancer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="proposals")
    cover_letter = models.TextField()
    proposed_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="pending")  # pending/accepted/rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Proposal by {self.freelancer.username} for {self.project.title}"


# 5. Contract
class Contract(models.Model):
    proposal = models.OneToOneField(Proposal, on_delete=models.CASCADE, related_name="contract")
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=50, default="active")  # active/completed/cancelled

    def __str__(self):
        return f"Contract for {self.proposal.project.title}"


# 6. Message
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"


# 7. Review
class Review(models.Model):
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="given_reviews")
    rating = models.IntegerField()
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.rating}/5 by {self.reviewer.username}"


# 8. Skills (optional standalone table)
class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
