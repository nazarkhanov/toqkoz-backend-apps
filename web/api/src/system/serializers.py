from rest_framework import serializers

import system.models as models


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Organization
        fields = ['id', 'name', 'status']


class FacilitySerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.Facility
        fields = ['id', 'title', 'description', 'country', 'city', 'street', 'number', 'longitude',
                  'latitude', 'organization']


class TrackerSerializer(serializers.ModelSerializer):
    facility = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    organization = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.Tracker
        fields = ['id', 'title', 'description', 'facility', 'organization']


class UserSerializer(serializers.ModelSerializer):
    organization = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = models.User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'middle_name', 'identifier_number',
                  'phone_number', 'position', 'organization']
