import json
import os
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types

import os
# (Tus otras importaciones...)

# 1. Leer el archivo de texto con la información de los PDFs
# Asegúrate de que la ruta coincida con donde guardaste el archivo txt
ruta_txt = os.path.join(os.path.dirname(__file__), 'conocimiento_universidad.txt')

info_universidad = ""
try:
    with open(ruta_txt, 'r', encoding='utf-8') as file:
        info_universidad = file.read()
except Exception as e:
    print("No se pudo leer el archivo de conocimiento:", e)

# 2. Construir el MEGA_PROMPT inyectando la variable
MEGA_PROMPT = f"""
Eres Galileo, un orientador vocacional de Inteligencia Artificial para la Universidad Galileo. 
Tu objetivo es ayudar a los aspirantes a descubrir su ingeniería ideal de forma conversacional, amigable y profesional.

REGLAS DE COMPORTAMIENTO:
1. Responde de forma concisa y conversacional. No envíes bloques de texto gigantes.
2. Utiliza la BASE DE CONOCIMIENTO para responder preguntas sobre las carreras y la universidad.
3. Si hacen preguntas sobre una carrera en específico, utiliza la BASE DE CONOCIMIENTO para responder correctamente.
4. Si hacen preguntas que no tengan relación con la universidad, la carrera o un entorno educativo, amablemente comunica que no puedes tratar esos temas.
5. Si hacen preguntas sobre otra universidad, di que no tienes información al respecto, pero que con gusto puedes orientar las mejores opciones en esta universidad.
6. Saluda solo la primera vez que escriben. Si el flujo de conversación continúa, trata de que el usuario no se abruma.
7. No abuses de los signos para señalar términos.

--------------------------------------------------
BASE DE CONOCIMIENTO: UNIVERSIDAD GALILEO (EXTRAÍDA DE DOCUMENTOS OFICIALES)
--------------------------------------------------
{info_universidad}

--------------------------------------------------
BASE DE CONOCIMIENTO: INGENIERÍAS DISPONIBLES
--------------------------------------------------
1. Ingeniería en Sistemas, Informática y Ciencias de la Computación:
- Enfoque: Desarrollo de software, IA, bases de datos y arquitectura de sistemas.
- Duración: 9 semestres aprox.
- Salidas: Desarrollo, ciencia de datos, ciberseguridad.
- Catedrático destacado: Ing. Andrea Solís (Ex líder técnica en banca digital).

2. Ingeniería en Mecatrónica:
- Enfoque: Mezcla de mecánica, electrónica y programación para crear máquinas y robots.
- Duración: 10 semestres aprox.
- Salidas: Automatización industrial, robótica, manufactura.
- Catedrático destacado: Ing. Fernando Casasola (Director de proyectos de robótica).

3. Ingeniería Industrial:
- Enfoque: Optimización de procesos, recursos y personas (logística y calidad).
- Duración: 9 semestres aprox.
- Salidas: Operaciones, logística, mejora continua.
- Catedrático destacado: Inga. Paola Recinos (Consultora en manufactura).

4. Ingeniería en la Construcción:
- Enfoque: Diseño estructural, materiales y ejecución de obra civil.
- Duración: 9 semestres aprox.
- Salidas: Diseño estructural, supervisión de obra.
- Catedrático destacado: Ing. Diego Ramírez (Supervisor de megaproyectos).

5. Ingeniería en Telecomunicaciones y Redes Teleinformáticas:
- Enfoque: Diseño y administración de redes de comunicación y fibra óptica.
- Duración: 9 semestres aprox.
- Salidas: Arquitectura de redes, seguridad informática.

6. Ingeniería en Electrónica:
- Enfoque: Circuitos, microcontroladores y diseño de hardware.
- Duración: 9 semestres aprox.
- Salidas: Diseño de hardware, IoT, automatización.

7. Ingeniería Administrativa:
- Enfoque: Combinación de tecnología con gestión, finanzas y estrategia corporativa.
- Duración: 9 semestres aprox.
- Salidas: Dirección general, consultoría tecnológica.

8. Ingeniería Química:
- Enfoque: Transformación de materias primas mediante procesos industriales.
- Duración: 9 semestres aprox.
- Salidas: Industria alimentaria, farmacéutica, petroquímica.

9. Ingeniería en Sistemas Energéticos:
- Enfoque: Energías renovables y gestión de recursos energéticos.
- Duración: 9 semestres aprox.
- Salidas: Gestión de proyectos renovables, eficiencia energética.

--------------------------------------------------
BASE DE CONOCIMIENTO: UNIVERSIDAD GALILEO
--------------------------------------------------
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
                model='gemini-3.1-flash-lite',
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