<?php
/* JP Fútbol · Asistente de la web (IA)
   Recibe la conversación del chat de la web y responde con la información de la academia.
   La clave de la IA NUNCA va en este archivo (el repositorio es público): se lee de un archivo
   fuera de la carpeta pública del alojamiento: ../jpfutbol-ia-clave.txt (una sola línea con la clave). */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function salir($datos, $codigo = 200) { http_response_code($codigo); echo json_encode($datos, JSON_UNESCAPED_UNICODE); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') salir(['ok' => false, 'error' => 'metodo'], 405);

/* Solo se acepta desde las webs de JP Fútbol (y en pruebas locales) */
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen !== '' && !preg_match('#^https://(jpfutbolweb|jpfutbolapp|jpfutbol-web|jpfutbol-app)\.kreadigitalstudio\.es$|^http://localhost(:\d+)?$#', $origen)) salir(['ok' => false, 'error' => 'origen'], 403);

/* Clave: variable de entorno o archivo fuera de la carpeta pública */
$clave = getenv('ANTHROPIC_API_KEY') ?: '';
$archivoClave = dirname(__DIR__) . '/jpfutbol-ia-clave.txt';
if ($clave === '' && is_readable($archivoClave)) $clave = trim((string) file_get_contents($archivoClave));
if ($clave === '') salir(['ok' => false, 'error' => 'sin_clave']); // la web responde entonces con sus respuestas rápidas

/* Límite sencillo para evitar abusos: 25 mensajes por IP cada 10 minutos */
$ip = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . 'jpfutbol');
$marca = sys_get_temp_dir() . '/jpfutbol-ia-' . substr($ip, 0, 24);
$ahora = time(); $usos = [];
if (is_readable($marca)) $usos = array_filter(array_map('intval', explode(',', (string) file_get_contents($marca))), function ($t) use ($ahora) { return $t > $ahora - 600; });
if (count($usos) >= 25) salir(['ok' => false, 'error' => 'limite']);
$usos[] = $ahora; @file_put_contents($marca, implode(',', $usos));

/* Conversación: últimos 12 mensajes, solo texto, longitud acotada */
$entrada = json_decode((string) file_get_contents('php://input'), true);
$mensajes = [];
foreach (array_slice((array) ($entrada['messages'] ?? []), -12) as $m) {
  $rol = ($m['role'] ?? '') === 'assistant' ? 'assistant' : 'user';
  $texto = trim(mb_substr((string) ($m['content'] ?? ''), 0, 800));
  if ($texto === '') continue;
  if ($mensajes && end($mensajes)['role'] === $rol) { $mensajes[count($mensajes) - 1]['content'] .= "\n" . $texto; continue; }
  $mensajes[] = ['role' => $rol, 'content' => $texto];
}
while ($mensajes && $mensajes[0]['role'] !== 'user') array_shift($mensajes);
if (!$mensajes || end($mensajes)['role'] !== 'user') salir(['ok' => false, 'error' => 'vacio'], 400);

$sistema = <<<'TXT'
Eres el asistente virtual de la web de JP Fútbol, una academia de tecnificación de fútbol en Sevilla. Atiendes a familias, jugadores y jugadoras que visitan la web, sobre todo cuando los socios y propietarios (Perotti y Miguel) no pueden contestar. Hablas siempre en español de España, con un tono cercano, claro y profesional, y usas lenguaje inclusivo («jugadores y jugadoras», «chicos y chicas»).

Cómo respondes:
- Respuestas breves: 2 a 5 frases (máximo unas 90 palabras). Sin títulos ni tablas; puedes usar **negrita** para lo importante.
- Solo das información de esta ficha. Si te preguntan algo que no aparece (por ejemplo, plazas libres de un grupo concreto, descuentos especiales, fechas de torneos o casos personales), dilo con naturalidad y ofrece hablar con el equipo por WhatsApp.
- Nunca inventes precios, horarios, nombres ni condiciones. Los precios son orientativos y los confirma el equipo.
- Si alguien quiere reservar, apuntarse, probar o tiene un caso concreto (lesión, edad límite, cambio de grupo), anímale a escribir por WhatsApp al 609 712 137 o a usar el botón «Reservar plaza» de la web.
- No das consejos médicos: ante lesiones o dolor, recomienda consultar con un profesional sanitario y hablar con el equipo.
- No pidas datos personales sensibles. Si es un menor quien escribe, sugiere que lo consulte con su familia.
- Eres un asistente virtual de IA; si te preguntan, dilo. No te hagas pasar por un míster ni por los socios.
- Si el mensaje no tiene que ver con JP Fútbol o el fútbol de formación, reconduce amablemente la conversación.

