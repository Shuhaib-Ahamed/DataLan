import numpy as np
import phe.paillier
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, File, Form, UploadFile
from automl import AutoML
import tempfile
import pickle
import uuid
from fastapi.responses import JSONResponse
import phe.encoding
import phe.paillier as paillier
import pandas as pd


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


# def homomorphic_encrypt_csv(csv_path, public_key_path):
#     # Load the CSV file
#     df = pd.read_csv(csv_path)

#     # Generate the Paillier public key
#     with open(public_key_path, 'r') as f:
#         public_key_str = f.read()
#     public_key = phe.paillier.PaillierPublicKey(int(public_key_str, 16))

#     # One-hot encode categorical and non-numerical columns
#     cat_cols = df.select_dtypes(include=['object']).columns
#     if len(cat_cols) > 0:
#         df = pd.get_dummies(df, columns=cat_cols, dummy_na=False)
#     non_num_cols = df.select_dtypes(exclude=['float', 'int']).columns
#     if len(non_num_cols) > 0:
#         for col in non_num_cols:
#             df[col] = pd.factorize(df[col])[0]

#     # Encode and encrypt the data using Paillier encoding and encryption
#     encrypted_data = []
#     for _, row in df.iterrows():
#         encrypted_row = []
#         for val in row:
#             encrypted_val = public_key.encrypt(val)
#             encrypted_row.append(encrypted_val)
#         encrypted_data.append(encrypted_row)

#     return encrypted_data


@app.post("/train")
async def train(file: UploadFile = File(...), target_column: str = Form(...), userId: str = Form(...), assetId: str = Form(...)):
    with tempfile.TemporaryFile(suffix=".csv", delete=False) as temp_file:
        contents = await file.read()
        temp_file.write(contents)
        temp_file.flush()

        try:

            # # Generate a new key pair
            # public_key, private_key = paillier.generate_paillier_keypair()

            # # Save the public key to a file
            # with open("public_key.txt", "w") as f:
            #     f.write(str(public_key.n))

            # # Encrypt the data using ElGamal encryption
            # encrypted_data = homomorphic_encrypt_csv(
            #     temp_file.name, "public_key.txt")

            # print("Encrypted data: ", encrypted_data)

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
            print("error", e)
            raise HTTPException(status_code=400, detail=str(e))
