# GENERATE RANDOM ID FOR BUSINESS OWNER IN DB
import secrets
import string

def generate_random_id(length=6):
    """Generate a secure random ID."""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))
