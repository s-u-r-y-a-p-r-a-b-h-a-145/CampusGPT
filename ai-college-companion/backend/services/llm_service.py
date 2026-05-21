import requests
import os

from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")

URL = "https://openrouter.ai/api/v1/chat/completions"

MODEL = "openai/gpt-3.5-turbo"



def ask_llm(user_message):

    try:

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }

        data = {
            "model": MODEL,

            "messages": [
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        }

        response = requests.post(
            URL,
            headers=headers,
            json=data
        )

        result = response.json()

        print(result)

        if "choices" in result:

            return result["choices"][0]["message"]["content"]

        else:

            return f"LLM Error: {result}"

    except Exception as e:

        return f"Server Error: {str(e)}"