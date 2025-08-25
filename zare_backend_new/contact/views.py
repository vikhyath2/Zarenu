from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to submit contact form
def contact_submit(request):
    """
    Submit a contact form
    """
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Contact form submitted successfully',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'message': 'Error submitting contact form',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)