import json
import os
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types

# El "Mega-Prompt" con el contexto de la universidad. El usuario nunca verá esto.
MEGA_PROMPT = """Eres el Asesor Virtual oficial de Universidad Galileo. 
Tu objetivo es orientar a estudiantes de bachillerato a elegir su ingeniería.

INFORMACIÓN OFICIAL:
- Sistemas: 9 semestres. Desarrollo de software, IA, ciberseguridad. 
- Mecatrónica: 10 semestres. Robótica, control automático, circuitos.
- Industrial: 9 semestres. Optimización de procesos, logística.
- Construcción: 9 semestres. Diseño estructural, obras.

REGLAS DE INTERACCIÓN:
1. Sé empático, amigable y directo. Habla de "tú".
2. Mantén tus respuestas muy breves (máximo 3 o 4 líneas).
3. Si preguntan precios, responde: "Para costos exactos, contacta a admisiones@galileo.edu". No inventes datos.
"""

class handler(BaseHTTPRequestHandler):
    # Configuración CORS: Permite que tu frontend en React se comunique con esta API
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    # Maneja la petición real del chat
    def do_POST(self):
        try:
            # 1. Leer los datos enviados por React
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            req_body = json.loads(post_data)
            
            user_messages = req_body.get("messages", [])
            
            # Obtener solo el último mensaje del usuario para enviarlo a la IA
            last_user_message = user_messages[-1]['content'] if user_messages else ""
            
            # 2. Inicializar el NUEVO cliente de Gemini (toma la API key del entorno)
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            
            # 3. Llamar al modelo con la NUEVA sintaxis
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=last_user_message,
                config=types.GenerateContentConfig(
                    system_instruction=MEGA_PROMPT,
                )
            )
            
            # 4. Enviar la respuesta de vuelta a React en formato JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            respuesta_json = json.dumps({"respuesta": response.text})
            self.wfile.write(respuesta_json.encode('utf-8'))
            
        except Exception as e:
            # Manejo de errores para que la API no se caiga silenciosamente
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))