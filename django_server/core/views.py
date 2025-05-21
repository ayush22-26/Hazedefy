from django.http import StreamingHttpResponse, JsonResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.conf import settings
import cv2, numpy as np, base64, os, json
from .utils.dehaze import dehaze
from .utils.image import dehaze_image
from .utils.video import process_video

location_data = {
    'chat_id': None,
    'latitude': None,
    'longitude': None
}

def generate_frames():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = dehaze(frame, omega=0.5, tmin=0.1, gamma=1.5, color_balance=True)
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    cap.release()

def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

@csrf_exempt
def process_frame(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        image_data = body['image_data'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        dehazed = dehaze(frame, omega=0.5, tmin=0.1, gamma=1.5, color_balance=True)
        _, buffer = cv2.imencode('.jpg', dehazed)
        return JsonResponse({'dehazed_image': base64.b64encode(buffer).decode('utf-8')})

@csrf_exempt
def dehaze_image_upload(request):
    if request.method == 'POST':
        file = request.FILES.get('upload_file')
        if file:
            input_dir = os.path.join(settings.MEDIA_ROOT, 'images')
            os.makedirs(input_dir, exist_ok=True)

            input_path = os.path.join(input_dir, 'upload_image.jpg')
            output_path = os.path.join(input_dir, 'upload_image_dehazed.jpg')

            # Remove previous files1
            for path in [input_path, output_path]:
                if os.path.exists(path):
                    os.remove(path)

            # Save uploaded image
            with open(input_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            result = dehaze_image(input_path)
            if result is not None:
                cv2.imwrite(output_path, result * 255)
                return FileResponse(open(output_path, 'rb'), as_attachment=True)

        return JsonResponse({'error': 'Failed to process image'}, status=400)

@csrf_exempt
def upload_video(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if file:
            video_dir = os.path.join(settings.MEDIA_ROOT, 'videos')
            os.makedirs(video_dir, exist_ok=True)

            input_path = os.path.join(video_dir, 'upload_video.mp4')
            output_path = os.path.join(video_dir, 'output.mp4')

            # Remove old videos
            for path in [input_path, output_path]:
                if os.path.exists(path):
                    os.remove(path)

            # Save new video
            with open(input_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)

            process_video(input_path, output_path)

            return JsonResponse({
                'message': 'Video processed successfully',
                'filename': 'output.mp4',
                'processed_video_path': f'{settings.MEDIA_URL}videos/output.mp4'
            })

        return JsonResponse({'error': 'No video file provided'}, status=400)


def get_processed_video(request):
    video_path = request.GET.get('path')
    full_path = os.path.join(settings.MEDIA_ROOT, video_path.replace(settings.MEDIA_URL, ''))
    return FileResponse(open(full_path, 'rb'), content_type='video/mp4')

@csrf_exempt
def location_data_handler(request):
    global location_data
    if request.method == 'GET':
        return JsonResponse(location_data)
    elif request.method == 'POST':
        try:
            body = json.loads(request.body)
            location_data.update({
                'chat_id': body['chat_id'],
                'latitude': body['latitude'],
                'longitude': body['longitude']
            })
            return JsonResponse({'message': f"Received location: {location_data}"})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
