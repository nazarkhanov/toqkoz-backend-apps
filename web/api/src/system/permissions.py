from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'ADMIN'


class IsManager(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'MANAGER'


class IsClient(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'CLIENT'
