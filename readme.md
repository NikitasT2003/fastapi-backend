# Project Documentation 📚

## Overview 🌐

This project is a web application built using **FastAPI**, designed to facilitate a social platform where users can create accounts, post content, like and comment on posts, follow other users, and manage business listings. The application utilizes a **PostgreSQL** database for data storage and **SQLAlchemy** for ORM (Object-Relational Mapping).

## Tech Stack ⚙️
- **Backend Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens) for secure user authentication 🔑
- **Password Hashing**: Passlib for secure password storage 🔒
- **Data Validation**: Pydantic for data validation and serialization 📋
- **Asynchronous Support**: Uvicorn as the ASGI server 🚀
- **CORS Middleware**: FastAPI's built-in CORS middleware for handling cross-origin requests 🌍
- **Environment Management**: Python-dotenv for managing environment variables 🌱
- **Data Science Libraries**: Pandas and Scikit-learn for data manipulation and machine learning tasks 📊

## Project Structure 🗂️
- **api/index.py**: The main application file containing the FastAPI app, routes, models, and database interactions.
- **api/\_\_init\_\_.py**: An empty file that marks the directory as a Python package.
- **api/.env**: Environment variables for database connection and secret keys.
- **api/alembic.ini**: Configuration file for Alembic, a database migration tool for SQLAlchemy.
- **api/env.py**: Script for managing database migrations using Alembic.
- **api/requirements.txt**: A list of dependencies required to run the project.

## Features 🌟
- **User Management**: Users can sign up, log in, and manage their profiles.
- **Business Listings**: Users can create, update, and delete business listings.
- **Posts**: Users can create posts, like/unlike them, and comment on them.
- **Follow System**: Users can follow and unfollow each other.
- **Favorites**: Users can mark posts as favorites.
- **Sharing**: Users can share posts and business listings.
- **Health Check Endpoint**: A simple endpoint to check if the API is running.

## Usage 🛠️
1. **Setup Environment**:
   - Clone the repository.
   - Create a virtual environment and activate it.
   - Install dependencies using:
     ```bash
     pip install -r requirements.txt
     ```
2. **Configure Environment Variables**:
   - Create a `.env` file in the `api` directory with the following content:
     - Replace `username`, `password`, and `db_name` with your PostgreSQL credentials.
3. **Run Database Migrations**:
   - Ensure your PostgreSQL server is running.
   - Run the migrations using Alembic:
     ```bash
     alembic upgrade head
     ```
4. **Start the Application**:
   - Run the FastAPI application using Uvicorn:
     ```bash
     uvicorn api.index:app --reload
     ```
5. **Access the API**:
   - Open your browser and navigate to `http://localhost:8000/api/docs` to access the interactive API documentation provided by FastAPI.

## Adjustments 🔧
- **Adding New Features**: To add new features, create new routes in `api/index.py` and define the corresponding models and schemas.
- **Database Changes**: Modify the SQLAlchemy models in `api/index.py` and create new migrations using Alembic.
- **Environment Variables**: Adjust the `.env` file to change database configurations or secret keys as needed.
- **Dependencies**: Update the `requirements.txt` file to include any new libraries you may need.

## Conclusion 🏁
This project serves as a robust foundation for building a social platform with user-generated content and business listings. With FastAPI's speed and ease of use, along with PostgreSQL's reliability, developers can extend and customize the application to meet their specific needs.
