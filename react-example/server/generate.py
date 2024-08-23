import base64
import json
import hmac
import hashlib
import sys

def generate_jwt(api_key_shared_secret, user_id, email, iat, exp):
    encoding = "utf-8"
    secret = api_key_shared_secret.encode(encoding)
    
    jwt_header = json.dumps(
        {"alg": "HS256", "typ": "JWT"}, separators=(",", ":")
    ).encode(encoding)

    payload = {
        "iat": iat,
        "exp": exp
    }

    if user_id is not '':
        payload["userId"] = user_id
    elif email is not '':
        payload["email"] = email

    jwt_payload = json.dumps(payload, separators=(",", ":")).encode(encoding)

    encoded_header_bytes = base64.urlsafe_b64encode(jwt_header).replace(b"=", b"")
    encoded_payload_bytes = base64.urlsafe_b64encode(jwt_payload).replace(b"=", b"")

    jwt_signature = hmac.digest(
        key=secret,
        msg=b".".join([encoded_header_bytes, encoded_payload_bytes]),
        digest=hashlib.sha256
    )

    encoded_signature_bytes = base64.urlsafe_b64encode(jwt_signature).replace(b"=", b"")

    jwt_returned = (
        f"{str(encoded_header_bytes, encoding)}" +
        f".{str(encoded_payload_bytes, encoding)}" +
        f".{str(encoded_signature_bytes, encoding)}"
    )

    return jwt_returned

if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("Usage: python generate_jwt.py <API_KEY_SHARED_SECRET> <USER_ID> <EMAIL> <iat> <exp>")
        sys.exit(1)

    api_key_shared_secret = sys.argv[1]
    user_id = sys.argv[2]
    email = sys.argv[3]
    iat = int(sys.argv[4])
    exp = int(sys.argv[5])

    jwt_token = generate_jwt(api_key_shared_secret, user_id, email, iat, exp)
    print(jwt_token)
