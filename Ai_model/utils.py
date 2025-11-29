from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.schema import HumanMessage
import os, base64

import numpy as np

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
You are a professional agricultural expert with deep knowledge of crops, soil, trees, fertilizers, pesticides, and all farming topics.
You always provide clear, accurate, and helpful advice.

You are given:
- Previous conversation messages: {messages}
- Current user query: {query}
- Desired language for response: {language}

Instructions:
1. Answer the user's question based on the previous conversation context.
2. Only answer if the query is related to farming, soil, crops, trees, fertilizers, pesticides, or agricultural graphs/charts.
3. If the query is NOT related, politely respond: 
   "I'm sorry, I can only provide advice on farming, crops, soil, trees, pesticides, or agricultural graphs/charts."
4. Respond **directly in {language}**, using readable text, **without any Unicode escape sequences**.
5. Keep responses concise and professional.
6. Maximum 50 words.

Answer in **{language}** (no Unicode escape codes, plain readable text):
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


e_c_loss_treatment = 0                                        
e_c_loss_no_treatment = 868                                   
e_c_treatment_application = 795                                 
e_c_monitoring = 48                                          
e_c_treatment_treatment = e_c_treatment_application/10 - 24 

def expected_cost(
    p_pest,                     # probability of pest occurence
    treatment,                  # treatment indicator (decision variable)
    e_c_loss_treatment,         # expected cost of yield loss given treatment
    e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
    e_c_treatment_treatment,    # expected cost of treatment given treatment
):
    e_c_loss_pest = treatment * e_c_loss_treatment \
             + (1-treatment) * e_c_loss_no_treatment
    e_c_loss = p_pest * e_c_loss_pest

    e_c_treatment = treatment * e_c_treatment_treatment
    return e_c_loss + e_c_treatment


def expected_hat_cost(
    p_pest,                     # probability of pest occurence
    treatment,                  # treatment indicator (decision variable)
    e_c_loss_treatment,         # expected cost of yield loss given treatment
    e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
    e_c_treatment_treatment,    # expected cost of treatment given treatment
):
    e_c = expected_cost(
        p_pest,
        treatment,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    )

    shift = p_pest * e_c_loss_no_treatment
    return e_c - shift

def e_c_hat_given_no_ppi(
    p_pest,                     # probability of pest occurence
    e_c_loss_treatment,         # expected cost of yield loss given treatment
    e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
    e_c_treatment_treatment,    # expected cost of treatment given treatment
):
    e_c_treatment = expected_hat_cost(
        p_pest,
        1,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    )
    e_c_no_treatment = expected_hat_cost(
        p_pest,
        0,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    )
    return np.minimum(e_c_treatment, e_c_no_treatment)

def e_c_hat_given_ppi(
    p_pest,                     # probability of pest occurence
    e_c_loss_treatment,         # expected cost of yield loss given treatment
    e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
    e_c_treatment_treatment,    # expected cost of treatment given treatment
):
    return p_pest * expected_hat_cost(
        1,
        1,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    )

def evppi(
    p_pest,                     # probability of pest occurence
    e_c_loss_treatment,         # expected cost of yield loss given treatment
    e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
    e_c_treatment_treatment,    # expected cost of treatment given treatment
):
    return e_c_hat_given_no_ppi(
        p_pest,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    ) - \
    e_c_hat_given_ppi(
        p_pest,
        e_c_loss_treatment,
        e_c_loss_no_treatment,
        e_c_treatment_treatment,
    )

def e_u_gamma(p_alpha, gamma):
    if gamma == 0:
        return p_alpha * 0
    elif gamma == 1:
        return p_alpha * (e_c_loss_no_treatment - e_c_loss_treatment - e_c_treatment_treatment) - e_c_monitoring
    elif gamma == 2:
        return p_alpha * (e_c_loss_no_treatment - e_c_loss_treatment) - e_c_treatment_treatment