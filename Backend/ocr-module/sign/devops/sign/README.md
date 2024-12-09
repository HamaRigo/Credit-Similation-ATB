# Signature Detection Application

## Setup and Run Instructions

1. Clone the repository:
   `git clone <repo_url>`

2. Navigate to the project folder:
   `cd signature-detection`

3. Build the Docker image:
   `docker build -t signature-detection .`

4. Run the Docker container:
   `docker run -d -p 5005:5005 signature-detection`

5. The app will be running at: `http://localhost:5005`

## Endpoints:

- **/upload-signature**: Upload a signature to be saved.
- **/compare-signatures**: Compare a given signature with saved ones.

