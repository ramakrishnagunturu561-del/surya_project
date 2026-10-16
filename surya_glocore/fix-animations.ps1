# fix-animations.ps1
# Automates GSAP CDN path fix and injects animation-fix.js into all HTML files in the project.
param (
    [string]$Root = "."
)

$ErrorActionPreference = "Stop"

Write-Host "Scanning HTML files in $Root..." -ForegroundColor Cyan
$htmlFiles = Get-ChildItem -Path $Root -Filter "*.html" -Recurse

$gsapCount = 0
$scriptCount = 0

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false

    # 1. Fix GSAP broken path if not yet pointing to full CDN or with fallback
    if ($content -match 'src=["'']cdnjs\.cloudflare\.com/ajax/libs/gsap/3\.12\.5/gsap\.min') {
        $replacement = @"
<script id="gsap-js" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script>window.gsap || document.write('<script src="cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min03ec.js"><\/script>');</script>
<script id="gsap-scrolltrigger-js" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>window.ScrollTrigger || document.write('<script src="cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min03ec.js"><\/script>');</script>
"@
        $content = [System.Text.RegularExpressions.Regex]::Replace(
            $content,
            '<script id="gsap-js" src="[^"]*gsap\.min[^"]*"><\/script>\s*<script id="gsap-scrolltrigger-js" src="[^"]*ScrollTrigger\.min[^"]*"><\/script>',
            $replacement
        )
        $gsapCount++
        $modified = $true
    }

    # 2. Add animation-fix.js before </body> if not present
    if ($content -notmatch 'animation-fix\.js') {
        if ($content -match '<\/body>') {
            $content = $content.Replace('</body>', "<script src=`"animation-fix.js`"></script>`n</body>")
            $scriptCount++
            $modified = $true
        }
    }

    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "Done! GSAP updated in $gsapCount files. animation-fix.js added to $scriptCount files." -ForegroundColor Cyan
