<?php
/* JP Fútbol · Página temporal para guardar la clave de la IA del asistente.
   - Solo guarda la clave si todavía no hay ninguna (no se puede cambiar desde aquí).
   - Comprueba con Anthropic que la clave funciona antes de guardarla.
   - La guarda fuera de la carpeta pública: ../jpfutbol-ia-clave.txt
   Se retira del repositorio en cuanto la clave está puesta. */

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
$archivo = dirname(__DIR__) . '/jpfutbol-ia-clave.txt';
$estado = ''; $tipo = '';

if (is_file($archivo) && filesize($archivo) > 0) {
  $estado = 'La clave de la IA ya está guardada. El asistente de la web ya puede usarla. Esta página ya no hace nada.'; $tipo = 'ok';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $clave = trim((string) ($_POST['clave'] ?? ''));
  if (!preg_match('/^sk-ant-[A-Za-z0-9_\-]{20,}$/', $clave)) {
    $estado = 'Esa clave no tiene el formato de una clave de Anthropic (empieza por «sk-ant-»). Revisa que la has copiado entera.'; $tipo = 'mal';
  } else {
    $ch = curl_init('https://api.anthropic.com/v1/models');
    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20, CURLOPT_HTTPHEADER => ['x-api-key: ' . $clave, 'anthropic-version: 2026-10-21']]);
    curl_exec($ch); $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if ($http === 200) {
      if (@file_put_contents($archivo, $clave . "\n", LOCK_EX) !== false) { @chmod($archivo, 0600); $estado = '¡Listo! La clave funciona y se ha guardado en privado. El asistente de la web ya responde con IA.'; $tipo = 'ok'; }
      else { $estado = 'La clave funciona, pero el servidor no ha dejado guardarla. Avisa a KREA.'; $tipo = 'mal'; }
    } elseif ($http === 401 || $http === 403) { $estado = 'Anthropic dice que esa clave no es válida o no tiene permiso. Crea una nueva y vuelve a probar.'; $tipo = 'mal'; }
    else { $estado = 'No se ha podido comprobar la clave ahora mismo (código ' . $http . '). Prueba de nuevo en un momento.'; $tipo = 'mal'; }
  }
}
$guardada = is_file($archivo) && filesize($archivo) > 0;
?><!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>JP Fútbol · Clave del asistente</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#050505;color:#F8F6EF;font-family:system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px}
.c{width:min(460px,100%);background:#0E0E0C;border:1px solid #2A2822;border-radius:20px;padding:28px}h1{font-size:22px;margin:0 0 8px}p{color:#C9C4B6;line-height:1.5;font-size:15px}
input{width:100%;box-sizing:border-box;height:50px;border-radius:12px;border:1px solid #2A2822;background:#050505;color:#F8F6EF;padding:0 14px;font-size:15px;margin:10px 0 14px}
button{width:100%;height:50px;border:0;border-radius:12px;background:#E2B746;color:#130F05;font-weight:800;font-size:15px;cursor:pointer}
.m{padding:12px 14px;border-radius:12px;margin:0 0 14px;font-size:14.5px}.ok{background:rgba(76,195,138,.14);color:#4CC38A}.mal{background:rgba(240,107,91,.14);color:#F06B5B}small{display:block;color:#9A9588;margin-top:14px;font-size:12.5px}</style></head>
<body><div class="c"><h1>Clave del asistente de JP Fútbol</h1>
<?php if ($estado): ?><div class="m <?= $tipo ?>"><?= htmlspecialchars($estado, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
<?php if (!$guardada): ?>
<p>Pega aquí la clave de API de Anthropic. Se comprueba y se guarda en privado en el alojamiento; no queda en la web ni en GitHub.</p>
<form method="post" autocomplete="off"><input type="password" name="clave" placeholder="sk-ant-..." required aria-label="Clave de API de Anthropic"><button>Comprobar y guardar</button></form>
<?php endif; ?>
<small>© 2026 KREA Digital Studio · Diseño y desarrollo</small></div></body></html>
