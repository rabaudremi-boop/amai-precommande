# Generates all PWA + favicon assets from a single source logo.
#
# Usage (from project root):
#   pwsh ./tools/build-icons.ps1
#   pwsh ./tools/build-icons.ps1 -SourcePath "C:\path\to\logo.png"
#
# By default, looks for public/logo-amai.png as the source.
# Outputs:
#   public/apple-touch-icon.png  (180x180, padded on cream)
#   public/icon-192.png          (192x192, padded on cream)
#   public/icon-512.png          (512x512, padded on cream)
#   public/icon-512-maskable.png (512x512, sage bg, logo at 60% safe zone)
#   public/favicon.png           (64x64, padded on cream)

param(
  [string]$SourcePath = $null
)

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicDir = Join-Path $projectRoot 'public'
if (-not $SourcePath) {
  $SourcePath = Join-Path $publicDir 'logo-amai.png'
}

if (-not (Test-Path $SourcePath)) {
  Write-Host "ERROR: source logo not found at $SourcePath" -ForegroundColor Red
  Write-Host "Drop your A Maï logo as 'public/logo-amai.png' or pass -SourcePath." -ForegroundColor Yellow
  exit 1
}

Write-Host "Source: $SourcePath" -ForegroundColor Cyan

$cream = [System.Drawing.Color]::FromArgb(245, 240, 225)
$sage = [System.Drawing.Color]::FromArgb(143, 181, 155)

$source = [System.Drawing.Image]::FromFile($SourcePath)
Write-Host "Source size: $($source.Width)x$($source.Height)"

function Render-Icon {
  param(
    [int]$Size,
    [string]$OutPath,
    [bool]$Maskable = $false
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  if ($Maskable) {
    # Sage background, logo occupies inner 60% (safe zone)
    $g.Clear($sage)
    $inner = [int]($Size * 0.6)
    $offset = [int](($Size - $inner) / 2)
    # Re-render logo onto cream rounded square in center for legibility
    $bgRect = New-Object System.Drawing.RectangleF($offset, $offset, $inner, $inner)
    $brush = New-Object System.Drawing.SolidBrush $cream
    $g.FillRectangle($brush, $bgRect)
    $brush.Dispose()
    # Draw logo scaled to inner, contained
    $logoSize = [int]($inner * 0.85)
    $logoOffset = [int]($offset + ($inner - $logoSize) / 2)
    $g.DrawImage($source, $logoOffset, $logoOffset, $logoSize, $logoSize)
  } else {
    # Cream background, logo contained with 8% padding
    $g.Clear($cream)
    $padding = [int]($Size * 0.08)
    $logoSize = $Size - 2 * $padding
    $g.DrawImage($source, $padding, $padding, $logoSize, $logoSize)
  }

  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose()
  $bmp.Dispose()
  Write-Host "  -> $OutPath" -ForegroundColor Green
}

Render-Icon -Size 180 -OutPath (Join-Path $publicDir 'apple-touch-icon.png')
Render-Icon -Size 192 -OutPath (Join-Path $publicDir 'icon-192.png')
Render-Icon -Size 512 -OutPath (Join-Path $publicDir 'icon-512.png')
Render-Icon -Size 512 -OutPath (Join-Path $publicDir 'icon-512-maskable.png') -Maskable $true
Render-Icon -Size 64 -OutPath (Join-Path $publicDir 'favicon.png')

$source.Dispose()

Write-Host ""
Write-Host "Done. Icons regenerated from logo." -ForegroundColor Cyan
Write-Host "Don't forget to git add public/*.png + commit + push." -ForegroundColor Yellow
