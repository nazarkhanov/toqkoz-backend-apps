from django.urls import path, include

from rest_framework_nested import routers

from system import views


router_main = routers.SimpleRouter()
router_main.register('organizations', views.OrganizationViewSet, basename='organization')


router_nested = routers.NestedSimpleRouter(router_main, 'organizations', lookup='organization')
router_nested.register('facilities', views.FacilityViewSet, basename='facility')
router_nested.register('trackers', views.TrackerViewSet, basename='tracker')
router_nested.register('users', views.UserViewSet, basename='user')


urlpatterns = [
    path('', include(router_main.urls)),
    path('', include(router_nested.urls)),
]
