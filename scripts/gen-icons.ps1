# 生成 PWA 图标（192 / 512 / maskable-512）
# 用法：powershell -File scripts/gen-icons.ps1
# 依赖：Windows PowerShell 5.1+（System.Drawing）
# 风格：新粗野主义 —— 荧光绿底 #ccff00 + 纯黑粗边框 + 居中 "?" 符号

Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\public\icons'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function New-CardIcon {
  param(
    [int]$Size,
    [string]$Path,
    [float]$GlyphScale = 0.5,
    [switch]$Maskable
  )
  $bmp = New-Object System.Drawing.Bitmap($Size, $Size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  # 荧光绿底 #ccff00
  $g.Clear([System.Drawing.Color]::FromArgb(255, 204, 255, 0))
  if (-not $Maskable) {
    # 黑色粗边框（新粗野主义卡片感）
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, [float]($Size * 0.1))
    $pad = [int]($Size * 0.05)
    $g.DrawRectangle($pen, $pad, $pad, ($Size - 2 * $pad), ($Size - 2 * $pad))
  }
  # 居中 "?" 符号（maskable 版缩小以留出安全区）
  $font = New-Object System.Drawing.Font('Arial', [float]($Size * $GlyphScale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
  $sf = New-Object System.Drawing.StringFormat
  $sf.Alignment = [System.Drawing.StringAlignment]::Center
  $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
  $g.DrawString('?', $font, $brush, $rect, $sf)
  $g.Dispose()
  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

New-CardIcon -Size 192 -Path (Join-Path $outDir 'icon-192.png')
New-CardIcon -Size 512 -Path (Join-Path $outDir 'icon-512.png')
New-CardIcon -Size 512 -Path (Join-Path $outDir 'icon-maskable-512.png') -GlyphScale 0.35 -Maskable

Write-Output 'Icons generated:'
Get-ChildItem $outDir | ForEach-Object { Write-Output ("  {0}  ({1} bytes)" -f $_.Name, $_.Length) }
