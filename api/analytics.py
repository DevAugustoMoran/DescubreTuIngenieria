import os
import json
from http.server import BaseHTTPRequestHandler
from supabase import create_client, Client
from google import genai
from google.genai import types

# Conexión a Supabase
url: str = os.environ.get("SUPABASE_URL", "https://ehxuzdtewqfcbqrmujyn.supabase.co/rest/v1/")
key: str = os.environ.get("SUPABASE_KEY", "sb_publishable_4_yZ1k4pNciW181n9doiuw_AiIXMcy6")
supabase: Client = create_client(url, key) if url and key else None

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
                # Prompt para parametrizar la intención
                PROMPT = """
                Analiza al estudiante según la carrera que eligió.
                Clasifícalo en UNO de estos perfiles estrictamente:
                - "Usuario dudoso": No sabe qué elegir, indeciso.
                - "Usuario captado": Interés en el plan de estudios y la carrera.
                - "Usuario decidido": Pregunta por inscripción, pagos o fechas.
                
                Responde ÚNICAMENTE en JSON: {"perfil": "Usuario captado", "justificacion": "Breve razón"}
                """
                
                client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
                response = client.models.generate_content(
                    model='gemini-3.1-flash-lite',
                    contents=f"El estudiante completó la ruta para: {req_body.get('carrera_id')}. Nivel mates: {req_body.get('math')}, Nivel física: {req_body.get('physics')}. Tiempo: {req_body.get('hours')}h/sem.",
                    config=types.GenerateContentConfig(
                        system_instruction=PROMPT,
                        response_mime_type="application/json",
                    )
                )
                
                ia_data = json.loads(response.text)
                
                if supabase:
                    supabase.table("leads").insert({
                        "nombre": req_body.get("nombre"),
                        "correo": req_body.get("correo"),
                        "carrera_interes": req_body.get("carrera_id"),
                        "perfil_ia": ia_data.get("perfil"),
                        "resumen_ia": ia_data.get("justificacion")
                    }).execute()
                    
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