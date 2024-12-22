# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import endpoints


SECRET_KEY = "d2192d5e10374bc755f11f67282dcdd251e178d165ccb9aaec9e4b3a3e733710"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json", debug=True)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router , prefix = "/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

