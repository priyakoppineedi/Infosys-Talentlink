from django.contrib import admin

# Register your models here.
from .models import User, Profile, Project, Proposal, Contract, Message, Review, Skill


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "role", "is_staff", "is_active")
    search_fields = ("username", "email")
    list_filter = ("role", "is_staff", "is_active")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name","skills", "hourly_rate", "availability", "location")
    search_fields = ("full_name", "skills", "location")
    list_filter = ("availability",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "client", "title", "budget", "duration", "created_at")
    search_fields = ("title", "description", "skills_required")
    list_filter = ("created_at", "budget")


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ("id", "project", "freelancer", "status", "proposed_rate", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("cover_letter",)


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ("id", "proposal", "start_date", "end_date", "status")
    list_filter = ("status",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "sender", "receiver", "timestamp")
    search_fields = ("content",)
    list_filter = ("timestamp",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "contract", "reviewer", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("comment",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
