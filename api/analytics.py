import os
import json
import smtplib
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
from google import genai
from google.genai import types
from fpdf import FPDF

# Conexión a Supabase
url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")
supabase: Client = create_client(url, key) if url and key else None


# --- NUEVAS FUNCIONES: PDF Y CORREO ---

def generar_pdf(nombre, carrera, horas):
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
    texto = f"Hola {nombre},\n\nCon base en tu perfil y tu disponibilidad de {horas} horas semanales, hemos estructurado los siguientes pasos para ti:\n\n1. Fundamentos: Refuerza tus bases en matemáticas y física.\n2. Inmersión: Comienza a explorar los conceptos base de {carrera}.\n3. Especialización: Únete a nuestros laboratorios prácticos.\n\nEl equipo de admisiones se pondrá en contacto contigo pronto."
    
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
    msg.set_content(f"Hola {nombre},\n\nGracias por completar el reto. Adjunto encontrarás tu plan de estudio estratégico en formato PDF.\n\n¡Te esperamos en clase!")

    # Adjuntar el PDF
    with open(ruta_pdf, 'rb') as f:
        pdf_data = f.read()
        
    msg.add_attachment(pdf_data, maintype='application', subtype='pdf', filename='Plan_Estudio_Galileo.pdf')

    # Enviar por SMTP (Gmail)
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(remitente, password)
        server.send_message(msg)

# --- FIN NUEVAS FUNCIONES ---


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
            req_body = json.loads(self.rfile.read(content_length))
            action = req_body.get("action")

            # 1. GUARDAR EVENTO (Uso y Finalización)
            if action == "track_event":
                if supabase:
                    supabase.table("eventos").insert({
                        "evento": req_body.get("evento"),
                        "carrera_id": req_body.get("carrera_id")
                    }).execute()
                
                self._send_success({"status": "ok"})

            # 2. EVALUAR Y GUARDAR LEAD
            elif action == "save_lead":
                chat_history = req_body.get("chat_history")
                carrera_lead = req_body.get("carrera_id")
                correo_lead = req_body.get("correo")
                nombre_lead = req_body.get("nombre", "Estudiante")
                horas_lead = req_body.get("hours", "algunas")

            if chat_history:
                # IA evalúa TODO el contexto de la conversación
                PROMPT = """
                Analiza la siguiente conversación entre un estudiante y un orientador vocacional.
                Clasifica al estudiante ESTRICTAMENTE en UNO de estos 3 perfiles:
                - "Usuario dudoso": Hace preguntas muy generales, sigue indeciso, no sabe qué elegir.
                - "Usuario captado": Muestra interés estándar, dio su correo de forma natural.
                - "Usuario decidido": Pregunta por inscripciones, fechas, precios o afirma estar seguro.
                
                Responde ÚNICAMENTE en JSON: {"perfil": "Usuario...", "justificacion": "Breve razón del análisis"}
                """
                contenido_ia = f"Carrera: {carrera_lead}\n\nHistorial de chat:\n{chat_history}"
            else:
                # IA evalúa datos sueltos (como funcionaba antes por si lo envían por formulario)
                PROMPT = """
                Analiza al estudiante según la carrera que eligió.
                Clasifícalo en UNO de estos perfiles estrictamente:
                - "Usuario dudoso", "Usuario captado", o "Usuario decidido".
                Responde ÚNICAMENTE en JSON: {"perfil": "Usuario captado", "justificacion": "Breve razón"}
                """
                contenido_ia = f"Carrera: {carrera_lead}. Nivel mates: {req_body.get('math')}, Física: {req_body.get('physics')}. Tiempo: {horas_lead}h/sem."

            # Llamada a Gemini
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            response = client.models.generate_content(
                model='gemini-3.1-flash-lite',
                contents=contenido_ia,
                config=types.GenerateContentConfig(
                    system_instruction=PROMPT,
                    response_mime_type="application/json",
                )
            )
            
            ia_data = json.loads(response.text)
            
            # Guardar en base de datos
            if supabase:
                supabase.table("leads").insert({
                    "nombre": nombre_lead,
                    "correo": correo_lead,
                    "carrera_interes": carrera_lead,
                    "perfil_ia": ia_data.get("perfil"),
                    "resumen_ia": ia_data.get("justificacion")
                }).execute()
            
            # EJECUCIÓN DE PDF Y CORREO
            if correo_lead:
                try:
                    ruta_pdf = generar_pdf(nombre_lead, carrera_lead, horas_lead)
                    enviar_correo(correo_lead, nombre_lead, ruta_pdf, carrera_lead)
                except Exception as e:
                    print(f"Fallo al enviar correo SMTP: {e}")
                    
            self._send_success({"status": "ok"})

        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def _send_success(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))