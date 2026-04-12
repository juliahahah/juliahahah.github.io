# generate-photos.ps1
# Scans photos/episodes/<country>/ folders and writes photos-episodes.json.
# Run this script whenever you add new photos to any country folder, then commit.
#
# Usage:  .\generate-photos.ps1
# Output: photos-episodes.json (repo root)

$base   = Join-Path $PSScriptRoot "photos\episodes"
$result = [ordered]@{}

Get-ChildItem $base -Directory | Sort-Object Name | ForEach-Object {
    $country = $_.Name.ToLower()
    $files = Get-ChildItem $_.FullName -File |
             Where-Object { $_.Extension -imatch '\.(jpg|jpeg|png|webp)$' } |
             Sort-Object Name |
             ForEach-Object { "photos/episodes/$country/$($_.Name)" }
    if ($files) {
        $result[$country] = @($files)
    }
}

$out = Join-Path $PSScriptRoot "photos-episodes.json"
$result | ConvertTo-Json -Depth 3 | Set-Content $out -Encoding UTF8

Write-Host "✓ Generated $out"
Write-Host "  Countries: $($result.Keys -join ', ')"
Write-Host "  Total photos: $(($result.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum)"
