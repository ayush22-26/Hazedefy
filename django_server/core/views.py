from django.http import StreamingHttpResponse, JsonResponse, FileResponse , HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import cv2, numpy as np, base64, os, json
from .utils.dehaze import dehaze
from .utils.image import dehaze_image
from .utils.video import process_video
from .mongodb import collection
import cloudinary
import cloudinary.uploader
import tempfile
import threading
import time

location_data = {
    'chat_id': None,
    'latitude': None,
    'longitude': None
}

def home(request):
    urls_and_methods = [
        ('/', 'GET'),
        ('/video_feed/', 'GET'),
        ('/process_frame/', 'POST'),
        ('/dehaze/', 'POST'),
        ('/uploadvideo/', 'POST'),
        ('/location_data/', 'GET, POST'),
    ]

    # Build styled HTML response with inline CSS
    html_lines = [
        "<html>",
        "<head>",
        "<title>Server Home</title>",
        "<style>",
        "  body { font-family: Arial, sans-serif; background: #f0f4f8; color: #333; padding: 30px; }",
        "  h1 { color: #2c3e50; }",
        "  ul { list-style-type: none; padding-left: 0; }",
        "  li { background: #ffffff; margin: 8px 0; padding: 12px 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }",
        "  .url { font-weight: bold; color: #2980b9; }",
        "  .method { font-style: italic; color: #27ae60; margin-left: 10px; }",
        "</style>",
        "</head>",
        "<body>",
        "<h1>Mom, it's working!</h1>",
        "<p>Available URLs and their HTTP methods:</p>",
        "<ul>"
    ]

    for url, methods in urls_and_methods:
        html_lines.append(f"<li><span class='url'>{url}</span> <span>---:></span> <span class='method'>{methods}</span></li>")

    html_lines.extend([
        "</ul>",
        "</body>",
        "</html>"
    ])

    html_response = "\n".join(html_lines)
    return HttpResponse(html_response)

def generate_frames():
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

def delete_from_cloudinary(public_id, resource_type="image"):
    try:
        cloudinary.uploader.destroy(public_id, resource_type=resource_type, invalidate=True)
        print(f"[INFO] Deleted {public_id} from Cloudinary.")
    except Exception as e:
        print(f"[ERROR] Failed to delete {public_id}: {e}")

@csrf_exempt
def dehaze_image_upload(request):
    if request.method == 'POST':
        file = request.FILES.get('upload_file')
        if file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_input:
                for chunk in file.chunks():
                    temp_input.write(chunk)
                temp_input.flush()

                result = dehaze_image(temp_input.name)
                if result is not None:
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_output:
                        cv2.imwrite(temp_output.name, result * 255)
                        temp_output.flush()
                        upload_result = cloudinary.uploader.upload(temp_output.name, folder='dehazed_images/')

                        secure_url = upload_result['secure_url']
                        public_id = upload_result['public_id']

                        # collection.insert_one({
                        #     'type': 'image',
                        #     'url': secure_url,
                        #     'public_id': public_id,
                        #     'timestamp': time.time()
                        # })

                        threading.Timer(120, delete_from_cloudinary, args=[public_id, "image"]).start()

                        return JsonResponse({'dehazed_image_url': secure_url})
    return JsonResponse({'error': 'Failed to process image'}, status=400)

@csrf_exempt
def upload_video(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        if file:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_input:
                for chunk in file.chunks():
                    temp_input.write(chunk)
                temp_input.flush()

                with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_output:
                    process_video(temp_input.name, temp_output.name)
                    temp_output.flush()
                    upload_result = cloudinary.uploader.upload_large(
                        temp_output.name,
                        resource_type="video",
                        folder="dehazed_videos/"
                    )

                    secure_url = upload_result['secure_url']
                    public_id = upload_result['public_id']

                    # collection.insert_one({
                    #     'type': 'video',
                    #     'url': secure_url,
                    #     'public_id': public_id,
                    #     'timestamp': time.time()
                    # })

                    threading.Timer(120, delete_from_cloudinary, args=[public_id, "video"]).start()

                    return JsonResponse({
                        'message': 'Video processed and uploaded',
                        'processed_video_url': secure_url
                    })

    return JsonResponse({'error': 'No video file provided'}, status=400)

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
