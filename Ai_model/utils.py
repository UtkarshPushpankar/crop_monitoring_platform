from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import HumanMessage
import os, base64


load_dotenv()
key = os.getenv("google_api_key")

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.0-flash",
    temperature=0.7,
    google_api_key=key
)


prompt = PromptTemplate(
    input_variables=['messages', 'query', 'language'],
    template="""
You are a professional agricultural expert with in-depth knowledge of crops, soil, trees, fertilizers, pesticides, and all farming-related topics.
You always provide clear, accurate, and helpful advice using multiple sources of knowledge. 

You are given:
- Previous conversation messages: {messages}
- Current user query: {query}
- Desired language for response: {language}

Instructions:
1. Answer the user's question based on the previous conversation context.
2. Only provide answers if the query is related to farming, soil, crops, trees, fertilizers, pesticides, OR explanation of graphs/charts related to agriculture.
3. If the query is NOT related to farming or agricultural graphs/charts, politely respond: 
   "I'm sorry, I can only provide advice on farming, crops, soil, trees, pesticides, or agricultural graphs/charts."
4. Respond in the language specified by {language}.
5. Keep responses concise and to the point.
6. Always maintain a professional and respectful tone.
7. Maximum 50 words.

Provide your answer concisely, clearly, and in {language}.

Answer:
"""
)


chain = LLMChain(llm=llm, prompt=prompt)

# ---------- TEXT ONLY ----------
def getAnswer(messages, query, language):
    res = chain.invoke({"messages": messages, "query": query, "language": language})
    return res["text"]

# ---------- IMAGE + TEXT ----------
def getAnswerWithImage(messages, query, language, image_path):
    """
    Handles queries with both text + image (crops, soil, leaves, graphs, charts).
    """
    with open(image_path, "rb") as f:
        img_b64 = base64.b64encode(f.read()).decode("utf-8")

    content = [
        {
            "type": "text",
            "text": f"""
You are a professional agricultural expert.
Previous messages: {messages}
User query: {query}
Language: {language}

Instructions:
1. Analyze the uploaded image (crop health, soil condition, leaf issues, or agricultural graphs/charts).
2. Combine insights from image + query to give advice.
3. If the query is not related to farming or agricultural graphs/charts → respond: 
   "I'm sorry, I can only provide advice on farming, crops, soil, trees, pesticides, or agricultural graphs/charts."
4. Keep answer max 50 words, clear, professional.
"""
        },
        {
            "type": "image_url",
            "image_url": f"data:image/jpeg;base64,{img_b64}"
        }
    ]

    # Call Gemini with multimodal input
    response = llm.invoke([HumanMessage(content=content)])
    return response.content
