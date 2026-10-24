<?php
/* JP Fútbol · Mensajes entre familias y místers (versión de presentación)
   Guarda las conversaciones en un archivo fuera de la carpeta pública: ../../jpfutbol-mensajes.json
   GET  → todas las conversaciones
   POST {pid, f, by, t}     → nuevo mensaje (f: fam = familia, mis = míster)
   POST {pid, read: 'mis'}  → la familia ha leído los mensajes del míster (o 'fam' al revés)
   POST {reset: true}       → vacía los mensajes de prueba */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function salir($datos, $codigo = 200) { http_response_code($codigo); echo json_encode($datos, JSON_UNESCAPED_UNICODE); exit; }

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen !== '' && !preg_match('#^https://(jpfutbolapp|jpfutbol-app)\.kreadigitalstudio\.es$#', $origen)) salir(['ok' => false, 'error' => 'origen'], 403);

$post = $_SERVER['REQUEST_METHOD'] === 'POST';

/* Límite sencillo para evitar abusos: 120 envíos por IP cada 10 minutos */
if ($post) {
  $marca = sys_get_temp_dir() . '/jpfutbol-msg-' . substr(hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . 'jpmsg'), 0, 24);
  $ahora = time(); $usos = [];
  if (is_readable($marca)) $usos = array_filter(array_map('intval', explode(',', (string) file_get_contents($marca))), function ($t) use ($ahora) { return $t > $ahora - 600; });
  if (count($usos) >= 120) salir(['ok' => false, 'error' => 'limite'], 429);
  $usos[] = $ahora; @file_put_contents($marca, implode(',', $usos));
}

$fp = @fopen(dirname(__DIR__, 2) . '/jpfutbol-mensajes.json', 'c+');
if (!$fp) salir(['ok' => false, 'error' => 'almacen'], 500);
flock($fp, $post ? LOCK_EX : LOCK_SH);
$datos = json_decode((string) stream_get_contents($fp), true);
if (!is_array($datos)) $datos = [];

if (!$post) { flock($fp, LOCK_UN); fclose($fp); salir(['ok' => true, 'msgs' => (object) $datos]); }

$e = json_decode((string) file_get_contents('php://input'), true);
$id = is_array($e) ? (string) ($e['pid'] ?? '') : '';
$error = '';
if (!is_array($e)) $error = 'datos';
elseif (!empty($e['reset'])) $datos = [];
elseif (!preg_match('/^[a-z0-9]{1,24}$/i', $id)) $error = 'jugador';
elseif (isset($e['read'])) {
  $lado = $e['read'] === 'mis' ? 'mis' : 'fam';
  foreach ($datos[$id] ?? [] as $i => $m) if (($m['f'] ?? '') === $lado) $datos[$id][$i]['r'] = true;
} else {
  $texto = trim(mb_substr((string) ($e['t'] ?? ''), 0, 500));
  if ($texto === '') $error = 'vacio';
  else {
    $quien = mb_substr(preg_replace('/[^\p{L} .\-]/u', '', (string) ($e['by'] ?? '')), 0, 30);
    $datos[$id][] = ['f' => ($e['f'] ?? '') === 'mis' ? 'mis' : 'fam', 'by' => $quien, 't' => $texto, 'at' => gmdate('c'), 'r' => false];
    $datos[$id] = array_slice($datos[$id], -80);
    if (count($datos) > 60) $datos = array_slice($datos, -60, null, true);
  }
}
if ($error === '') { ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($datos, JSON_UNESCAPED_UNICODE)); fflush($fp); }
flock($fp, LOCK_UN); fclose($fp);
if ($error !== '') salir(['ok' => false, 'error' => $error], 400);
salir(['ok' => true, 'msgs' => (object) $datos]);
