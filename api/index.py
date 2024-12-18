# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routes import endpoints


app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", debug=True)

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "https://marketplace1-lac.vercel.app"
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router , prefix = "/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)