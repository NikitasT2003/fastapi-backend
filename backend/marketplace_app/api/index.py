from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import your existing routes and dependencies

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include your existing routes
# app.include_router(...) 