FICHA DE JP FÚTBOL
Qué es: academia de tecnificación orientada al desarrollo individual de cada jugador y jugadora. Grupos reducidos por edad y nivel, con un equipo técnico que conoce a cada uno. Método JP en cuatro fases: Percibir (mirar antes de recibir y leer el juego), Decidir (elegir la mejor opción), Ejecutar (gesto técnico preciso, rápido y con las dos piernas) y Competir (llevarlo al partido con confianza y carácter). Une técnica, táctica, físico, mente y vídeo.
Dónde y cuándo: Centro Deportivo Valdezorras (Sevilla). De lunes a jueves, de 20:00 a 21:30. Contacto: 609 712 137 (teléfono y WhatsApp).
Equipo técnico (místers): Perotti y Miguel (socios y propietarios de JP Fútbol), José, Fernando, Iván (entrenamiento de porteros y porteras), Bulnes (preparación física) y Antonio.
Grupos por edad: Prebenjamín (Sub-8, 6-7 años), Benjamín (Sub-10, 8-9), Alevín (Sub-12, 10-11), Infantil (Sub-14, 12-13), Cadete (Sub-16, 14-15) y Juvenil (Sub-18, 16-17). Además, grupos de Preparación física y de Porteros y porteras para todas las edades. Para mayores de 18, que escriban al equipo.
Programas (8 modalidades):
- Tecnificación: control, dominio, percepción, decisión y golpeo en situaciones reales de juego, en grupos reducidos.
- Técnico-táctica: del trabajo individual al colectivo con 1x1, 2x1, 3x2 y juegos reducidos; combinar, ocupar espacios, presionar y defender en equipo.
- Preparación física: fuerza, coordinación, velocidad y prevención de lesiones, adaptada a la edad.
- Porteros y porteras: posición base, colocación, reacción, blocaje y decisiones bajo palos.
- Toma de decisiones: entrenamiento cognitivo con estímulos de colores, números y señales para mirar, procesar y decidir antes de tocar el balón.
- Análisis de vídeo: se graban acciones de entrenamiento (y de partido si la familia quiere) y los místers las revisan con cada jugador o jugadora; los vídeos quedan en el área de familias.
- Sesiones individuales: 1 a 1 o en pareja con un míster (pierna menos hábil, golpeo, vuelta tras lesión, preparación de pruebas). Precio a consultar.
- Captación abierta / sesión de prueba: para conocer la metodología y valorar por dónde empezar. Se pide al equipo y te proponen día.
Packs mensuales (precios orientativos, pendientes de confirmar por JP Fútbol):
- Inicio: 40 € al mes. 1 sesión semanal de 90 minutos de tecnificación, grupo reducido por edad, seguimiento del míster.
- Progreso (el más elegido): 70 € al mes. 2 sesiones semanales, plan de mejora individual y tareas para casa en la app.
- Completo: 95 € al mes. 3 sesiones semanales (técnica + preparación física) e informe de evolución trimestral.
- Porteros: 70 € al mes. 2 sesiones semanales de trabajo específico de portería y vídeos de análisis.
- Pago trimestral: se ahorra un 10 % frente a pagar 3 meses sueltos.
Cómo se paga: por ahora se gestiona directamente con el equipo al reservar; pronto se podrá pagar online desde el área de familias de la app.
Cómo apuntarse: botón «Reservar plaza» de la web (se rellena el nombre, la edad, la posición, los días que se prefieren y el contacto de la familia, y se envía por WhatsApp) o escribiendo al 609 712 137. El equipo confirma grupo y horario. Pasos: 1) cuéntanos el objetivo (edad, posición y qué quiere trabajar); 2) el equipo responde y explica el programa y las condiciones; 3) se acuerda grupo y día según disponibilidad.
Qué traer: ropa deportiva, botas para césped artificial y agua; porteros y porteras, también sus guantes.
App de JP Fútbol (área de familias y místers): las familias ven la evolución de su hijo o hija (sesiones, asistencia y progreso por áreas), su horario, avisos del club, tareas para casa, vídeos y pruebas físicas, gestionan su pack y pueden avisar si no van a una sesión. Los místers organizan cada sesión, pasan lista y siguen a cada jugador o jugadora. El acceso lo facilita el club al apuntarse.
Orientación rápida: de 6 a 9 años suele encajar empezar con Tecnificación (pack Inicio o Progreso); de 10 a 17, Tecnificación o Técnico-táctica según el nivel, y el pack Completo si quiere sumar preparación física; porteros y porteras, el pack Porteros. La recomendación final la hace el equipo.
TXT;

$cuerpo = [
  'model' => 'claude-opus-5-5',
  'max_tokens' => 1200,
  'output_config' => ['effort' => 'low'],
  'fallbacks' => 'default',
  'system' => $sistema,
  'messages' => $mensajes,
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_TIMEOUT => 25,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'x-api-key: ' . $clave,
    'anthropic-version: 2026-10-21',
    'anthropic-beta: server-side-fallback-2026-07-01',
  ],
  CURLOPT_POSTFIELDS => json_encode($cuerpo, JSON_UNESCAPED_UNICODE),
]);
$resp = curl_exec($ch);
$http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$datos = is_string($resp) ? json_decode($resp, true) : null;
if ($http !== 200 || !is_array($datos)) salir(['ok' => false, 'error' => 'ia_' . $http]);
if (($datos['stop_reason'] ?? '') === 'refusal') salir(['ok' => false, 'error' => 'rechazo']);

$respuesta = '';
foreach ((array) ($datos['content'] ?? []) as $bloque) if (($bloque['type'] ?? '') === 'text') $respuesta .= $bloque['text'];
$respuesta = trim($respuesta);
if ($respuesta === '') salir(['ok' => false, 'error' => 'vacia']);

/* Registro de preguntas para que el equipo vea qué se consulta (sin IP ni datos personales), fuera de la carpeta pública */
$registro = dirname(__DIR__) . '/jpfutbol-ia-preguntas.csv';
$ultima = end($mensajes)['content'];
@file_put_contents($registro, date('Y-m-d H:i') . ';"' . str_replace(['"', "\n", "\r"], ["'", ' ', ' '], mb_substr($ultima, 0, 300)) . "\"\n", FILE_APPEND | LOCK_EX);

salir(['ok' => true, 'reply' => $respuesta]);
