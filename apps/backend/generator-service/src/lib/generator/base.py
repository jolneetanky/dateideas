from abc import ABC, abstractmethod
from lib.logger import initLogger
import requests
import ollama
import os

class Generator(ABC):
    @abstractmethod
    def generate(self, prompt: str):
        pass

# MOST NAIVE/BASIC ONE:
# 1) input: prompt. based on data set, it gives us entries that fit the prompt.
# hm that is basically a semantic search and will be the same each time. how do i make it fun?
# it will simply feel like google search, eg. "date ideas for 2 near bugis" => and we just get like ["yakiniku go", "fun karaoke"]
# which is super boring! even google can do it

# NEW IDEA:
# based on the prompt, generator generates an actual idea, eg. "Take a nice long walk along the beach. Here are some beaches near bugis: "
# we then use this output & its keywords => query Overpass API to get matching locations.
# User can regenerate so that each time, a different idea is generated. Which is much more fun.

def query(api_url, headers, payload):
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()

class DateIdeaGenerator(Generator):
    def generate(self, prompt: str):
        # STEP #1: GENERATE A DATEIDEA
        # Can think of this as a chatgpt wrapper that basically asks chatGPT t ogenerate create dateideas
        # problem for later: this dateidea needs to be constrained by the prompt as well
        # ie. the suggestion should be based on actual available locations around the area..?
        BASE_GENERATION_PROMPT = """
You're a creative date planner. Given a user’s prompt, suggest a fun and unique date idea. 
Make it short, warm, and specific to the mood and location. Avoid generic tips.

User prompt: "{user_prompt}"

Date idea:
"""
        logger = initLogger("DateIdeaGenerator.generate")
        full_prompt = BASE_GENERATION_PROMPT.format(user_prompt=prompt)
        logger.info(f"FULL PROMPT: {full_prompt}")

        API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_TOKEN')}"}

        # response = requests.post(API_URL, headers=headers, json={
        # "inputs": full_prompt,
        # "parameters": {"max_new_tokens": 100, "temperature": 0.8}
        # })
        payload = {

        }
        response = query(API_URL, headers, {
            "messages": [
                {
                    "role": "user",
                    "content": full_prompt,
                }
            ],
            "model": "mistralai/mistral-7b-instruct"
        })

        logger.info(f"RES: {response}")
        
        # response = ollama.generate(model='llama3', prompt='Explain the concept of quantum entanglement.')
        # print(response['response'])
        content = response["choices"][0]["message"]["content"]
        return content