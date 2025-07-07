# Use an official Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire source code into the container
COPY src/ ./src

# Set the working directory to src
WORKDIR /app/src

# Run your service
CMD ["python", "main.py"]
