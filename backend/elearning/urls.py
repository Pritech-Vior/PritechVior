from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'courses', views.CourseViewSet)
router.register(r'lessons', views.LessonViewSet)
router.register(r'enrollments', views.EnrollmentViewSet)
router.register(r'reviews', views.CourseReviewViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
