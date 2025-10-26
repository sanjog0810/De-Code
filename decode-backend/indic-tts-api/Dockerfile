# Base image with Piper pre-installed
FROM rhasspy/wyoming-piper:latest

# Set working directory
WORKDIR /app

COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

# 2. Tell the adapter which *single* port your application listens on for HTTP requests.
#    *** IMPORTANT: You MUST choose ONE port here. I've chosen 4002. ***
ENV AWS_LAMBDA_RUNTIME_API_PORT=10200

# Create folder for models
RUN mkdir -p /models

# Install wget to fetch models
RUN apt-get update && \
    apt-get install -y wget && \
    rm -rf /var/lib/apt/lists/*

# Download English Male Voice: LibriTTS_R medium 4535
RUN wget 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx' -O /models/en_US-libritts_r-medium.onnx && \
    wget 'https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/libritts_r/medium/en_US-libritts_r-medium.onnx.json' -O /models/en_US-libritts_r-medium.onnx.json

# Expose Piper port

EXPOSE 10200

# Correct CMD for Piper TTS server
# (This is your old, incorrect CMD)
# CMD ["piper", "serve", "--model-dir", "/models", "--voice", "en_US-libritts_r-medium", "--port", "10200", "--host", "0.0.0.0"]

# Replace it with this correct CMD:
CMD ["--piper", "/usr/share/piper/piper", "--data-dir", "/models", "--voice", "en_US-libritts_r-medium"]