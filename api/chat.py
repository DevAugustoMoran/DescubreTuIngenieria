import json
import os
import smtplib
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler
from google import genai
from google.genai import types
from supabase import create_client, Client
from fpdf import FPDF

# Conexión a Supabase
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")
supabase: Client = create_client(url, key) if url and key else None

# --- FUNCIONES DE PDF Y CORREO ---

def generar_pdf(nombre, carrera, horas="algunas"):
    pdf = FPDF()
    pdf.add_page()
    
    # Diseño estético (Azul oscuro institucional)
    pdf.set_fill_color(15, 23, 42)
    pdf.rect(0, 0, 210, 40, 'F')
    
    # Cabecera
    pdf.set_text_color(255, 255, 255)
    pdf.set_font("helvetica", 'B', 20)
    pdf.cell(0, 20, "UNIVERSIDAD GALILEO", border=0, ln=1, align='C')
    pdf.set_font("helvetica", 'I', 12)
    pdf.cell(0, 5, "Tu ruta hacia el éxito profesional", border=0, ln=1, align='C')
    
    # Título de la carrera
    pdf.ln(15)
    pdf.set_text_color(30, 41, 59)
    pdf.set_font("helvetica", 'B', 16)
    pdf.cell(0, 10, f"Plan Estratégico: {carrera}", border=0, ln=1, align='C')
    
    # Cuerpo del texto
    pdf.ln(10)
    pdf.set_font("helvetica", '', 12)
    texto = f"Hola {nombre},\n\nCon base en tu perfil y tu interés en {carrera}, hemos estructurado los siguientes pasos para ti:\n\n1. Fundamentos: Refuerza tus bases en matemáticas y física.\n2. Inmersión: Comienza a explorar los conceptos base de la carrera.\n3. Especialización: Únete a nuestros laboratorios prácticos.\n\nEl equipo de admisiones se pondrá en contacto contigo pronto."
    
    pdf.multi_cell(0, 8, texto)
    
    # En Vercel, los archivos temporales solo se pueden guardar en /tmp/
    ruta = "/tmp/Plan_Galileo.pdf"
    pdf.output(ruta)
    return ruta

def enviar_correo(destinatario, nombre, ruta_pdf, carrera):
    remitente = os.environ.get("EMAIL_USER")
    password = os.environ.get("EMAIL_PASS")
    
    if not remitente or not password:
        print("Faltan credenciales de correo electrónico.")
        return

    msg = EmailMessage()
    msg['Subject'] = f'Tu Plan de Estudio: {carrera} - Universidad Galileo'
    msg['From'] = remitente
    msg['To'] = destinatario
    msg.set_content(f"Hola {nombre},\n\nGracias por conversar con nosotros. Adjunto encontrarás tu plan de estudio estratégico en formato PDF.\n\n¡Te esperamos en clase!")

    with open(ruta_pdf, 'rb') as f:
        pdf_data = f.read()
        
    msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename='Plan_Estudio_Galileo.pdf')

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(remitente, password)
        server.send_message(msg)

# ---------------------------------

# 1. Leer el archivo de texto con la información de los PDFs
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
8. Si el estudiante muestra interés genuino en la carrera o solicita más información detallada, pídele amablemente su correo electrónico para enviarle su plan de estudios personalizado en PDF. No se lo pidas en el primer mensaje, evalúa la conversación primero.

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
"""

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            req_body = json.loads(post_data)
            
            mensajes_frontend = req_body.get("messages", [])
            carrera_id = req_body.get("carrera_id", "Ingeniería en Sistemas") # Carrera por defecto si no se especifica
            
            # Formatear el historial para Gemini
            gemini_history = []
            texto_completo_chat = ""
            ultimo_mensaje_usuario = ""

            for msg in mensajes_frontend:
                role = "user" if msg.get("role") == "user" else "model"
                texto = msg.get("content", "")
                
                if role == "user":
                    ultimo_mensaje_usuario = texto
                
                if texto.strip():
                    gemini_history.append({
                        "role": role,
                        "parts": [{"text": texto}]
                    })
                    texto_completo_chat += f"{role.upper()}: {texto}\n"
            
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            
            # 1. Obtener la respuesta normal del chatbot conversacional
            response = client.models.generate_content(
                model='gemini-3.1-flash-lite',
                contents=gemini_history,
                config=types.GenerateContentConfig(
                    system_instruction=MEGA_PROMPT,
                )
            )
            
            respuesta_chatbot = response.text

            # 2. DETECTOR INTELIGENTE DE CORREOS EN EL ÚLTIMO MENSAJE
            import re
            email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
            match_correo = re.search(email_regex, ultimo_mensaje_usuario)

            if match_correo and supabase:
                correo_detectado = match_correo.group(0)

                # 3. LLAMADA SECUNDARIA A GEMINI PARA PERFILAR LA CONVERSACIÓN
                PROMPT_PERFIL = """
                Analiza la siguiente conversación entre un estudiante y un orientador vocacional.
                Clasifica al estudiante ESTRICTAMENTE en UNO de estos 3 perfiles:
                - "Usuario dudoso": Hace preguntas muy generales, sigue indeciso, no sabe qué elegir.
                - "Usuario captado": Muestra interés estándar, dio su correo de forma natural tras recibir información.
                - "Usuario decidido": Pregunta por inscripciones, fechas, precios o afirma estar seguro de estudiar.
                
                Responde ÚNICAMENTE en JSON: {"perfil": "Usuario...", "justificacion": "Breve razón del análisis"}
                """
                
                response_perfil = client.models.generate_content(
                    model='gemini-3.1-flash-lite',
                    contents=f"Historial del chat:\n{texto_completo_chat}",
                    config=types.GenerateContentConfig(
                        system_instruction=PROMPT_PERFIL,
                        response_mime_type="application/json",
                    )
                )
                
                ia_data = json.loads(response_perfil.text)

                # 4. GUARDAR EN SUPABASE
                supabase.table("leads").insert({
                    "nombre": "Estudiante vía Chat",
                    "correo": correo_detectado,
                    "carrera_interes": carrera_id,
                    "perfil_ia": ia_data.get("perfil"),
                    "resumen_ia": ia_data.get("justificacion")
                }).execute()

                # 5. GENERAR PDF Y ENVIAR CORREO AUTOMÁTICO
                try:
                    ruta_pdf = generar_pdf("Estudiante", carrera_id)
                    enviar_correo(correo_detectado, "Estudiante", ruta_pdf, carrera_id)
                except Exception as mail_err:
                    print(f"Error enviando correo automático desde el chat: {mail_err}")

            # 6. Devolver la respuesta del chat al frontend
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            respuesta_json = json.dumps({"respuesta": respuesta_chatbot})
            self.wfile.write(respuesta_json.encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))