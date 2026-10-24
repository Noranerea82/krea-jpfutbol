<?php
/* JP Fútbol · Mensajes entre familias y místers y avisos del club (versión de presentación)
   Guarda todo en un archivo fuera de la carpeta pública: ../../jpfutbol-mensajes.json
   GET  → conversaciones y avisos
   POST {pid, f, by, t}            → nuevo mensaje (f: fam = familia, mis = míster)
   POST {pid, read: 'mis'}         → la familia ha leído los mensajes del míster (o 'fam' al revés)
   POST {aviso: {ty, to, by, txt}} → nuevo aviso del club
   POST {reset: true}              → vacía los mensajes y avisos de prueba */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function salir($datos, $codigo = 200) { http_response_code($codigo); echo json_encode($datos, JSON_UNESCAPED_UNICODE); exit; }
function respuesta($m, $a) { return ['ok' => true, 'msgs' => (object) $m, 'avisos' => array_values($a)]; }

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
$todo = json_decode((string) stream_get_contents($fp), true);
if (!is_array($todo)) $todo = [];
$datos = isset($todo['m']) && is_array($todo['m']) ? $todo['m'] : [];
$avisos = isset($todo['a']) && is_array($todo['a']) ? $todo['a'] : [];

if (!$post) { flock($fp, LOCK_UN); fclose($fp); salir(respuesta($datos, $avisos)); }

$e = json_decode((string) file_get_contents('php://input'), true);
$id = is_array($e) ? (string) ($e['pid'] ?? '') : '';
$limpio = function ($s, $n) { return trim(mb_substr((string) $s, 0, $n)); };
$error = '';
if (!is_array($e)) $error = 'datos';
elseif (!empty($e['reset'])) { $datos = []; $avisos = []; }
elseif (isset($e['aviso']) && is_array($e['aviso'])) {
  $a = $e['aviso'];
  $texto = $limpio($a['txt'] ?? '', 400);
  $tipo = in_array($a['ty'] ?? '', ['info', 'hora', 'susp', 'pago'], true) ? $a['ty'] : 'info';
  $para = preg_match('/^[a-z]{2,8}$/', (string) ($a['to'] ?? '')) ? $a['to'] : 'all';
  if ($texto === '') $error = 'vacio';
  else {
    array_unshift($avisos, ['id' => 's' . time() . mt_rand(100, 999), 'ty' => $tipo, 'to' => $para, 'by' => $limpio(preg_replace('/[^\p{L} .\-]/u', '', (string) ($a['by'] ?? '')), 30), 'd' => gmdate('c'), 'txt' => $texto]);
    $avisos = array_slice($avisos, 0, 30);
  }
}
elseif (!preg_match('/^[a-z0-9]{1,24}$/i', $id)) $error = 'jugador';
elseif (isset($e['read'])) {
  $lado = $e['read'] === 'mis' ? 'mis' : 'fam';
  foreach ($datos[$id] ?? [] as $i => $m) if (($m['f'] ?? '') === $lado) $datos[$id][$i]['r'] = true;
} else {
  $texto = $limpio($e['t'] ?? '', 500);
  if ($texto === '') $error = 'vacio';
  else {
    $datos[$id][] = ['f' => ($e['f'] ?? '') === 'mis' ? 'mis' : 'fam', 'by' => $limpio(preg_replace('/[^\p{L} .\-]/u', '', (string) ($e['by'] ?? '')), 30), 't' => $texto, 'at' => gmdate('c'), 'r' => false];
    $datos[$id] = array_slice($datos[$id], -80);
    if (count($datos) > 60) $datos = array_slice($datos, -60, null, true);
  }
}
if ($error === '') { ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode(['m' => (object) $datos, 'a' => array_values($avisos)], JSON_UNESCAPED_UNICODE)); fflush($fp); }
flock($fp, LOCK_UN); fclose($fp);
if ($error !== '') salir(['ok' => false, 'error' => $error], 400);
salir(respuesta($datos, $avisos));
