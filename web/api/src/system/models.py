from __future__ import annotations
import uuid

import django.db.models as models 
import django.contrib.auth.models as auth_models

from django.utils.translation import gettext as _


class Organization(models.Model):
    class Meta:
        verbose_name = _('Organization')
        verbose_name_plural = _('Organizations')

    class StatusChoices(models.TextChoices):
        TRIAL = 'TRIAL', _('Trial')
        DISABLED = 'DISABLED', _('Disabled')
        ENABLED = 'ENABLED', _('Enabled')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(_('Name'), max_length=255, default=_('Unnamed'), blank=False)
    status = models.CharField(_('Status'), max_length=100, default=StatusChoices.DISABLED, 
                              choices=StatusChoices.choices, blank=False)

    REQUIRED_FIELDS = ['name', 'status']

    def __str__(self):
        return self.name


class UserManager(auth_models.BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError(_('Users must have an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(auth_models.AbstractUser):
    class RoleChoices(models.TextChoices):
        ADMIN = 'ADMIN', _('Admin')
        MANAGER = 'MANAGER', _('Manager')
        USER = 'USER', _('User')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, related_name='users', on_delete=models.CASCADE,
                                     blank=True, null=True, verbose_name=_('Organization'))

    username = None
    email = models.EmailField(_('Username'), max_length=255, unique=True)
    first_name = models.CharField(_('First name'), max_length=255, blank=False)
    last_name = models.CharField(_('Last name'), max_length=255, blank=False)
    middle_name = models.CharField(_('Middle name'), max_length=255, blank=False)
    identifier_number = models.CharField(_('Identifier number'), max_length=16, blank=False)
    phone_number = models.CharField(_('Phone number'), max_length=10, blank=False)
    is_active = models.BooleanField(_('Is user active?'), default=True)

    role = models.CharField(_('Role'), max_length=100, default=RoleChoices.USER, 
                            choices=RoleChoices.choices, blank=False)
    position = models.CharField(_('Position'), max_length=100, default=_('User'),
                                blank=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role', 'position']

    def __str__(self):
        return self.email


class Facility(models.Model):
    class Meta:
        verbose_name = _('Facility')
        verbose_name_plural = _('Facilities')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, related_name='facilities', on_delete=models.CASCADE,
                                     blank=False, null=False)
    title = models.CharField(_('Title'), default='', max_length=100, blank=False)
    description = models.CharField(_('Description'), default='', max_length=255, blank=True)
    country = models.CharField(_('Country'), default='', max_length=255, blank=False)
    city = models.CharField(_('City'), default='', max_length=255, blank=False)
    street = models.CharField(_('Street'), default='', max_length=255, blank=False)
    number = models.CharField(_('Number'), default='', max_length=16, blank=False)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    latitude = models.DecimalField(max_digits=10, decimal_places=7)


class Tracker(models.Model):
    class Meta:
        verbose_name = _('Tracker')
        verbose_name_plural = _('Trackers')

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_('Title'), default='', max_length=100, blank=False)
    description = models.CharField(_('Description'), default='', max_length=255, blank=True)
    facility = models.ForeignKey(Facility, related_name='trackers', on_delete=models.CASCADE,
                                 blank=False, null=False)
    organization = models.ForeignKey(Organization, related_name='trackers', on_delete=models.CASCADE,
                                     blank=False, null=False)
