from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from automl import AutoML
import tempfile
import pickle
import uuid
from fastapi.responses import JSONResponse


import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

# Initialize Firebase app
cred = credentials.Certificate(
    'auto-cs-14a6f-firebase-adminsdk-z3i0z-26805afd41.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'auto-cs-14a6f.appspot.com'
})
bucket = storage.bucket()


# Command to execute script locally: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

app = FastAPI(timeout=3600)

# Define allowed origins, methods, and headers
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/train")
async def train(file: UploadFile = File(...), target_column: str = Form(...), userId: str = Form(...), assetId: str = Form(...)):
    with tempfile.TemporaryFile(suffix=".csv", delete=False) as temp_file:
        contents = await file.read()
        temp_file.write(contents)
        temp_file.flush()

        try:
            auto_ml = AutoML(path_to_data=temp_file.name,
                             target_column=target_column, metric="Accuracy")
            await auto_ml.fit()

            # Serialize the machine learning model using pickle
            serialized_model = pickle.dumps(auto_ml.best_model)

            # Upload the serialized model to Firebase Storage in pickle format
            blob = bucket.blob('models/' + userId + "/" +
                               assetId + "/" + str(uuid.uuid4()) + '.pkl')
            blob.upload_from_string(serialized_model)

            # Get the URL of the uploaded model
            model_url = blob.public_url

            content = {"Message": "Success", "model_url": model_url,
                       "response": str(auto_ml.best_model)}

            return JSONResponse(content=content, status_code=200)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
