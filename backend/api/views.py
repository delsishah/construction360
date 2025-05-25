import uuid
import io
import numpy as np
import tensorflow as tf
from PIL import Image
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.base import ContentFile
from pathlib import Path
from .models import InferenceResult

# Constants
INPUT_SIZE = (224, 224)
MAIN_CATEGORIES = ["brick-masonry", "concreting", "excavation"]
SUBLABELS = {
    "brick-masonry": ["Brick-Laying", "Capping"],
    "concreting": ["Pouring", "Smoothing", "Compaction"],
    "excavation": ["Site-Clearing", "Digging"]
}
MODELS_DIR = Path(__file__).resolve().parent.parent / "models" / "models"

# Load models
print("🔄 Loading models...")
main_model = tf.keras.models.load_model(MODELS_DIR / "main_model.keras")
submodels = {
    "brick-masonry": tf.keras.models.load_model(MODELS_DIR / "submodel_brick-masonry.keras"),
    "concreting": tf.keras.models.load_model(MODELS_DIR / "submodel_concreting.keras"),
    "excavation": tf.keras.models.load_model(MODELS_DIR / "submodel_excavation.keras")
}
print("✅ Models loaded.")

def preprocess_image(image_bytes):
    img = tf.keras.utils.load_img(io.BytesIO(image_bytes), target_size=INPUT_SIZE)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.expand_dims(img_array, axis=0) / 255.0
    return img_array

def run_inference(img_array):
    # Run main model
    category_pred, status_pred = main_model.predict(img_array)

    # Status: 1 = incomplete, 0 = complete
    status_label = "incomplete" if status_pred[0][0] >= 0.5 else "complete"

    category_idx = np.argmax(category_pred[0])
    category_confidence = float(category_pred[0][category_idx])
    category_label = MAIN_CATEGORIES[category_idx] if category_confidence > 0.5 else "unsure"

    sub_activities = {}
    if category_label in submodels:
        submodel = submodels[category_label]
        sub_pred = submodel.predict(img_array)[0]
        sub_labels = SUBLABELS[category_label]
        for i, prob in enumerate(sub_pred):
            sub_activities[sub_labels[i]] = int(prob > 0.5)

    return status_label, category_label, category_confidence, sub_activities

@csrf_exempt
def analyze_image(request):
    if request.method != "POST" or "image" not in request.FILES:
        return JsonResponse({"error": "No image uploaded"}, status=400)

    try:
        image_file = request.FILES["image"]
        image_bytes = image_file.read()
        image_name = f"{uuid.uuid4()}.jpg"

        # Preprocess and predict
        img_array = preprocess_image(image_bytes)
        status, category, confidence, label_dict = run_inference(img_array)

        # Save result to DB
        result = InferenceResult(
            status=status,
            category=category,
            confidence=round(confidence, 4),
            labels=label_dict
        )
        result.image.save(image_name, ContentFile(image_bytes), save=True)

        return JsonResponse({
            "status": status,
            "category": category,
            "confidence": round(confidence, 4),
            "labels": label_dict,
            "id": result.id
        })

    except Exception as e:
        return JsonResponse({"error": f"Failed to process image: {str(e)}"}, status=500)
