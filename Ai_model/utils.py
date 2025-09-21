
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os

load_dotenv()
key  =  os.getenv("google_api_key")


llm =  ChatGoogleGenerativeAI(
    model = "models/gemini-2.0-flash",
    temperature = 0.7,
    google_api_key = key
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
2. Only provide answers if the query is related to farming, soil, crops, trees, fertilizers, or pesticides.
3. If the query is NOT related to farming, politely respond: 
   "I'm sorry, I can only provide advice on farming, crops, soil, trees, or pesticides."
4. Respond in the language specified by {language}.
5. Keep responses concise and to the point.
6. Always maintain a professional and respectful tone.
7. maximum 50 words.

Provide your answer concisely, clearly, and in {language}.

Answer:
"""
)

chain  = LLMChain(llm = llm , prompt = prompt)




def getAnswer(messages, query, language):
    res= chain.invoke({"messages": messages, "query": query, "language": language})
    return res["text"]