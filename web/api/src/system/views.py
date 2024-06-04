from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from rest_framework import viewsets, permissions, mixins, response

import system.models as models
import system.serializers as serializers 
import system.permissions as user_permissions


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = models.Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsAdmin]


class FacilityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.FacilitySerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsAdmin]

    def get_queryset(self):
        return models.Facility.objects.filter(organization__id=self.kwargs['organization_pk'])

    def perform_create(self, serializer):
        organization = get_object_or_404(models.Organization, pk=self.kwargs['organization_pk'])
        serializer.save(organization=organization)


class TrackerViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TrackerSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsAdmin]

    def get_queryset(self):
        return models.Tracker.objects.filter(organization=self.kwargs['organization_pk'])

    def perform_create(self, serializer):
        organization = get_object_or_404(models.Organization, pk=self.kwargs['organization_pk'])
        facility = get_object_or_404(models.Facility, pk=self.request.data['facility_id'])
        serializer.save(organization=organization, facility=facility)

    def perform_update(self, serializer):
        organization = get_object_or_404(models.Organization, pk=self.kwargs['organization_pk'])
        facility = get_object_or_404(models.Facility, pk=self.request.data['facility_id'])
        serializer.save(organization=organization, facility=facility)

    def retrieve(self, request, pk=None, organization_pk=None):
        facility = models.Facility.objects.filter(organization__id=organization_pk)
        serializer = self.get_serializer(facility, many=True)
        return response.Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    permission_classes = [permissions.IsAuthenticated, user_permissions.IsAdmin]

    def get_queryset(self):
        return models.User.objects.filter(organization__id=self.kwargs['organization_pk'])

    def perform_create(self, serializer):
        organization = get_object_or_404(models.Organization, pk=self.kwargs['organization_pk'])
        serializer.save(organization=organization, password=make_password(serializer.validated_data['password']))

    def perform_update(self, serializer):
        organization = get_object_or_404(models.Organization, pk=self.kwargs['organization_pk'])
        serializer.save(organization=organization, password=make_password(serializer.validated_data['password']))
