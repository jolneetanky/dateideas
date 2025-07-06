from lib.logger import initLogger
from huggingface_hub import InferenceClient
import os

class Embedder:
    # Embeds a single input string.
    def embed(self, input: str) -> list[float]:
        logger = initLogger("Embedder.embed()")
        logger.info(f"EMBEDDING... INPUT: {input}")
        HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
        PROVIDER = "hf-inference"
        MODEL = "intfloat/multilingual-e5-large-instruct"

        client = InferenceClient(
            provider=PROVIDER,
            api_key=HF_TOKEN,
        )

        result = client.feature_extraction(
            input,
            model=MODEL,
        )
        return result

def initEmbedder() -> Embedder:
    return Embedder()