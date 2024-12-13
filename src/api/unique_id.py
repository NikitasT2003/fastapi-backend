# GENERATE RANDOM ID FOR BUSINESS OWNER IN DB
import secrets

def generate_random_id(min_value=1, max_value=999999):
    """Generate a secure random integer ID."""
    return secrets.randbelow(max_value - min_value + 1) + min_value
