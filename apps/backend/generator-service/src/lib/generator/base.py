from abc import ABC, abstractmethod
from lib.logger import initLogger
import requests
import os

class Generator(ABC):
    @abstractmethod
    def generate(self, prompt: str):
        pass

def query(api_url, headers, payload):
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()

class DateIdeaGenerator(Generator):
    # NOTE: for now, don't use loc_str. It's too limiting and I want the user prompt to override.
    def generate(self, prompt: str, loc_str: str):
        BASE_GENERATION_PROMPT = """
You're a creative date planner. Given a user’s prompt, suggest a fun and unique date idea. 
Make it short, warm, and specific to the mood and location. Avoid generic tips.

User prompt: "{user_prompt}"
"""
        logger = initLogger("DateIdeaGenerator.generate")
        full_prompt = BASE_GENERATION_PROMPT.format(user_prompt=prompt, loc_str=loc_str)
        logger.info(f"FULL PROMPT: {full_prompt}")

        API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_TOKEN')}"}

        response = query(API_URL, headers, {
            "messages": [
                {
                    "role": "user",
                    "content": full_prompt,
                }
            ],
            "model": "mistralai/mistral-7b-instruct"
        })

        content = response["choices"][0]["message"]["content"]
        return content

def initGenerator() -> Generator:
    return DateIdeaGenerator()